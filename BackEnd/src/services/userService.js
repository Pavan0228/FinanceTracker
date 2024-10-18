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
//!  Working Updated UserInput
export async function getUserMessagesById(userId) {
    try {
        // Fetch messages from /messages/Month-Year
        const messageSnapshot = await db
            .ref(`user/${userId}/messages/Month-Year`)
            .once("value");
        const messages = messageSnapshot.val();

        // Fetch inputs from /input
        const inputSnapshot = await db
            .ref(`user/${userId}/input`)
            .once("value");
        const inputs = inputSnapshot.val();

        const messageArray = [];

        // Process messages from /messages/Month-Year
        if (messages) {
            for (const monthYear in messages) {
                const monthMessages = messages[monthYear];
                for (const msg in monthMessages) {
                    const message = monthMessages[msg];
                    messageArray.push({
                        amount: decrypt(message.amount),
                        date: message.dateTime.split(" ")[0], // Extract just the date part
                        sender: message.sender,
                        type: decrypt(message.type),
                    });
                }
            }
        }

        // Process inputs from /input
        if (inputs) {
            for (const year in inputs) {
                const yearlyInputs = inputs[year];
                for (const month in yearlyInputs) {
                    const monthlyInputs = yearlyInputs[month];
                    for (const inputId in monthlyInputs) {
                        const input = monthlyInputs[inputId];
                        messageArray.push({
                            amount: input.amount, // No decryption needed if stored as plain text
                            date: input.date, // Convert input date to DD/MM/YYYY
                            sender: "User Input", // Default sender for user inputs
                            type: input.type, // Assuming input.type is already in plain text
                        });
                    }
                }
            }
        }

        // Sort the combined messages by date
        messageArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        return messageArray;
    } catch (error) {
        console.error("Error retrieving user messages:", error);
        throw new Error("Failed to retrieve user messages");
    }
}

// Function to calculate total debits and credits

//!  Working with userInput
export const calculateTotalDebitsAndCredits = (messages) => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (messages) {
        for (const message of messages) {
            // Iterate over the messages array
            const amount = parseFloat(message.amount.replace(/,/g, ""));

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

//!working with userInput
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

//!working with userInput
export async function getUserMonthlyMessagesById(userId, monthYear) {
    try {
        console.log(monthYear)
        // Fetch messages from the specified user
        const messagesSnapshot = await db
            .ref(`user/${userId}/messages/Month-Year/${monthYear}`)
            .once("value");
        const messages = messagesSnapshot.val() || {};
        //split last 4 digits as year from monthYear
        const year = monthYear.slice(2, 6);
        const month = monthYear.slice(0, 2);
        console.log(year,month)
        // Fetch input entries for the specified user
        const inputSnapshot = await db
            .ref(`user/${userId}/input/2024/10`)
            .once("value");
        const inputs = inputSnapshot.val() || {};

        // Combine messages and inputs
        const combinedArray = [];

        // Process messages
        for (const key in messages) {
            const msg = messages[key];
            combinedArray.push({
                amount: decrypt(msg.amount),
                date: msg.dateTime,
                sender: msg.sender,
                type: decrypt(msg.type),
                timestamp: key, // Add the key as a timestamp
                source: 'message', // Mark as a message
            });
        }

        // Process inputs
        for (const key in inputs) {
            const input = inputs[key];
            combinedArray.push({
                amount: input.amount,
                date: input.date, // Assuming input date is already in the correct format
                sender: userId, // You can modify this as needed
                type: input.type,
                timestamp: key, // Add the key as a timestamp
                source: 'input', // Mark as an input
            });
        }

        // Sort the combined array by date (descending)
        combinedArray.sort((a, b) => new Date(b.date.split("/").reverse().join("-")) - new Date(a.date.split("/").reverse().join("-")));

        return combinedArray;
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
        const snapshot = await db
            .ref(`user/${userId}/messages/Month-Year`)
            .once("value");
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
                        const decryptedYear = parseInt(
                            dateObject.split("/")[2],
                            10
                        );
                        if (decryptedYear === parseInt(year, 10)) {
                            decryptedMessages.push({
                                amount: parseFloat(
                                    decryptedAmount.replace(/,/g, "")
                                ), // Remove commas before parsing
                                date: decryptedDate,
                                sender: msg.sender || "Unknown",
                                type: decryptedType,
                                messageId: messageId,
                            });
                        }
                    } catch (decryptError) {
                        console.error(
                            "Error decrypting message:",
                            messageId,
                            decryptError
                        );
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
