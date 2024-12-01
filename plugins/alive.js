astro_patch.smd(
  {
    pattern: "alive",
    desc: "Check if the bot is alive and latency",
    category: "user",
    filename: __filename,
  },
  async (message) => {
    try {
      const startTime = Date.now(); // Record the start time
      
      // Send an initial message to measure the response time
      const { key } = await message.reply("Checking bot's status...");
      
      // Calculate the time after the message has been sent
      const endTime = Date.now();
      const latency = endTime - startTime; // Latency in milliseconds
      
      // Prepare the bot status message
      let aliveMessage = `*Ǫʋɛɛи ℓʋcκιℓʏ Ѵ1 ιƨ αℓιvɛ!*\n`;
      aliveMessage += `⏱ Latency: ${latency} ms\n`;
      aliveMessage += `🕰 Uptime: ${runtime(process.uptime())}\n`; // You can use your uptime function here
      aliveMessage += `📅 Date: ${message.date}\n`;
      aliveMessage += `⏰ Current Time: ${message.time}\n`;
      aliveMessage += `🤖 Bot Name: ${Config.botname}\n`;
      aliveMessage += `💻 Owner: ${Config.ownername}`;
      
      // Send back the formatted message with bot's status and latency
      return await message.send(aliveMessage, { edit: key });
    } catch (error) {
      await message.error(error + "\nCommand:alive", error);
    }
  }
);