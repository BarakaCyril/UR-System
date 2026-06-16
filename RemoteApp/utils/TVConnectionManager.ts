//Contains raw string schemas
//Parses them into binary serializers
//exposes them to open a TLS socket
import TcpSocket from 'react-native-tcp-socket'
import protobuf from 'protobufjs'
import { CryptoManager } from './CryptoManager';

//1.Raw schema string

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

    private static pairingRoot = protobuf.parse(PAIRING_SCHEMA).root;
    private static pairingSocket: any = null;

    /**
   * Initiates the TLS connection to Port 6466. - Initial pairing
   * Just making this connection forces the TV to display the PIN code!
   */

    static async startPairing(tvIpAddress: string): Promise<void> {
        try{
            console.log(`Fetching Crypto Identity...`);
            const identity = await CryptoManager.getClientIdentity();

            console.log(`Connecting to TV at ${tvIpAddress}:6466...`);

            // 2. Open the secure TLS socket using our custom certificate
            this.pairingSocket = TcpSocket.connectTLS({
                host: tvIpAddress,
                port: 6466,
                cert: identity.certPem,
                key: identity.privateKeyPem,
                tlsCheckValidity: false
            }, ()=> {
                console.log('TLS Socket Connected! The TV should now show the PIN code.')

                // Once connected, we send the initial byte to start the handshake protocol
                this.sendInitialPairingMessage();
            });

            // Listen for incoming data from the TV
            this.pairingSocket.on('data', (data: Buffer) => {
                console.log(`Received ${data.length} bytes from TV.`);
                // We  decode this binary data in the next step!

                //let's check if the weapper eexposes the TLS session details
                if (typeof this.pairingSocket.getPeerCertificate === 'function'){
                    const peerCert = this.pairingSocket.getPeerCertificate();
                    console.log("Successfully intercepted the TV's dynamic certificate:", peerCert);
                }else{
                    console.log("Native socket wrapper does not expose getPeerCertificate to JS.");
                }
            });

            this.pairingSocket.on('error', (error: any) => {
                console.error('Socket Error:', error);
            });

            this.pairingSocket.on('close', () => {
                console.log(' Socket Closed.');
            });
        }catch(error){
            console.error('Failed to start pairing:', error);
        }
    }


    //Sendd the very first message (pairing request)
    private static sendInitialPairingMessage() {
        const PairingRequest = this.pairingRoot.lookupType("PairingRequest");

        //create payload
        const payload = {
            client_name: "My Custom Remote",
            service_name: "Device Pairing"
        }

        //Verify and encode to binary
        const errMsg = PairingRequest.verify(payload);
        if (errMsg) throw Error(errMsg);
        const message = PairingRequest.create(payload);
        const buffer = PairingRequest.encode(message).finish();

        // The Android TV protocol requires a 1-byte length prefix before every message
        const lengthPrefix = Buffer.from([buffer.length]);
        const finalPayload = Buffer.concat([lengthPrefix, buffer]);

        console.log(" Sending Pairing Request to TV...");
        this.pairingSocket.write(finalPayload);
    }

}