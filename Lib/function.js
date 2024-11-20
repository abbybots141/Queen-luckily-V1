// Import required modules
const twilio = require('twilio');
const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Twilio credentials (replace with your own from the Twilio Console)
const accountSid = 'your_account_sid';
const authToken = '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';
const twilioNumber = 'whatsapp:+2347032411938';  // Twilio WhatsApp Sandbox number

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Start HTTP server to handle incoming messages
const server = http.createServer((req, res) => {
  const query = url.parse(req.url, true).query;
  const from = query.From;
  const body = query.Body;

  // Respond with a WhatsApp message
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(`
    <Response>
      <Message>
        ${generateResponse(body)}
      </Message>
    </Response>
  `);

  // Send a reply via Twilio API
  sendMessage(from, generateResponse(body));
});

// Generate a response based on the incoming message
function generateResponse(message) {
  const lowerCaseMessage = message.toLowerCase();

  // Basic bot logic
  if (lowerCaseMessage.includes('hello')) {
    return 'Hi there! How can I help you today?';
  } else if (lowerCaseMessage.includes('bye')) {
    return 'Goodbye! Have a great day!';
  } else if (lowerCaseMessage.includes('help')) {
    return 'I can help you with the following commands: \n1. "hello" - Greets you. \n2. "bye" - Says goodbye.';
  } else {
    return 'Sorry, I didn\'t understand that. Type "help" for a list of commands.';
  }
}

// Send a WhatsApp message using Twilio API
function sendMessage(to, message) {
  client.messages.create({
    body: message,
    from: twilioNumber,
    to: to,
  })
  .then((message) => console.log(`Message sent to ${to}: ${message.sid}`))
  .catch((error) => console.error('Error sending message:', error));
}

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});