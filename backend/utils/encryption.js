import crypto from 'crypto';
import 'dotenv/config';

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.DB_ENCRYPTION_KEY); // Must be 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

export function encryption(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    // We store the IV and the encrypted data together, separated by a colon
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text) {
    const [ivPart, encryptedPart] = text.split(':');
    const iv = Buffer.from(ivPart, 'hex');
    const encryptedText = Buffer.from(encryptedPart, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}