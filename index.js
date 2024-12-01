const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { writeFileSync } = require("fs");
const readline = require("readline");

const { state, saveState } = useSingleFileAuthState("./auth_info.json");

const ownerNumber = "2347032411938"; // Replace with the owner's WhatsApp number

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, qr } = update;

        if (qr) {
            console.log("Scan this QR code to pair your WhatsApp:");
            console.log(qr);
        }

        if (connection === "open") {
            console.log("Please Type Your Number Example: 2347032411938");

            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question("Enter your number: ", async (userNumber) => {
                if (!userNumber.match(/^\d+$/)) {
                    console.log("Invalid number format. Please try again.");
                    rl.close();
                    process.exit(1);
                }

                const pairingCode = generatePairingCode();
                console.log(`Your Queen luckily V1 Pairing Code is ${pairingCode}`);
                console.log("Queen luckily V1 has been Connected Successfully");

                // Contact the owner on WhatsApp
                const message = `Ħι ℓσя∂ 𝗔ввʏ Ƭɛcн, Ǫʋɛɛи ℓʋcκιℓʏ Ѵ1 Ĵʋƨт Cσииɛcтɛ∂ Ƭσ мʏ Ɯнαтƨαρρ`;
                await sendMessage(sock, ownerNumber, message);

                rl.close();
            });
        }
    });

    sock.ev.on("creds.update", saveState);
}

function generatePairingCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

async function sendMessage(sock, number, text) {
    const formattedNumber = number.includes("@s.whatsapp.net") ? number : `${number}@s.whatsapp.net`;
    await sock.sendMessage(formattedNumber, { text });
}

startBot().catch((err) => {
    console.error("Error starting bot:", err);
});