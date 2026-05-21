import SecureLS from 'secure-ls';

let secureLS: SecureLS | null = null;

if (typeof window !== 'undefined') {
    // Handling potential ESM wrapping of CommonJS module
    const Constructor = (SecureLS as any).default || SecureLS;
    secureLS = new Constructor({ encodingType: 'aes', isCompression: false });
}

export const setSecureItem = (key: string, value: string) => {
    if (secureLS) secureLS.set(key, value);
};

export const getSecureItem = (key: string): any => {

    try {
        const encryptedToken: any = secureLS ? secureLS.get(key) : null;
        if (encryptedToken !== null) {
            if (encryptedToken) {

                return encryptedToken
            }
        }
    } catch (error) {
    }
};

export const removeSecureItem = (key: string) => {
    if (secureLS) secureLS.remove(key);
};
