// stylish-font.js

// Define fonts with characters styled line by line
const fonts = {
    1: {
        name: 'Greek Style',
        chars: {
            "a": "α", 
            "b": "в", 
            "c": "c", 
            "d": "∂", 
            "e": "ε", 
            "f": "ƒ", 
            "g": "g", 
            "h": "н", 
            "i": "ι", 
            "j": "ϳ", 
            "k": "κ", 
            "l": "ℓ", 
            "m": "м", 
            "n": "η", 
            "o": "σ", 
            "p": "ρ", 
            "q": "q", 
            "r": "я", 
            "s": "ѕ", 
            "t": "т", 
            "u": "υ", 
            "v": "ν", 
            "w": "ω", 
            "x": "χ", 
            "y": "ү", 
            "z": "z", 
            "0": "0", 
            "1": "1", 
            "2": "2", 
            "3": "3", 
            "4": "4", 
            "5": "5", 
            "6": "6", 
            "7": "7", 
            "8": "8", 
            "9": "9"
        }
    },
    2: {
        name: 'Fancy Script',
        chars: {
            "a": "𝒶", 
            "b": "𝒷", 
            "c": "𝒸", 
            "d": "𝒹", 
            "e": "𝑒", 
            "f": "𝒻", 
            "g": "𝑔", 
            "h": "𝒽", 
            "i": "𝒾", 
            "j": "𝒿", 
            "k": "𝓀", 
            "l": "𝓁", 
            "m": "𝓂", 
            "n": "𝓃", 
            "o": "𝑜", 
            "p": "𝓅", 
            "q": "𝓆", 
            "r": "𝓇", 
            "s": "𝓈", 
            "t": "𝓉", 
            "u": "𝓊", 
            "v": "𝓋", 
            "w": "𝓌", 
            "x": "𝓍", 
            "y": "𝓎", 
            "z": "𝓏", 
            "0": "0", 
            "1": "1", 
            "2": "2", 
            "3": "3", 
            "4": "4", 
            "5": "5", 
            "6": "6", 
            "7": "7", 
            "8": "8", 
            "9": "9"
        }
    },
    3: {
        name: 'Bold',
        chars: {
            "a": "𝗮", 
            "b": "𝗯", 
            "c": "𝗰", 
            "d": "𝗱", 
            "e": "𝗲", 
            "f": "𝗳", 
            "g": "𝗴", 
            "h": "𝗵", 
            "i": "𝗶", 
            "j": "𝗷", 
            "k": "𝗸", 
            "l": "𝗹", 
            "m": "𝗺", 
            "n": "𝗻", 
            "o": "𝗼", 
            "p": "𝗽", 
            "q": "𝗾", 
            "r": "𝗿", 
            "s": "𝘀", 
            "t": "𝘁", 
            "u": "𝘂", 
            "v": "𝘃", 
            "w": "𝘄", 
            "x": "𝘅", 
            "y": "𝘆", 
            "z": "𝘇", 
            "0": "𝟬", 
            "1": "𝟭", 
            "2": "𝟮", 
            "3": "𝟯", 
            "4": "𝟰", 
            "5": "𝟱", 
            "6": "𝟲", 
            "7": "𝟳", 
            "8": "𝟴", 
            "9": "𝟵"
        }
    }
};

// Function to convert text into a specific font
function convertToFont(text, fontIndex) {
    const font = fonts[fontIndex];
    if (!font) return `Invalid font selection. Use !fonts to see available fonts.`;
    
    return text
        .split('')
        .map(char => font.chars[char] || char) // Map each character or keep as-is
        .join('');
}

// Function to list available fonts
function listFonts() {
    return Object.entries(fonts)
        .map(([index, font]) => `${index}. ${font.name}`)
        .join('\n');
}

// Example usage with a WhatsApp bot (using whatsapp-web.js)
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('message', message => {
    const args = message.body.split(' ');
    const command = args[0].toLowerCase();

    if (command === '!fonts') {
        message.reply(`Available Fonts:\n${listFonts()}`);
    } else if (command === '!style') {
        const fontIndex = parseInt(args[1], 10);
        const content = args.slice(2).join(' ');
        const styledText = convertToFont(content, fontIndex);
        message.reply(styledText || 'Invalid font selection or text!');
    }
});

client.initialize();