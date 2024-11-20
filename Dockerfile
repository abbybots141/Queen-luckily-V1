# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project files into the container
COPY . .

# Expose any port if necessary (default port for the bot's web server, if you have one)
# EXPOSE 3000

# Command to run the bot (replace `bot.js` with your entry file)
CMD ["node", "bot.js"]

# Optionally, you can add an entrypoint if your bot requires other setup, like setting environment variables.
# ENTRYPOINT [ "node", "bot.js" ]