// Import required modules
const os = require('os');
const { Config, runtime, formatp, tiny, fancytext, readmore, commandCategories } = require('./utils');  // Assuming utils.js has the necessary functions
const currentDate = new Date().toLocaleDateString();  // Get current date in a simple format

// Function to generate the bot menu
async function showMenu(context) {
  try {
    // Set the desired menu design
    {
      header: "┏━━‧★ *{botname}* ★━━⦿\n",
      lineSeparator: "┃ ",
      commandPrefix: "🔥 ",
      footer: "━━━━━━━━━━━━━━━",
      emoji: "❃",
      greetingText: "Welcome to your serene command center!",
    },
    {
      header: "━━━✦ *{botname}* ✦━━━\n",
      lineSeparator: "┃ ",
      commandPrefix: "💯 ",
      footer: "━━━━━━━━━━━",
      emoji: "➤",
      greetingText: "Enjoy the magical commands!",
    },
    {
      header: "━━━━❃ *{botname}* ❃━━━━\n",
      lineSeparator: "┃ ",
      commandPrefix: "💀 ",
      footer: "━━━━━━━━━━━━━",
      emoji: "✦",
      greetingText: "Explore the enchanting commands below!",
    }
  ];
    // Start the menu content with bot information
    let menuContent = header;
    menuContent += lineSeparator + "⚡ *𝙾𝚆𝙽𝙴𝚁 𝙽𝙰𝙼𝙴:* " + Config.ownername + "\n";
    menuContent += lineSeparator + "⚡ *𝚄𝙿𝚃𝙸𝙼𝙴:* " + runtime(process.uptime()) + "\n";
    menuContent += lineSeparator + "⚡ *𝚁𝙰𝙼 𝚄𝚂𝙴:* " + formatp(os.totalmem() - os.freemem()) + "\n";
    menuContent += lineSeparator + "⚡ *𝙳𝙰𝚃𝙴:* " + currentDate + "\n";
    menuContent += lineSeparator + "⚡ *𝙱𝙾𝚃 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂:* " + commandCategories.length + "\n";
    menuContent += lineSeparator + greeting + "\n";  // Assuming greeting is a variable, add logic for it if needed

    // List commands by category
    for (const category in commandCategories) {
      menuContent += `${design.emoji} *${tiny(category)}* ${design.emojj}\n`; commandCategories[category].forEach(cmd => {
        menuContent += `${design.commandPrefix}${fancytext(cmd, 1)}\n`;
      });
    }
    
    // Final footer and credits
    menuContent += `${footer}\n\n${design.emoji} *${Config.botname}* - Μα∂ɛ βʏ Lσя∂ 𝗔ввʏ Ƭɛcн\n`;
    menuContent +=  `©βʏ ℓσя∂ 𝗔ввʏ Ƭɛcн\n${readmore}`;

    // Prepare the response object
    const response = {
      'caption': menuContent,
      'caption': menuContent,
      'contextInfo': {
        'forwardingScore': 100, 
        'isForwarded': false,
        'externalAdReply': {
          'title': 'Ǫʋɛɛи ℓʋcκιℓʏ Ѵ1',
          'sourceUrl': 'https://whatsapp.com/channel/0029VahOucpCcW4s1Zk3O61A'
        }
      },
      'ephemeralExpiration': 3000
    };

    // Send the menu
    await context.sendUi(context.chat, menuOptions, context);

    // Play soft background audio after sending the menu
    await sendAnimeBackgroundAudio(context, 'Queen luckily V1.mp3');

  } catch (error) {
    await context.error(`Error: ${error.message}`, error);
  }
});