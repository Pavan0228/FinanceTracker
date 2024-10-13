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

//! Function to get user data by ID

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
//!  Working
export async function getUserMessagesById(userId) {
    try {
        const snapshot = await db.ref(`user/${userId}/messages/Month-Year`).once("value");
        const messages = snapshot.val();
        // Check if messages exist and convert to an array
        if (messages) {
            const messageArray = [];
            

            // Iterate over each month-year object
            for (const monthYear in messages) {
                const monthMessages = messages[monthYear];
                
                // Iterate over each message in the month-year
                for (const msg in monthMessages) {
                    const message = monthMessages[msg];

                    // Decrypt the messages and push to the array
                    messageArray.push({
                        amount: decrypt(message.amount),
                        date: message.dateTime.split(" ")[0], // Extract just the date part
                        sender: message.sender,
                        type: decrypt(message.type),
                    });
                }
            }

            // Sort messages by date
            messageArray.sort((a, b) => new Date(b.date) - new Date(a.date));
            return messageArray;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error retrieving user messages:", error);
        throw new Error("Failed to retrieve user messages");
    }
}

// Function to calculate total debits and credits

//!  Working
export const calculateTotalDebitsAndCredits = (messages) => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (messages) {
        for (const message of messages) {
            // Iterate over the messages array
            const amount = parseFloat(message.amount); // Accessing amount from the message object

            if (message.type === "Debited") {
                totalDebit += amount || 0; // Add amount if it's a debit
            } else if (message.type === "Credited") {
                totalCredit += amount || 0; // Add amount if it's a credit
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
                date: msg.dateTime, // Use the `dateTime` field for the actual date
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
// Function to get user yearly messages by ID
export async function getUserYearlyMessagesById(userId, year) {
    try {
        console.log("Fetching data for user:", userId, "and year:", year);

        // Fetch the 'Month-Year' data for the user
        const snapshot = await db.ref(`user/${userId}/messages/Month-Year`).once("value");
        const userData = snapshot.val();

        if (!userData) {
            console.log("No user data found for ID:", userId);
            return [];
        }

        const decryptedMessages = [];

        // Loop through each month-year key (e.g., 'MMYYYY')
        for (const monthYear in userData) {

            const messageYear = parseInt(monthYear.slice(2, 6), 10); // Extract the 'YYYY'

            if (messageYear === parseInt(year, 10)) {
                const monthMessages = userData[monthYear];
                // Loop through messages for the specific month
                for (const messageId in monthMessages) {
                    const msg = monthMessages[messageId];
                    try {
                        // Decrypt the necessary fields
                        const decryptedAmount = decrypt(msg.amount);
                        const decryptedDate = msg.dateTime;
                        const decryptedType = decrypt(msg.type);
                        // Verify if the decrypted date falls within the correct year
                        const dateObject = decryptedDate;
                        //split decrypted year after dd/mm/ till /yyyy
                        const decryptedYear = parseInt(dateObject.split('/')[2], 10);
                        if (decryptedYear === parseInt(year, 10)) {
                            decryptedMessages.push({
                                amount: parseFloat(decryptedAmount),
                                date: decryptedDate,
                                sender: msg.sender || "Unknown",
                                type: decryptedType,
                                messageId: messageId,
                            });
                        }
                    } catch (decryptError) {
                        console.error("Error decrypting message:", messageId, decryptError);
                        // Optionally skip the message if decryption fails
                    }
                }
            }
        }

        // Sort messages by date (descending)
        decryptedMessages.sort((a, b) => new Date(b.date) - new Date(a.date));

        return decryptedMessages;
    } catch (error) {
        console.error("Error in getUserYearlyMessagesById:", error);
        throw new Error("Failed to retrieve yearly messages");
    }
}