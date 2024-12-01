const {
  smd,
  fetchJson,
  astroJson,
  fancytext,
  yt,
  getBuffer,
  smdBuffer,
  prefix,
  Config,
} = require("../lib");
const { search, download } = require("aptoide-scraper");
const googleTTS = require("google-tts-api");
const yts = require("secktor-pack");
const fs = require("fs-extra");
const axios = require("axios");
const fetch = require("node-fetch");
const path = require("path");
var videotime = 2000;
const { cmd } = require("../lib/plugins");



smd({
   pattern: "lyrics",
   desc: "gets lyrics of a particular music.",
   category: "downloader",
   filename: __filename,
   use: "<lyrics unstoppable by sia>"
 }, async (message, text) => {
   try {
     let replyText = message.reply_text ? message.reply_text : text;
     if (!replyText) {
       return message.reply("*ᴜsᴇ: .lyrics unstoppable by sia");
     }
     try {
       let language = text ? text.split(" ")[0].toLowerCase() : "en";
       const audioUrl = googleTTS.getAudioUrl(replyText, {
         lang: language,
         slow: true,
         host: "https://translate.google.com"
       });
       await message.bot.sendMessage(message.jid, {
         audio: { url: audioUrl },
         mimetype: "audio/mpeg",
         ptt: true,
         fileName: "Queen_NIKKA-Md-tts.m4a"
       }, { quoted: message });
     } catch (error) {
       const fallbackUrl = googleTTS.getAudioUrl(replyText, {
         lang: "en",
         slow: true,
         host: "https://translate.google.com"
       });
       await message.bot.sendMessage(message.jid, {
         audio: { url: fallbackUrl },
         mimetype: "audio/mpeg",
         ptt: true,
         fileName: "Queen_NIKKA-Md-tts.m4a"
       }, { quoted: message });
     }
   } catch (error) {
     return message.error(error + "\n\ncommand: tts", error, false);
   }
 });
 
 
 
smd({
  pattern: "play",
  react: "🎵",
  desc: "Play song from YouTube.",
  category: "music",
  filename: __filename,
  use: "<song name>",
}, async (message, text) => {
  try {
    // Check if user provided a song name
    if (!text) {
      return message.reply("Please provide a song name to search.");
    }

    // Search for song on YouTube
    let results = await yts(text);
    if (results.length === 0) {
      return message.reply("Sorry, I couldn't find any results for that song.");
    }

    // Get the first result (top song)
    let song = results[0];
    let songTitle = song.title;
    let songUrl = song.url;
    let songDuration = song.timestamp;
    let songThumbnail = song.thumbnail;
    let songLink = song.url;

    // Send details of the song
    let songDetails = `🎶 
    *_•Song Found!_* 🎶\n\n
    *_•Ƭιтℓɛ_*: ${songTitle}\n
    *_•Ɖʋяαтισи_*: ${songDuration}\n
    *_•Lιиκ_*: ${songLink}
    *_•Ѵιɛωƨ_*: ${songViews}\n
    *_•Ʋρℓσα∂ Ɖαтɛ_*: ${songUploadDate}\n
    *_•𝗔ʋтнσя_*: ${songAuthor}\n`;
    await message.reply(songDetails);

    // Download the song (using YouTube URL)
    await message.reply("Ǫʋɛɛи ℓʋcκιℓʏ ιƨ ∂σωиℓσα∂ιиɢ тнɛ ƨσиɢ...");
    
    // Use the new API to download links
    const downloadApiUrl = "https://widipe.com/download/ytdl?url=" + encodeURIComponent(video.url);
    let retryCount = 3; // Retry logic

    while (retryCount > 0) {
      try {
        const response = await axios.get(downloadApiUrl);
        const data = response.data;

        if (data.status && data.result.mp3) {
          const mp3Url = data.result.mp3;

          // Download the mp3 file
          const audioResponse = await axios({
            url: mp3Url,
            method: "GET",
            responseType: "stream"
          });
          const filePath = path.join(__dirname, video.title + ".mp3");
          const fileStream = fs.createWriteStream(filePath);
          audioResponse.data.pipe(fileStream);

          await new Promise((resolve, reject) => {
            fileStream.on("finish", resolve);
            fileStream.on("error", reject);
          });

          console.log("Audio saved to " + filePath);

          // Send the audio file
          await message.bot.sendMessage(message.jid, {
            audio: { url: filePath },
            fileName: video.title + ".mp3",
            mimetype: "audio/mpeg"
          }, { quoted: message });

          fs.unlinkSync(filePath); // Delete the file after sending
          return;
        } else {
          console.log("Error: Could not download audio, API response:", data);
          await message.reply("*_Error: Could not download the audio. Please try again later!_*");
          return;
        }
      } catch (error) {
        console.error("Retry Error:", error);
        retryCount--;
        if (retryCount === 0) {
          await message.reply("*_Error: Could not download the audio after multiple attempts. Please try again later!_*");
        }
      }
    }
  } catch (error) {
    console.error("Caught Error:", error);
    return message.error(error + "\n\ncommand: play", error, "*_File not found!!_*");
  }
});


smd(
  {
    pattern: "wastalk",
    desc: "Get information about a WhatsApp channel.",
    category: "stalker",
    filename: __filename,
    use: "<channel_url>",
  },
  async (m, channelUrl) => {
    try {
      if (!channelUrl) {
        return await m.send("*_Please provide a WhatsApp channel URL!_*");
      }

      const apiUrl = `https://api.giftedtech.my.id/api/stalk/wachannel?url=${encodeURIComponent(
        channelUrl
      )}&apikey=gifted`;
      
      const response = await axios.get(apiUrl);

      if (response.status !== 200 || !response.data.success) {
        return await m.send(
          `*_Error: ${response.status} ${response.statusText}_*`
        );
      }

      const data = response.data.result;

      if (!data) {
        return await m.send("*_No channel information found!_*");
      }

      const {
        img,
        title,
        followers,
        description,
      } = data;

      const caption = `
*WhatsApp Channel Information*

> *Channel Name:* ${title}
> *Followers:* ${followers}
> *Description:* ${description}
`;

      await m.bot.sendFromUrl(
        m.from,
        img,
        caption,
        m,
        {},
        "image"
      );
    } catch (e) {
      await m.error(`${e}\n\ncommand: wachannelstalk`, e);
    }
  }
);





 smd({
  pattern: "instagram2",
  alias: ["insta", "ig"],
  desc: "Download media from Instagram.",
  category: "downloader",
  filename: __filename,
  use: "<url>",
}, async (m, providedUrl = "") => {
  try {
    const url = providedUrl.trim(); // Trim any leading/trailing whitespace
    if (!url) {
      return await m.send("*_Please provide an Instagram URL!_*");
    }

    const apiUrl = `https://api.neoxr.eu/api/insta?url=${encodeURIComponent(url)}&apikey=mcandy`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return await m.send(`*_Error: ${response.status} ${response.statusText}_*`);
    }

    const data = await response.json();
    
    if (!data.status || data.status !== 200) {
      return await m.send(`*_Error: ${data.status} - ${data.message || "Unknown error"}_*`);
    }

    const mediaData = data.data;  // Assuming the API response contains media data in 'data'
    
    if (!mediaData) {
      return await m.send("*_No media found!_*");
    }

    const { thumbnail, url: mediaUrl, watermark } = mediaData; // Adjust keys based on API response structure
    const caption = `*Watermark:* ${watermark ? watermark : "No watermark"}\n\n_Note: This media may have a watermark._`;

    await m.bot.sendFromUrl(m.from, thumbnail, caption, m, {}, "image");
    await m.bot.sendFromUrl(m.from, mediaUrl, "", m, {}, "video");
  } catch (e) {
    await m.error(`${e}\n\ncommand: instagram2`, e);
  }
});





smd(
  {
    pattern: "wagroup",
    desc: "Get information about a WhatsApp Group.",
    category: "stalker",
    filename: __filename,
    use: "<channel_url>",
  },
  async (m, channelUrl) => {
    try {
      if (!channelUrl) {
        return await m.send("*_Please provide a WhatsApp channel URL!_*");
      }

      const apiUrl = `https://api.giftedtech.my.id/api/stalk/wagroup?url=${encodeURIComponent(
        channelUrl
      )}&apikey=gifted`;
      
      const response = await axios.get(apiUrl);

      if (response.status !== 200 || !response.data.success) {
        return await m.send(
          `*_Error: ${response.status} ${response.statusText}_*`
        );
      }

      const data = response.data.result;

      if (!data) {
        return await m.send("*_No channel information found!_*");
      }

      const {
        img,
        title,
        followers,
        description,
      } = data;

      const caption = `
*WhatsApp Group Information*

> *Group Name:* ${title}
> *Participants:* ${participants}
> *Description:* ${description}
`;

      await m.bot.sendFromUrl(
        m.from,
        img,
        caption,
        m,
        {},
        "image"
      );
    } catch (e) {
      await m.error(`${e}\n\ncommand: wagroupstalk`, e);
    }
  }
);

