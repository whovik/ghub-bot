const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// bot commands

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome to the bot! 🙌
          
I'm Vik, your GitHub bot! 🤖
I log GitHub PRs, releases, pushes, and more to this chat.
Owner: [whovik](https://github.com/whovik)

Use /help to see available commands.`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Here are the commands you can use:

/start - Get a welcome message and learn about this bot.
/help - Get a list of available commands.
/info - Get information about the bot owner and features.`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Bot Name: Github Info (Bot)
Owner: [whovik](https://github.com/whovik)
Description: This bot logs GitHub PRs, releases, pushes, and more to Telegram.

Bot Features:
- Pull Request notifications
- Release announcements
- Push notifications

Check out the GitHub repository: [whovik](https://github.com/whovik/ghub-bot)`,
    { parse_mode: "Markdown" }
  );
});

// Function to verify the bot token
const verifyBotToken = async () => {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );
    console.log(`Bot connected successfully:`, response.data.result);
  } catch (error) {
    console.error("Failed to verify bot token. Check your TELEGRAM_BOT_TOKEN.");
    process.exit(1);
  }
};

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is live from vercel" });
});

app.post("/github-webhook", async (req, res) => {
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log(`Received GitHub event: ${event}`);

  if (event === "ping") {
    console.log("Ping event received from GitHub.");
    res.status(200).send("Ping received successfully!");
    return;
  }

  let message = "";

  // Handle Events
  if (event === "pull_request") {
    const { action, pull_request } = payload;
    message = `Pull Request ${action}: [${pull_request.title}](${pull_request.html_url})`;
  } else if (event === "release") {
    const { release } = payload;
    message = `New Release: [${release.name || release.tag_name}](${
      release.html_url
    })`;
  } else if (event === "push") {
    const commits = payload.commits
      .map((c) => `- ${c.message} (${c.url})`)
      .join("\n");
    message = `New Changes:\n${commits}`;
  } else if (event === "watch") {
    const { action, repository, sender } = payload;
    if (action === "started") {
      message = `${sender.login} starred the repository: [${repository.full_name}](${repository.html_url})`;
    } else if (action === "deleted") {
      message = `${sender.login} un-starred the repository: [${repository.full_name}](${repository.html_url})`;
    }
  }

  if (message) {
    try {
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }
      );
      console.log("Message sent to Telegram successfully");
    } catch (error) {
      console.error(
        "Failed to send message to Telegram:",
        error.response?.data || error.message
      );
    }
  }

  res.status(200).send("Event received");
});

app.get("/test", async (req, res) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: "Test message from your bot! 🎉",
      }
    );
    console.log("Test message sent to Telegram successfully");
    res.status(200).send("Test message sent successfully");
  } catch (error) {
    console.error(
      "Failed to send test message:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to send test message");
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await verifyBotToken(); // Verify bot on startup
});
