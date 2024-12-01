const { default: makeWASocket, useMultiFileAuthState, downloadMediaMessage } = require("@whiskeysockets/baileys");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

// Function to process and extract text from images
async function extractTextFromImage(filePath) {
    try {
        const { data: { text } } = await Tesseract.recognize(filePath, "eng");
        return text;
    } catch (err) {
        console.error("Error during OCR:", err);
        return null;
    }
}

// Main WhatsApp bot logic
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({
        auth: state,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || !msg.key.remoteJid) return;

        const from = msg.key.remoteJid;
        const messageType = Object.keys(msg.message)[0];

        // Check if the message is an image or sticker
        if (messageType === "imageMessage" || messageType === "stickerMessage") {
            const media = await downloadMediaMessage(msg, "buffer");
            const filePath = path.join(__dirname, "temp_image.jpg");

            // Save the image locally
            fs.writeFileSync(filePath, media);

            // Extract text from the image
            const extractedText = await extractTextFromImage(filePath);
            if (extractedText) {
                await sock.sendMessage(from, { text: `Extracted Text:\n\n${extractedText}` });
            } else {
                await sock.sendMessage(from, { text: "Could not extract text from the image. Please try again with a clearer image." });
            }

            // Delete the temporary file
            fs.unlinkSync(filePath);
        } else if (messageType === "conversation") {
            const text = msg.message.conversation;

            // Help message
            if (text.toLowerCase() === "help") {
                await sock.sendMessage(from, {
                    text: "Send an image or sticker, and I'll extract text from it!",
                });
            }
        }
    });
}

startBot().catch(console.error);