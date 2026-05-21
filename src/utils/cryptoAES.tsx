import CryptoJS from 'crypto-js';
const { AES, enc } = CryptoJS;
const Utf8 = enc.Utf8;
import config from '../redux/services/config';



const AES_PREFIX = 'U2FsdGVkX1';

const DEFAULT_KEY = (config.cryptoKey ?? config.cryptoKey ?? '').trim();

export function encryptIfNeeded(value: string, key: string = DEFAULT_KEY): string {

    if (!value) return '';

    if (!key) return value;

    if (value.startsWith(AES_PREFIX)) return value;

    try {

        return AES.encrypt(JSON.stringify(value), key).toString();

    } catch (err) {

        console.error('Encryption error:', err);

        return value;

    }

}

export function decryptIfNeeded(value?: string, key: string = DEFAULT_KEY): string {

    if (!value) return '';

    if (!key) return value;

    if (!value.startsWith(AES_PREFIX)) return value;

    try {

        const bytes = AES.decrypt(value, key);

        const decrypted = bytes.toString(Utf8);

        return decrypted ? JSON.parse(decrypted) : '';

    } catch (err) {

        console.error('Decryption error:', err);

        return value;

    }

}
