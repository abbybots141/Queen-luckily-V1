// Import required libraries
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(), // Use local authentication (stores session)
});

// Listen for QR code generation (for the first time login)
client.on('qr', (qr) => {
    console.log('QR Code received, scan it with your WhatsApp mobile app.');
    qrcode.generate(qr, { small: true }); // Display QR code in terminal
});

// Triggered when the client is ready and connected to WhatsApp Web
client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
});

// Listen for incoming messages
client.on('message', message => {
    console.log(`Received message: ${message.body}`);
    
    // Respond to certain keywords or commands
    if (message.body.toLowerCase() === 'hello') {
        message.reply('Hello! How can I help you today?');
    } else if (message.body.toLowerCase() === 'bye') {
        message.reply('Goodbye! Have a great day!');
    } else {
        message.reply('Sorry, I did not understand that. Type "hello" to start.');
    }
});

// Initialize the client
client.initialize();
