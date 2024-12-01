const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Initialize the WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true },
});

// Example of music play handler
const smd = (
  {
    pattern,
    desc,
    category,
    filename,
    use,
  },
  async (m, songQuery) => {
    try {
      if (!songQuery) {
        return await m.send("*_Please provide the name of the song or artist!_*");
      }

      // Example API URL for a public music API (e.g., JioSaavn, SoundCloud, etc.)
      const apiUrl = `https://api.example.com/music/play?query=${encodeURIComponent(
        songQuery
      )}&apikey=your_api_key`;

      const response = await axios.get(apiUrl);

      // Check if the API response is successful
      if (response.status !== 200) {
        return await m.send(`*_Error: ${response.status} ${response.statusText}_*`);
      }

      const data = response.data;

      // Check for successful data response
      if (!data || !data.url) {
        return await m.send("*_An error occurred while fetching the music._*");
      }

      const { songTitle, artist, url } = data;

      // Sending the audio to the user
      await m.bot.sendFromUrl(m.from, url, `Playing: *${songTitle}* by *${artist}*`, m, {}, 'audio');

      m.send(`*_Now playing_* ${songTitle} by ${artist}`);

    } catch (error) {
      console.error('Error:', error);
      await m.send('*_Error: Unable to play the music._*');
    }
  }
);

// Client is initialized
client.on('ready', () => {
  console.log('WhatsApp client is ready!');
});

// Command handler to play music
client.on('message', async (message) => {
  if (message.body.startsWith('!play')) {
    const command = message.body.split(' ')[0]; // Extract the command part
    const songQuery = message.body.split(' ').slice(1).join(' '); // Extract the song name or artist

    // Check if the command is '!play' and trigger music play
    if (command === '!play' && songQuery) {
      await smd(
        {
          pattern: 'play',
          react: '🎵',
          desc: 'Play music directly in the chat.',
          category: 'media',
          filename: __filename,
          use: '<song_name>',
        },
        message,
        songQuery
      );
    }
  }
});

// Initialize WhatsApp client
client.initialize();

// Event: Client authenticated
client.on('authenticated', () => {
  console.log('Client authenticated!');
});

// Event: Client disconnected
client.on('disconnected', (reason) => {
  console.log('Client disconnected:', reason);
});