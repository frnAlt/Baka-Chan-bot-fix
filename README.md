<div align="center">

# 🌸 BAKA-CHAN BOT V2 🌸
### **High-Performance Facebook Messenger Chatbot Engine**
*Built purely on GoatBot-V2 Foundation (NTKhang & NeoKEX) • Maintained by Gtajisan*

[![Node Version](https://img.shields.io/badge/node.js-%3E%3D20.x-brightgreen.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![GoatBot Base](https://img.shields.io/badge/GoatBot--V2-Official%20Base-orange?style=for-the-badge&logo=github)](https://github.com/lazyneoaz/Goatbot-V2)
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

**Baka-Chan Bot V2** is a production-grade Facebook Messenger chatbot engine built 100% on the official **GoatBot-V2** architecture. Engineered for high performance, low memory footprint, multi-account rotation, and 24/7 reliability.

---

[✨ Key Features](#-key-features) • [🚀 Quick Start](#-quick-start) • [⚙️ Configuration](#️-configuration) • [📦 Multi-Account](#-multi-account-support) • [📂 Command Engine](#-command-engine) • [🌐 Dashboard](#-web-dashboard) • [👥 Credits](#-credits)

</div>

---

## 🌟 Key Features

- **⚡ 100% Pure GoatBot-V2 Engine**: Clean, unified codebase with zero bloat, powered by the latest optimizations from [lazyneoaz/Goatbot-V2](https://github.com/lazyneoaz/Goatbot-V2).
- **🛡️ High-Performance MetaChat API**: Built-in `@lazyneoaz/metachat` engine with robust MQTT listening, presence management, typing indicators, and auto-reconnection.
- **🧠 MemoryManager & Leak Prevention**:
  - Proactive heap monitoring with automatic V8 garbage collection (`--expose-gc`).
  - `TTLMap` caching for `onReply` and `onReaction` (30-minute auto-expiry, 500-item ceiling).
  - Memory-capped supervisor (`index.js`) with instant crash restart and graceful shutdown handlers (`gracefulShutdown.js`).
- **👥 Seamless Multi-Account Rotation**: Built-in multi-account switching (`account.txt`, `account2.txt`, `account3.txt`) with auto-relogin and live cookie validation.
- **💾 Dual Database Engine**:
  - High-performance SQLite & MongoDB controllers with automatic JSON fallback.
  - Thread and user data caching with batch synchronization.
- **🎭 Multi-Tier Permission Hierarchy**:
  - `0`: Regular Group Member
  - `1`: Group / Box Administrator
  - `2`: Bot Administrator (`adminBot`)
  - `3`: Premium User (`premiumUsers`)
  - `4`: Developer / Superuser (`devUsers`)
- **🌐 Real-Time Web Dashboard**: Full Express + EJS web dashboard with user management, thread logs, database viewer, and live socket status.
- **🚨 Advanced Error Handling & Alerts**: Automatic failure notifications via Discord Webhook, Telegram Bot, or Gmail when MQTT disconnects.

---

## 📋 System Requirements

| Requirement | Minimum | Recommended |
|:---|:---|:---|
| **Node.js** | v20.x+ | Node.js v20.x or v22.x LTS |
| **NPM** | v7.0.0+ | Latest NPM |
| **RAM** | 256 MB | 512 MB - 1 GB |
| **Storage** | 300 MB | 1 GB SSD |
| **OS** | Linux / Ubuntu / Debian | macOS / Windows 10+ / Docker |

---

## 🚀 Quick Start

### 1. Clone & Setup Repository

```bash
git clone https://github.com/frnAlt/Baka-Chan-bot-fix.git
cd Baka-Chan-bot-fix
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Account Cookie / AppState

Paste your Facebook AppState JSON (or cookie string) into `account.txt`:

```json
[
  {
    "key": "c_user",
    "value": "1000xxxx",
    "domain": "facebook.com",
    "path": "/"
  },
  {
    "key": "xs",
    "value": "xxxx",
    "domain": "facebook.com",
    "path": "/"
  }
]
```

> **Tip:** You can configure additional backup accounts in `account2.txt` and `account3.txt`!

### 4. Configure Your Bot

Open `config.json` to customize your preferences:

```json
{
  "nickNameBot": "Baka-Chan",
  "prefix": "!",
  "adminBot": ["61582611751982"],
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
| `adminBot` | `array` | List of Facebook UIDs with full Bot Admin access (Role 2). |
| `premiumUsers` | `array` | List of Facebook UIDs with VIP / Premium access (Role 3). |
| `devUsers` | `array` | List of Facebook UIDs with Developer access (Role 4). |
| `whiteListMode` | `object` | Restricts bot usage to whitelisted user IDs only. |
| `spamProtection` | `object` | Auto-bans threads if command threshold is exceeded within window. |
| `database` | `object` | Database selection (`sqlite`, `mongodb`, or `json`). |
| `timeZone` | `string` | Timezone string (e.g., `Asia/Dhaka`, `UTC`). |
| `dashBoard` | `object` | Web Dashboard toggle and port configuration (default `3001`). |

---

## 📦 Multi-Account Support

Baka-Chan Bot V2 includes native GoatBot multi-account management:

1. Place your primary account credentials / cookies in `account.txt`.
2. Place secondary account credentials in `account2.txt`, `account3.txt`, etc.
3. Multi-account state is managed automatically via `bot/login/multiAccountManager.js`.
4. The bot automatically rotates or falls back to live accounts if one session expires.

---

## 📂 Command Architecture

All commands are located in `scripts/cmds/` adhering to standard GoatBot V2 format:

### Example Command (`scripts/cmds/ping.js`)

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

### Supported Lifecycle Hooks:
- `onStart`: Triggered when a command is executed.
- `onReply`: Triggered when a user replies to a message.
- `onReaction`: Triggered when a user reacts with an emoji.
- `onChat`: Triggered on incoming chat messages.
- `onEvent`: Triggered on thread events (member join/leave, nickname changes, theme updates).
- `onLoad`: Triggered once when the bot boots and registers the command.

---

## 🌐 Web Dashboard

Baka-Chan Bot V2 features a built-in web management dashboard:

- **URL:** `http://localhost:3001` (or your host port)
- **Features:**
  - Real-time bot health, CPU, and RAM statistics.
  - Thread management and member ranking.
  - Ban / Unban threads and users.
  - Interactive custom command manager and live logs.

---

## 👥 Credits & Acknowledgments

- **Lead Developer & Maintainer:** [Gtajisan aka Farhan](https://github.com/frnAlt) (`frnAlt`)
- **Original GoatBot-V2 Author:** [NTKhang](https://github.com/ntkhang03)
- **GoatBot-V2 Modern Engine:** [NeoKEX / Lazyneoaz](https://github.com/lazyneoaz)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
Made with 💖 by <strong>Gtajisan aka Farhan</strong>
</div>

