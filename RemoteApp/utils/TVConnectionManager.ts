// Contains raw string schemas
// Parses them into binary serializers
// Exposes them to open a TLS socket
import protobuf from 'protobufjs'
import { CryptoManager } from './CryptoManager';

// Import our custom native module functions (removed TcpSocket entirely)
import { 
  connectTLS, 
  sendTLS, 
  disconnectTLS, 
  addDataListener, 
  addErrorListener, 
  addCloseListener 
} from '@/modules/expo-tv-tls';
import { Buffer } from 'buffer';
import { EventEmitter } from 'stream';

// 1. Raw schema string
const PAIRING_SCHEMA = `
syntax = "proto3";
message PairingRequest { string client_name = 1; string service_name = 2; }
message PairingRequestAck { string server_name = 1; }
message PairingOption { int32 preferred_role = 1; int32 input_encoding = 2; }
message PairingConfiguration { PairingOption client_role = 1; }
message PairingConfigurationAck { PairingOption server_role = 1; }
message Secret { bytes secret = 1; }
`;

export class TVConnectionManager {

    // These must be 'static' so they can be accessed inside your static methods!
    private static dataSub: { remove: () => void } | null = null;
    private static errorSub: { remove: () => void } | null = null;
    private static closeSub: { remove: () => void } | null = null;

    //The acummulator buffer
    private static receiveBuffer = Buffer.alloc(0);

    private static pairingRoot = protobuf.parse(PAIRING_SCHEMA).root;

    /**
    * Initiates the TLS connection to Port 6466. - Initial pairing
    * Just making this connection forces the TV to display the PIN code!
    */
    private static processReceiveBuffer() {
        // We need at least 1 byte to read the length prefix
        while (this.receiveBuffer.length > 0){
            const messageLength = this.receiveBuffer[0];
            const totalRequiredLength = 1 + messageLength

            //do we have the full message yet?
            if (this.receiveBuffer.length >= totalRequiredLength) {
                // slice the payload (skip the  1 byte prefix)
                const payload = this.receiveBuffer.subarray(1, totalRequiredLength);

                //chop the processed message off the front of the buffer
                this.receiveBuffer = this.receiveBuffer.subarray(totalRequiredLength)

                //handle the complete payload
                this.handleIncomingMessage(payload);
            }else{
                break; //we don't have the full mesasage, break the loop and wait for the next oncoming chunk
            }
        }
    }

    //Decode the complete payload   
    private static handleIncomingMessage(payload: Buffer){
        try {
            // right now I expect the TV's response to my PairingRequest
            const PairingRequestAck = this.pairingRoot.lookupType("PairingRequestAck");

            const decodedAck = PairingRequestAck.decode(payload);
            if (decodedAck.server_name) {
                console.log(`TV Acknowledged! TV Name: ${decodedAck.server_name}`);
                this.sendPairingConfiguration();
                return;
            }

            
        }catch(error){
            console.error("Failed to decode Protobuf message:", error);
        }
    }

   



    static async startPairing(tvIpAddress: string) {
    try {
        console.log(`Fetching Crypto Identity...`);
        const identity = await CryptoManager.getClientIdentity();

        console.log(`Connecting to TV at ${tvIpAddress}:6466 via Native TLS...`);

        // Clear any old subscriptions or open sockets first to stay safe
        this.disconnect();

        // 1. Listen for incoming data from the TV (Registered BEFORE connection)
        this.dataSub = addDataListener((event) => {                
            const chunk = Buffer.from(event.data, 'base64');
            // Concat the new chunk onto our existing buffer
            this.receiveBuffer = Buffer.concat([this.receiveBuffer, chunk]);
            this.processReceiveBuffer();
        });

        this.errorSub = addErrorListener((event) => {
            console.error('Socket Error:', event.error);
        });

        this.closeSub = addCloseListener(() => {
            console.log('Socket Closed.');
            this.cleanupSubscriptions();
        });

        // 2. Open the secure TLS socket natively
        const isConnected = await connectTLS(
            tvIpAddress, 
            6467, 
            identity.certPem, 
            identity.privateKeyPem
        );

        if (isConnected) {
            console.log('TLS Socket Connected!');

            // Once connected, we send the initial byte to start the handshake protocol
            this.sendInitialPairingMessage();
        }

    } catch (error) {
        console.error('Failed to start pairing:', error);
        this.cleanupSubscriptions();
    }
    }

    // Send the very first message (pairing request)
    private static sendInitialPairingMessage() {
        const PairingRequest = this.pairingRoot.lookupType("PairingRequest");

        // Create payload
        const payload = {
            client_name: "My Custom Remote",
            service_name: "Device Pairing"
        }

        // Verify and encode to binary
        const errMsg = PairingRequest.verify(payload);
        if (errMsg) throw Error(errMsg);
        const message = PairingRequest.create(payload);
        const buffer = PairingRequest.encode(message).finish();

        // The Android TV protocol requires a 1-byte length prefix before every message
        const lengthPrefix = Buffer.from([buffer.length]);
        const finalPayload = Buffer.concat([lengthPrefix, buffer]);

        console.log("Sending Pairing Request to TV...");
        
        // FIXED: Convert binary buffer to a Base64 string before blasting to Kotlin
        sendTLS(finalPayload.toString('base64'));
    }

    // Helper to cleanly unbind listeners and avoid memory leaks
    private static cleanupSubscriptions() {
        if (this.dataSub) { this.dataSub.remove(); this.dataSub = null; }
        if (this.errorSub) { this.errorSub.remove(); this.errorSub = null; }
        if (this.closeSub) { this.closeSub.remove(); this.closeSub = null; }

        this.receiveBuffer = Buffer.alloc(0);
    }
    //Tell the tv we are a remote
    private static sendPairingConfiguration(){
        const PairingConfiguration = this.pairingRoot.lookupType("PairingConfiguration");

        //prefered role: 1 (Type: Control/input)
        //input_encoding: 3(Type: Numeric PIN code)

        const payload = {
            client_role: {
                preferred_role: 1,
                input_encoding: 3
            }
        }

        const errMsg = PairingConfiguration.verify(payload)
        if (errMsg) throw Error(errMsg);

        const message = PairingConfiguration.create(payload)
        const buffer = PairingConfiguration.encode(message).finish();

        // 1-byte length prefix
        const lengthPrefix = Buffer.from([buffer.length]);
        const finalPayload = Buffer.concat([lengthPrefix, buffer]);

        console.log("Sending Pairing configuration to TV...");
        sendTLS(finalPayload.toString('base64'));

    }

    // Public method to shut down the connection
    static disconnect() {
        disconnectTLS();
        this.cleanupSubscriptions();
        console.log(' Cleaned up TLS session and listeners.');
    }
}