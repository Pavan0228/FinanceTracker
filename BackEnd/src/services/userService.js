import { db } from "../config/firebaseConfig.js"; // Import the db object

import { createHash, createDecipheriv } from "crypto";

const MY_SECRET_KEY = "@7djsridher";

// Function to generate the AES key (same as in Java)
function generateKey() {
    const hash = createHash("sha256").update(MY_SECRET_KEY).digest(); // SHA-256 hash
    return hash.slice(0, 16); // Use only the first 16 bytes (AES-128 key)
}

// Function to decrypt AES-encrypted text in base64 format
function decrypt(encryptedText) {
    const key = generateKey();
    const decipher = createDecipheriv("aes-128-ecb", key, null); // ECB mode, no IV
    decipher.setAutoPadding(true); // Ensure PKCS5/PKCS7 padding is handled

    let decrypted = decipher.update(encryptedText.trim(), "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Function to create or update user data
export async function createUser(userData) {
    const userRef = db.ref(`users/${userData.id}`);
    await userRef.set(userData);
}

// Function to get user data by ID
export async function getUserDataById(userId) {
    try {
        const snapshot = await db.ref(`user/${userId}`).once("value");
        const userData = snapshot.val();

        // Check if user data exists and is not an empty object
        if (userData) {
            // The data is nested under the userId key
            return userData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error retrieving user data:", error);
        throw new Error("Failed to retrieve user data");
    }
}

export async function getUserMessagesById(userId) {
    try {
        const snapshot = await db.ref(`user/${userId}/messages`).once("value");
        const messages = snapshot.val();

        // Check if messages exist and convert to an array
        if (messages) {
            const messageArray = Object.values(messages); // Convert object to array
            // Decrypt the messages
            const decryptedMessages = messageArray.map((msg) => ({
                amount: decrypt(msg.amount),
                date: decrypt(msg.date),
                sender: msg.sender,
                type: decrypt(msg.Type),
            }));

            decryptedMessages.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            return decryptedMessages;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error retrieving user messages:", error);
        throw new Error("Failed to retrieve user messages");
    }
}

// Function to calculate total debits and credits
export const calculateTotalDebitsAndCredits = (messages) => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (messages) {
        for (const messageId in messages) {
            const message = messages[messageId];
            if (message.type === "Debited") {
                totalDebit += parseFloat(message.amount);
            } else if (message.type === "Credited") {
                totalCredit += parseFloat(message.amount);
            }
        }
    }

    return {
        totalDebit,
        totalCredit,
    };
};

export const monthlyDebitCredit = (messages, monthNumber) => {
    let totalDebit = 0;
    let totalCredit = 0;

    // Ensure monthNumber is valid (1-12)
    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Invalid month number. It should be between 1 and 12.");
    }

    if (messages) {
        for (const messageId in messages) {
            const message = messages[messageId];

            // Extract the date parts manually (DD/MM/YYYY format)
            const dateParts = message.date.split(" ")[0].split("/"); // "26/06/2024" => ["26", "06", "2024"]
            const messageDay = parseInt(dateParts[0], 10);
            const messageMonth = parseInt(dateParts[1], 10); // Month in number
            const messageYear = parseInt(dateParts[2], 10);

            // Check if the message's month matches the provided monthNumber
            if (messageMonth === monthNumber) {
                if (message.type === "Debited") {
                    totalDebit += parseFloat(message.amount);
                } else if (message.type === "Credited") {
                    totalCredit += parseFloat(message.amount);
                }
            }
        }
    }

    return {
        totalDebit,
        totalCredit,
    };
};

// export async function getUserMonthlyMessagesById(userId, month) {
//     try {
//         const snapshot = await db.ref(`user/${userId}/messages`).once("value");
//         const messages = snapshot.val();

//         if (messages) {
//             const messageArray = Object.values(messages);

//             const filteredMessages = messageArray.filter((msg) => {
//                 const decryptedDate = decrypt(msg.date);
//                 const dateParts = decryptedDate.split('/');
//                 const messageMonth = dateParts[1];
//                 return messageMonth === month;
//             });

//             const decryptedMessages = filteredMessages.map((msg) => ({
//                 amount: decrypt(msg.amount),
//                 date: decrypt(msg.date),
//                 sender: msg.sender,
//                 type: decrypt(msg.Type),
//             }));

//             decryptedMessages.sort((a, b) => new Date(b.date) - new Date(a.date));

//             return decryptedMessages;
//         } else {
//             return [];
//         }
//     } catch (error) {
//         console.error("Error retrieving monthly messages:", error);
//         throw new Error("Failed to retrieve monthly messages");
//     }
// }

export async function getUserMonthlyMessagesById(userId, monthYear) {
    try {
        // Fetch the messages for the specified user
        const snapshot = await db
            .ref(`user/${userId}/messages/Month-Year/${monthYear}`)
            .once("value");
        const messages = snapshot.val();

        if (messages) {
            const messageArray = Object.keys(messages).map((key) => ({
                ...messages[key], // Decrypt data
                timestamp: key, // Add the key as a timestamp
            }));

            const decryptedMessages = messageArray.map((msg) => ({
                    amount: decrypt(msg.amount),
                    date: decrypt(msg.encryptedDateTime), // Use the `dateTime` field for the actual date
                    sender: msg.sender,
                    type: decrypt(msg.type), // Ensure type is decrypted correctly
                    timestamp: msg.timestamp, // Include timestamp for sorting
            }));

            // Sort the messages by date (descending)
            decryptedMessages.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            return decryptedMessages;
        } else {
            return []; // Return empty array if no messages found
        }
    } catch (error) {
        console.error("Error retrieving monthly messages:", error);
        throw new Error("Failed to retrieve monthly messages");
    }
}


//kam nhi kar rha hai

export async function getUserYearlyMassagesById(userId, year) {
    try {
        const snapshot = await db
            .ref(`user/${userId}/messages/Month-Year`)
            .once("value");
        const messages = snapshot.val(); // All month-year messages

        if (messages) {
            const filteredMessages = Object.keys(messages).filter(
                (monthYear) => {
                    const messageYear = monthYear.substring(2);
                    return messageYear === year;
                }
            );

            const decryptedMessages = Object.keys(messages).map(key => {
                const transaction = messages[key];
            
                return {
                    amount: transaction.amount ? decrypt(transaction.amount) : null,
                    dateTime: transaction.dateTime,  // No decryption needed
                    encryptedDateTime: transaction.encryptedDateTime,  // Keep it as is if needed
                    sender: transaction.sender || "Unknown",  // Default to "Unknown" if sender is missing
                    type: transaction.type ? decrypt(transaction.type) : null,
                };
            });

            console.log("msg",decryptedMessages);

            const validMessages = decryptedMessages.filter(
                (msg) => msg.date && msg.amount
            );

            validMessages.sort((a, b) => new Date(b.date) - new Date(a.date));

            return validMessages;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error retrieving yearly messages:", error);
        throw new Error("Failed to retrieve yearly messages");
    }
}
