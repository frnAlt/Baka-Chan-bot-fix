<div align="center">

# 🌸 BAKA-CHAN BOT V2 🌸
### **High-Performance Facebook Messenger Chatbot Engine**
*Rebuilt on GoatBot-V2 & Powered by Floppa Subsystems*

[![Node Version](https://img.shields.io/badge/node.js-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![GoatBot Base](https://img.shields.io/badge/GoatBot--V2-Engine-orange?style=for-the-badge&logo=github)](https://github.com/ntkhang03/Goat-Bot-V2)
[![Commands](https://img.shields.io/badge/Commands-450%2B-blueviolet?style=for-the-badge)](https://github.com/frnAlt/Baka-Chan-bot)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Developer-Gtajisan%20(Farhan)-ff69b4?style=for-the-badge&logo=github)](https://github.com/frnAlt)

```text
██████╗  █████╗ ██╗  ██╗ █████╗        ██████╗██╗  ██╗ █████╗ ███╗   ██╗
██╔══██╗██╔══██╗██║ ██╔╝██╔══██╗      ██╔════╝██║  ██║██╔══██╗████╗  ██║
██████╔╝███████║█████╔╝ ███████║█████╗██║     ███████║███████║██╔██╗ ██║
██╔══██╗██╔══██║██╔═██╗ ██╔══██║╚════╝██║     ██╔══██║██╔══██║██║╚██╗██║
██████╔╝██║  ██║██║  ██╗██║  ██║      ╚██████╗██║  ██║██║  ██║██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
```

**Baka-Chan Bot V2** is a next-generation Facebook Messenger chatbot framework engineered for maximum speed, stability, customizability, and 24/7 uptime. Built on the modern **GoatBot-V2** foundation and infused with **Floppa Chatbot** modular subsystems.

---

[✨ Key Features](#-key-features) • [🚀 Quick Start](#-quick-start) • [⚙️ Configuration](#️-configuration) • [📦 Multi-Account](#-multi-account-support) • [📂 Command Engine](#-command-engine) • [🌐 Dashboard](#-web-dashboard) • [👥 Credits](#-credits)

</div>

---

## 🌟 Key Features

- **🚀 450+ Built-In Commands**: Complete suite of AI, media downloaders, economy, RPG, games, entertainment, moderation, canvas manipulations, typography, and utility commands.
- **🛡️ Rock-Solid Bundled FCA Engine**: Powered by `@floppa/fca-native` with universal cookie parsing, 2FA TOTP authentication, MQTT v3/v4/v5 support, keep-alive loops, and anti-ban protections.
- **🧠 Advanced MemoryManager & Anti-Leak**:
  - Proactive heap monitoring with automatic V8 garbage collection (`--expose-gc`).
  - `TTLMap` caching for `onReply` and `onReaction` (30-minute auto-expiry, 500-item ceiling).
  - Unbounded Set/Map pruning to prevent OOM kills on 512MB hosting containers (Render, Replit, VPS).
- **🔄 Process Supervisor & Self-Healing**:
  - Memory-capped runner (`index.js`) with instant crash restart and graceful shutdown handling.
- **👥 Multi-Account Support**: Seamless multi-token login and account switching across `account.txt`, `account2.txt`, `account3.txt`.
- **💾 Dual Database Engine**:
  - High-performance SQLite & MongoDB controllers with write queueing and batching.
  - Automatic non-blocking fallback to JSON file database if native SQLite bindings are absent.
- **🎭 5-Tier Permission Hierarchy**:
  - `0`: Regular Member
  - `1`: Group / Box Administrator
  - `2`: Bot Administrator (`adminBot`)
  - `3`: Premium User (`premiumUsers`)
  - `4`: Developer / Superuser (`devUsers`)
- **⚡ No-Prefix Mode**: Execute any command directly without typing the bot prefix for Admins and Developers.
- **🎨 Comprehensive `func/` Subsystems**:
  - AI Assistant helpers (`func/aiHelper.js`)
  - Typography, styling, and font converters (`func/fonts.js`, `func/styler.js`)
  - High-precision big integer math (`func/bigMath.js`)
  - Task scheduler and background runner (`func/backgroundTask.js`)
  - Anti-spam tracker and auto-ban system (`func/spamTracker.js`)
  - Universal module resolver (`func/moduleResolver.js`) with on-the-fly ESM & TypeScript transpilation.
- **📊 Real-time Web Dashboard**: Express + EJS web panel with user statistics, thread logs, database viewer, and live socket status.

---

## 📋 System Requirements

| Requirement | Minimum | Recommended |
|:---|:---|:---|
| **Node.js** | v18.0.0+ | Node.js v20.x or v22.x LTS |
| **NPM** | v7.0.0+ | Latest NPM / Yarn / PNPM |
| **RAM** | 256 MB | 512 MB - 1 GB |
| **Storage** | 300 MB | 1 GB SSD |
| **OS** | Linux / Ubuntu / Debian | macOS / Windows 10+ / Docker |

---

## 🚀 Quick Start

### 1. Clone & Setup Repository

```bash
git clone https://github.com/frnAlt/Baka-Chan-bot.git
cd Baka-Chan-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Account Cookie / AppState

Paste your Facebook Cookie (or AppState JSON) into `account.txt`:

```bash
# Example format inside account.txt (Cookie string or JSON array):
sb=xxx; c_user=1000xxxx; xs=xxx; datr=xxx; ...
```

> **Tip:** You can also add secondary accounts in `account2.txt` and `account3.txt` for multi-account operation!

### 4. Configure Your Bot

Open `config.json` and configure your preferences:

```json
{
  "nickNameBot": "Baka-Chan",
  "prefix": "!",
  "noPrefix": true,
  "adminBot": ["61582611751982"],
  "premiumUsers": ["61582611751982"],
  "devUsers": ["61582611751982"],
  "timeZone": "Asia/Dhaka",
  "database": {
    "type": "sqlite",
    "uriMongodb": ""
  },
  "dashBoard": {
    "enable": true,
    "port": 3001
  }
}
```

### 5. Launch Baka-Chan Bot

```bash
# Production mode (with Memory Management & Auto-Restart)
npm start

# Development mode
npm run dev
```

---

## ⚙️ Configuration Reference

### `config.json`

| Key | Type | Description |
|:---|:---|:---|
| `nickNameBot` | `string` | Nickname assigned to the bot in threads. |
| `prefix` | `string` | Command trigger prefix (e.g. `!`, `/`, `.`). |
| `noPrefix` | `boolean` | Allows Role 2 (Admin) & Role 4 (Dev) to trigger commands without prefix. |
| `adminBot` | `array` | List of Facebook UIDs with full Bot Admin access (Role 2). |
| `premiumUsers` | `array` | List of Facebook UIDs with VIP / Premium access (Role 3). |
| `devUsers` | `array` | List of Facebook UIDs with Developer access (Role 4). |
| `whiteListMode` | `object` | Restricts bot usage to whitelisted user IDs only. |
| `whiteListModeThread`| `object` | Restricts bot usage to whitelisted thread IDs only. |
| `spamProtection` | `object` | Auto-bans threads if command threshold is exceeded within window. |
| `typingIndicator`| `object` | Displays typing indicator before sending message responses. |
| `database` | `object` | Database selection (`sqlite`, `mongodb`, or `json`). |
| `timeZone` | `string` | Timezone string (e.g., `Asia/Dhaka`, `Asia/Ho_Chi_Minh`, `UTC`). |
| `dashBoard` | `object` | Web Dashboard toggle and port configuration (default `3001`). |

---

## 📦 Multi-Account Support

Baka-Chan Bot V2 includes native multi-account management:

1. Place your primary account cookie in `account.txt`.
2. Place alternate account cookies in `account2.txt`, `account3.txt`, etc.
3. Use the `accountswitch` or `account` command in chat to toggle between accounts or inspect login status.
4. Auto-relogin on cookie expiry is handled seamlessly in `bot/login/multiAccountManager.js`.

---

## 📂 Command Architecture

All commands are stored in `scripts/cmds/`. Both standard GoatBot syntax and modern meta-format commands are fully supported:

### Example: Standard Command Format (`scripts/cmds/example.js`)

```javascript
module.exports = {
  config: {
    name: "ping",
    version: "2.0.0",
    author: "Gtajisan",
    role: 0,
    countDown: 5,
    category: "utility",
    shortDescription: "Check bot latency",
    longDescription: "Checks system latency and response speed",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, message }) {
    const start = Date.now();
    await message.reply("🏓 Pong!");
    const latency = Date.now() - start;
    return message.reply(`⚡ Latency: ${latency}ms`);
  }
};
```

### Supported Handlers:
- `onStart`: Called when command is executed via message.
- `onReply`: Called when a user replies to a bot prompt (`message.reply`).
- `onReaction`: Called when a user reacts with an emoji.
- `onChat`: Called on every incoming chat message.
- `onEvent`: Called on system events (user join, leave, change nickname, theme change).
- `onLoad`: Executed once when the bot boots and loads the command into memory.

---

## 🌐 Web Dashboard

Baka-Chan Bot V2 features a built-in web management portal:

- **URL:** `http://localhost:3001` (or your deployment URL)
- **Features:**
  - View bot statistics (Uptime, Memory usage, CPU load, Active threads, Total users).
  - Manage threads and user data.
  - Ban / Unban threads or users.
  - Real-time Socket.IO log viewer.

---

## 🚢 Cloud Deployment Guides

### Deploy on Render / Koyeb / Railway

1. Fork or push your bot repository to GitHub.
2. Link your repository in Render / Koyeb / Railway.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`

### Deploy with PM2 (VPS / Dedicated Server)

```bash
npm install -g pm2
pm2 start index.js --name "baka-bot"
pm2 save
pm2 startup
```

### Deploy with Docker

```bash
docker build -t baka-chan-bot .
docker run -d --restart always -p 3001:3001 --name baka-bot baka-chan-bot
```

---

## 👥 Credits & Acknowledgments

- **Lead Developer & Maintainer:** [Gtajisan aka Farhan](https://github.com/frnAlt) (`frnAlt`)
- **Original GoatBot-V2 Creator:** [NTKhang](https://github.com/ntkhang03)
- **GoatBot-V2 Modern Engine:** [NeoKEX / Lazyneoaz](https://github.com/lazyneoaz)
- **Floppa Subsystems & Modules:** [Floppa Engine Team](https://github.com/frnAlt/Floppa-Chatbot)
- **Contributors:** DongDev, Team-Calyx, and the open-source community.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and develop your own bots based on Baka-Chan Bot V2. Please retain original author and engine credits.

<div align="center">
Made with 💖 by <strong>Gtajisan aka Farhan</strong>
</div>

