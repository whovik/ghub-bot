# GitHub Actions Logger TG-Bot

A Telegram bot that logs GitHub pull requests, releases, pushes, and more to a Telegram chat. This bot is designed to provide easy notifications about important GitHub events directly to your Telegram.

## Features

- Logs GitHub Pull Request notifications
- Release announcements
- Push notifications
- Star notifications
- Easy to configure with GitHub Webhooks

## Setup

### 1. Clone the repository

Clone this repository to your local machine:

```bash
git clone https://github.com/whovik/ghub-bot.git
cd ghub-bot
```

### 2. Install dependencies

Install the required packages:

```bash
npm install

```

### 3. Set up environment variables

Create a .env file in the root directory and add the following:

```bash
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
GITHUB_SECRET=your_github_webhook_secret

```

### 4. Set up NGROK for Local Testing

If you're testing the webhook locally, you will need NGROK to create a public URL that redirects to your local server.

    1. Install [NGROK](https://ngrok.com/download)

    2. Start NGROK: In your terminal, run the following command to start NGROK and expose your local server:

```bash
ngrok http 3000
```

This will give you a public URL (e.g., https://<your-ngrok-id>.ngrok.io) that you can use in the GitHub Webhook setup.

### 5. Start the bot locally

If running locally, start the bot with:

```bash
npm start
```

Your bot will be running locally on http://localhost:3000, but NGROK will provide a public URL (e.g., https://<your-ngrok-id>.ngrok.io) that GitHub can reach.

### 6. Set up GitHub Webhook

- Go to your GitHub repository.
  Navigate to Settings → Webhooks → Add webhook.
  Set the Payload URL to the NGROK URL you obtained in the previous step (e.g., https://<your-ngrok-id>.ngrok.io/github-webhook).
- Set the Content Type to application/json.
  Add the Secret (same as GITHUB_SECRET).
  Choose events you want to trigger the webhook (e.g., Pull Requests, Releases, Pushes).
- Save the webhook.

### `upcoming` . Deploy to Cloudflare/Heroku

coming soon \*

### 7. Deploy to Vercel

If you want to deploy your bot for production, you can use Vercel. Follow these steps:

- Go to Vercel and sign up/sign in.
- Create a new project and link it to your GitHub repository.
- Set your environment variables in Vercel:
- Go to Project Settings → Environment Variables
- Add TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, and GITHUB_SECRET as environment variables.
- Vercel will automatically deploy your bot. Once it's deployed, use the Vercel URL as your GitHub webhook payload URL.

### 8. Test the webhook

- Once everything is set up, make a change in your GitHub repository (e.g., create a pull request, push new code, or create a release). You should see a notification in your Telegram chat with the details of the event.

### 9. Available Commands

/start: Get a welcome message and learn about this bot.
/help: List of available commands.
/info: Information about the bot.

---

`cr - @whoviks`
