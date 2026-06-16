//This script checks if the phone already has a certificate saved in Expo's vault.
//If it doesn't (eg on the very first launch), it will generate a fresh RSA key pair
// and self-signed X.509 certificate

import forge from 'node-forge'
import * as SecureStore from 'expo-secure-store'


const CERT_KEY = 'android_tv_client_cert';
const PRIVATE_KEY = 'android_tv_private_key'

export interface CryptoIdentity {
    certPem: string
    privateKeyPem: string;
}


export class CryptoManager {
    /**
   * Retrieves the existing certificate or generates a new one if it's the first run.
   */

    static async getClientIdentity(forceRegenerate = false): Promise<CryptoIdentity> {
        try{
            if (forceRegenerate) {
                console.log("Force regenerating client identity...");
                return await this.regenerateClientIdentity();
            }

            const existingCert = await SecureStore.getItemAsync(CERT_KEY);
            const existingKey = await SecureStore.getItemAsync(PRIVATE_KEY);

            if (existingCert && existingKey) {
                console.log("Existing certificate found in SecureStore.");
                return { certPem: existingCert, privateKeyPem: existingKey };
            }
            

            console.log("No certificate found. Generating new RSA 2048 Keypair (this takes a few seconds)...");
            const identity = await this.generateCertificate();

            await SecureStore.setItemAsync(CERT_KEY, identity.certPem);
            await SecureStore.setItemAsync(PRIVATE_KEY, identity.privateKeyPem);
            
            console.log("New certificate successfully generated and saved!");
            return identity;


        }catch(error){
            console.error(" Cryptography Error:", error);
            throw error;
        }
    }

    static async clearStoredIdentity(): Promise<void> {
        await SecureStore.deleteItemAsync(CERT_KEY);
        await SecureStore.deleteItemAsync(PRIVATE_KEY);
    }

    static async regenerateClientIdentity(): Promise<CryptoIdentity> {
        await this.clearStoredIdentity();
        const identity = await this.generateCertificate();

        await SecureStore.setItemAsync(CERT_KEY, identity.certPem);
        await SecureStore.setItemAsync(PRIVATE_KEY, identity.privateKeyPem);

        console.log("New certificate successfully generated and saved after reset!");
        return identity;
    }

    private static generateCertificate(): Promise<CryptoIdentity>{
        return new Promise((resolve, reject) => {
            // 1. Generate a 2048-bit RSA Keypair
            forge.pki.rsa.generateKeyPair({bits: 2048, workers: -1}, (err, keypair) => {
                if (err) return reject(err);

                // 2. Create an empty X.509 certificate
                const cert = forge.pki.createCertificate();
                cert.publicKey = keypair.publicKey;
                cert.serialNumber = '01';

                // Make it valid from today until 10 years from now
                cert.validity.notBefore = new Date();
                cert.validity.notAfter = new Date();
                cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10);

                // 3. Set the Identity attributes
                const attrs = [{
                    name: 'commonName',
                    value: 'Expo Remote Client' // How the phone identifies itself
                }];
                cert.setSubject(attrs);
                cert.setIssuer(attrs); // Self-signed (Subject = Issuer)

                // 4. Sign the certificate with our own private key
                cert.sign(keypair.privateKey, forge.md.sha256.create());

                // 5. Convert to PEM string format for the TCP socket
                const certPem = forge.pki.certificateToPem(cert);
                const p8PrivateKey = forge.pki.wrapRsaPrivateKey(forge.pki.privateKeyToAsn1(keypair.privateKey));
                const privateKeyPem = forge.pki.privateKeyInfoToPem(p8PrivateKey);

                resolve({ certPem, privateKeyPem });
            });
        });
    }

}


//Generates a self-signed X.509 Certificate required by Google TV

