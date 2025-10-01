// JavaScript (Node.js)
const forge = require('node-forge');
const axios = require('axios');
const crypto = require('crypto');

class EncryptionDecryption {
    static Url = "https://idaas.iiflsecurities.com/v2/access/get/encKey";

    #clientPrivateKeyB64;
    #clientPublicKeyB64;
    #serverPublicKeyB64;

    constructor() {
        this.#GenerateRsaKeyPair();
    }

    async init() {
        if (!this.#serverPublicKeyB64) {
            await this.#GetServerKey();
        }
    }

    #GenerateRsaKeyPair() {
    try {
        const keyPair = forge.pki.rsa.generateKeyPair(2048);

        // Export PEMs
        const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);

        // Strip headers/footers and newlines → just the Base64 part
        this.#clientPublicKeyB64 = publicKeyPem
            .replace(/-----BEGIN PUBLIC KEY-----/, "")
            .replace(/-----END PUBLIC KEY-----/, "")
            .replace(/\r?\n|\r/g, "");

        this.#clientPrivateKeyB64 = privateKeyPem
            .replace(/-----BEGIN PRIVATE KEY-----/, "")
            .replace(/-----END PRIVATE KEY-----/, "")
            .replace(/\r?\n|\r/g, "");

        this.keyPair = keyPair;
    } catch (err) {
        console.error("Error generating RSA keypair:", err);
    }
    }

    async #GetServerKey() {
    try {
        const payload = { ceData: this.#clientPublicKeyB64 };
        const response = await axios.post(
            EncryptionDecryption.Url,
            payload,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.status === 200) {
            this.#serverPublicKeyB64 = response.data.cPubKey;
        } else {
            this.#serverPublicKeyB64 = null;
        }
    } catch (ex) {
        this.#serverPublicKeyB64 = null;
    }
  }

    // AES-CBC Encryption using forge
    async #encryptAES(data, aesKey, iv) {
        const cipher = forge.cipher.createCipher("AES-CBC", aesKey);
        cipher.start({ iv });
        cipher.update(forge.util.createBuffer(data, "utf8"));
        cipher.finish();
        return cipher.output.getBytes();
    }

    // Encrypt AES Key using RSA (PKCS1Padding)
    #encryptRSA(aesKey, serverPublicKey) {
        return serverPublicKey.encrypt(aesKey, "RSAES-PKCS1-V1_5");
    }

    // Encryption Function
    async Encrypt(data) {
    try {
        // Decode server's public key (DER)

        const serverPublicKey = await this.#importPublicKey(this.#serverPublicKeyB64);

        // Generate AES-256 key and IV
        const aesKey = forge.random.getBytesSync(32);  // 256-bit AES key
        const iv = forge.random.getBytesSync(16);  // 16-byte IV

        const encryptedData = await this.#encryptAES(data, aesKey, iv);

        const encryptedAesKey = this.#encryptRSA(aesKey, serverPublicKey);

        const clientPublicKeyBytes = new TextEncoder().encode(this.#clientPublicKeyB64);
        const ivBytes = Buffer.from(iv, 'binary');
        const encryptedAesKeyBytes = Buffer.from(encryptedAesKey, 'binary');
        const encryptedDataBytes = Buffer.from(encryptedData, 'binary');
        // Prepare payload using buffers only
        const buffer = new Uint8Array(
        4 + clientPublicKeyBytes.length +
        4 + ivBytes.length +
        4 + encryptedAesKeyBytes.length +
        encryptedDataBytes.length
    );

    let offset = 0;

    // Append Client Public Key
    buffer.set([(clientPublicKeyBytes.length >>> 24) & 0xff, (clientPublicKeyBytes.length >>> 16) & 0xff, (clientPublicKeyBytes.length >>> 8) & 0xff, clientPublicKeyBytes.length & 0xff], offset);
    offset += 4;
    buffer.set(clientPublicKeyBytes, offset);
    offset += clientPublicKeyBytes.length;

    // Append IV
    buffer.set([(ivBytes.length >>> 24) & 0xff, (ivBytes.length >>> 16) & 0xff, (ivBytes.length >>> 8) & 0xff, ivBytes.length & 0xff], offset);
    offset += 4;
    buffer.set(ivBytes, offset);
    offset += ivBytes.length;

    // Append Encrypted AES Key
    buffer.set([(encryptedAesKeyBytes.length >>> 24) & 0xff, (encryptedAesKeyBytes.length >>> 16) & 0xff, (encryptedAesKeyBytes.length >>> 8) & 0xff, encryptedAesKeyBytes.length & 0xff], offset);
    offset += 4;
    buffer.set(encryptedAesKeyBytes, offset);
    offset += encryptedAesKeyBytes.length;

    // Append Encrypted Data
    buffer.set(encryptedDataBytes, offset);

    return this.#bytesToBase64(buffer);
        } catch (ex) {
            return ex.toString();
        }
    }

    // Decryption Function
    async Decrypt(encryptedData) {
        try {
            // Convert PEM private key to forge key
            const privateKey =this.#importPrivateKey(this.#clientPrivateKeyB64);

            // Decode base64
            const encryptedBytes = forge.util.decode64(encryptedData);
            const byteBuffer = forge.util.createBuffer(encryptedBytes);

            // Read the packet format
            const serverPublicKeyLength = byteBuffer.getInt32();
             byteBuffer.getBytes(serverPublicKeyLength);

            const ivLength = byteBuffer.getInt32();
            const iv = byteBuffer.getBytes(ivLength);

            const encryptedAesKeyLength = byteBuffer.getInt32();
            const encryptedAesKey = byteBuffer.getBytes(encryptedAesKeyLength);

            const encryptedContent = byteBuffer.getBytes();

            // Decrypt AES key with RSA private key
            const aesKey = (await privateKey).decrypt(encryptedAesKey, 'RSAES-PKCS1-V1_5');

            // Decrypt content with AES
            const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
            decipher.start({ iv });
            decipher.update(forge.util.createBuffer(encryptedContent));
            decipher.finish();
            return decipher.output.data;

        } catch (ex) {
            return ex.toString();
        }
    }

    #bytesToBase64(bytes) {
    return Buffer.from(bytes).toString('base64');
    }

    // Import RSA Public Key (PEM Format)
    async #importPublicKey(serverPublicKeyString) {
        const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${serverPublicKeyString}\n-----END PUBLIC KEY-----`;
        return forge.pki.publicKeyFromPem(publicKeyPem);
    }
    // Import RSA Private Key (PEM Format)
    async #importPrivateKey(serverPrivateKeyString) {
    const publicKeyPem = `-----BEGIN PRIVATE KEY-----\n${serverPrivateKeyString}\n-----END PRIVATE KEY-----`;
    return forge.pki.privateKeyFromPem(publicKeyPem);
}
}

module.exports = EncryptionDecryption;
