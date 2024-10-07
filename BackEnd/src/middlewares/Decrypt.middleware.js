// // middlewares/decryptMiddleware.js
// import { createHash, createDecipheriv } from "crypto";
// import { getUserMessagesById } from "../services/userService.js";

// const MY_SECRET_KEY = "@7djsridher";

// function generateKey() {
//     const hash = createHash("sha256").update(MY_SECRET_KEY).digest(); // SHA-256 hash
//     return hash.slice(0, 16); // Use only the first 16 bytes (AES-128 key)
// }

// function decrypt(encryptedText) {
//     console.log("text recieved", encryptedText);
//     const key = generateKey();
//     const decipher = createDecipheriv("aes-128-ecb", key, null); // ECB mode, no IV
//     decipher.setAutoPadding(true); // Ensure PKCS5/PKCS7 padding is handled

//     let decrypted = decipher.update(encryptedText.trim(), "base64", "utf8");
//     decrypted += decipher.final("utf8");
//     console.log("decrypted", decrypted);
//     return decrypted;
// }

// // Middleware to decrypt messages
// export const decryptMessageMiddleware = async (req, res, next) => {
//     try {
//         const messages = req.messages;

//         const messageContents = messages.map((msg) => ({
//             amount: decrypt(msg.amount),
//             date: decrypt(msg.date),
//             sender: msg.sender,
//             type: decrypt(msg.Type)
//         }));
//         console.log(messageContents);
//         req.decryptedMessages = messageContents;

//         next();
//     } catch (error) {
//         console.error("Decryption error:", error.message);
//         res.status(500).send({ error: "Failed to decrypt messages" });
//     }
// };
