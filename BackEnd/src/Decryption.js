import { createHash, createDecipheriv } from 'crypto';

// The same secret key used in Java
const MY_SECRET_KEY = '@7djsridher';

// Method to generate the AES key (same as in Java)
function generateKey() {
    const hash = createHash('sha256').update(MY_SECRET_KEY).digest(); // SHA-256 hash
    
    return hash.slice(0, 16); // Use only the first 16 bytes (AES-128 key)
}

// Method to decrypt AES-encrypted text in base64 format
function decrypt(encryptedText) {
    const key = generateKey();
    const decipher = createDecipheriv('aes-128-ecb', key, null); // ECB mode, no IV
    // console.log(decipher)
    decipher.setAutoPadding(true); // Ensure PKCS5/PKCS7 padding is handled

    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example: Encrypted text from Java
const encryptedText = 'Xl2yVWdGgAYiwuTcXXLJ/L4iU3nmR0GQ9uXUeOSJu5w=';  // Replace with actual base64 encoded encrypted text from Java

// Decrypt and print the result
try {
    const decryptedText = decrypt(encryptedText);
    console.log("Decrypted text:", decryptedText);
} catch (error) {
    console.error("Decryption error:", error.message);
}