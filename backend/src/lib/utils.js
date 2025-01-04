import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
        httpOnly: true, // prevent XSS attacks
        sameSite: "strict", // prevents CSRF attacks
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
};

/**
 *  This function is to encode userId to send magic links
 *  At the moment it is being used to send email verification emails
 *  */
export const encodeObjectId = (objectId) => {
    if (typeof objectId !== 'string' || objectId.length !== 24 || !/^[a-f0-9]{24}$/.test(objectId)) {
        throw new Error("Input must be a 24-character hexadecimal string (MongoDB ObjectId).");
    }

    // Add padding to make sure the length is a multiple of 16 (AES block size)
    const padLength = 16 - (objectId.length % 16);
    const paddedData = objectId + '\0'.repeat(padLength);

    // Create AES Cipher in CBC mode
    const IV = crypto.randomBytes(16);  // 16 bytes for AES block size
    const SECRET_KEY = Buffer.from(process.env.LINK_ID_ENCODING_KEY, "base64");
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, IV);

    // Encrypt the padded string
    let encrypted = cipher.update(paddedData, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    // Convert the IV and encrypted userId to base64url (URL-safe Base64)
    const base64urlIV = IV.toString('base64')
                                 .replace(/\+/g, '-')
                                 .replace(/\//g, '_')
                                 .replace(/=+$/, '');
    const base64urlEncrypted = encrypted.replace(/\+/g, '-')
                                               .replace(/\//g, '_')
                                               .replace(/=+$/, '');

    // Return base64url-encoded string with IV prepended
    return base64urlIV + ':' + base64urlEncrypted
}

/**
 *  This function is to decode userId on magic links
 *  */
export const decodeLinkId = (linkId) => {
    try {
        // Extract the IV and encrypted userId from the base64url-encoded string
        const [base64urlIV, base64urlEncrypted] = linkId.split(':');

        // Convert from base64url to standard Base64
        const ivBase64 = base64urlIV.replace(/-/g, '+').replace(/_/g, '/') + '==';
        const encryptedBase64 = base64urlEncrypted.replace(/-/g, '+').replace(/_/g, '/') + '==';

        // Decode the IV from Base64
        const iv = Buffer.from(ivBase64, 'base64');
        const encryptedData = Buffer.from(encryptedBase64, 'base64');

        // Create AES Decipher with the same secret key and IV
        const SECRET_KEY = Buffer.from(process.env.LINK_ID_ENCODING_KEY, "base64");
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);

        // Decrypt the userId
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        // Remove padding (null characters added during encryption)
        return decrypted.replace(/\0+$/, '');
    } catch (error) {
        throw new Error("Failed to decode the linkId.");
    }
}

/**
 *  This function is to validate userId on magic links
 *  */
export const isValidLinkId = (linkId) => {
    try {
        // Check if the encrypted linkId has the correct format (IV and encrypted userId)
        const parts = linkId.split(':');
        if (parts.length !== 2) {
            return false;
        }

        // Convert from base64url to standard Base64
        const ivBase64 = parts[0].replace(/-/g, '+').replace(/_/g, '/') + '==';
        const encryptedBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/') + '==';

        // Decode the IV and encrypted userId from base64
        const iv = Buffer.from(ivBase64, 'base64');
        const encryptedData = Buffer.from(encryptedBase64, 'base64');

        // Ensure the IV is the correct length (16 bytes for AES-256-CBC)
        if (iv.length !== 16) {
            return false;
        }

        // Create AES Decipher with the same secret key and IV
        const SECRET_KEY = Buffer.from(process.env.LINK_ID_ENCODING_KEY, "base64");
        const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);

        // Decrypt the userId
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        // Remove padding (null characters added during encryption)
        const originalData = decrypted.replace(/\0+$/, '');

        // Check if the decrypted result is a valid userId
        return /^[a-f0-9]{24}$/.test(originalData);
    } catch (error) {
        // Decryption or validation failed
        return false;
    }
}