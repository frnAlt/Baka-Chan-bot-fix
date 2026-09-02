# 🌸 STEP-BY-STEP INSTALLATION GUIDE FOR BAKA-CHAN BOT V2 🌸

This guide walks you through setting up and running **Baka-Chan Bot V2** on PC, VPS, Docker, or Cloud Hosting (Replit, Render, Railway, Koyeb).

---

## 💻 1. Local / VPS Setup (Recommended)

### Step 1: Install Node.js
Make sure you have Node.js 18.x or 20.x installed:
- [Download Node.js](https://nodejs.org/)

### Step 2: Clone the Repository
```bash
git clone https://github.com/frnAlt/Baka-Chan-bot.git
cd Baka-Chan-bot
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Extract Facebook Cookie / AppState
1. Install the `C3C-FBState` or `Cookie-Editor` extension in your Chromium browser.
2. Log into your Facebook account (use a clone account for bot operation).
3. Export your cookie in JSON or Header String format.
4. Open `account.txt` in the bot directory and paste your cookie.
5. (Optional) Paste secondary account cookies into `account2.txt`, `account3.txt` for multi-account switching.

### Step 5: Configure `config.json`
Open `config.json` and set your:
- `adminBot`: Add your Facebook UID to the array (e.g., `["61582611751982"]`).
- `nickNameBot`: Custom nickname (default: `"Baka-Chan"`).
- `prefix`: Command prefix (default: `!` or `/`).
- `timeZone`: Set your local timezone (e.g., `"Asia/Dhaka"`).

### Step 6: Start the Bot
```bash
npm start
```

---

## ⚡ 2. 24/7 Deployment with PM2 (VPS / Dedicated Server)

To ensure the bot stays online 24/7 with automatic restart on reboots:

```bash
# Install PM2 globally
npm install -g pm2

# Launch Baka-Chan
pm2 start index.js --name "baka-bot"

# Save configuration and generate startup script
pm2 save
pm2 startup
```

---

## 🐳 3. Docker Deployment

```bash
# Build Docker image
docker build -t baka-chan-bot .

# Run container
docker run -d --restart always -p 3001:3001 --name baka-bot baka-chan-bot
```

---

## 🌐 4. Cloud Deployment (Render / Railway / Koyeb)

1. Fork or push the repo to your GitHub account.
2. Create a new Web Service on [Render](https://render.com) or [Railway](https://railway.app).
3. Connect your GitHub repository.
4. Configure build settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`

---

## ❓ Need Help?
- Contact Developer: [Gtajisan aka Farhan](https://github.com/frnAlt) (`ffjisan804@gmail.com`)


