/**
 * @title Baka-Chan Bot V2 Core Engine
 * @author Gtajisan aka Farhan (frnAlt)
 * @description Powered by GoatBot-V2 Engine (by NTKhang & NeoKEX) and Floppa Core Subsystems
 */

// Initialize Universal Module Resolver and Extensions
try {
	require("./func/moduleResolver.js");
} catch (e) {
	// moduleResolver loaded on fallback
}

process.on('unhandledRejection', (error, promise) => {
	const log = require('./logger/log.js');
	log.error('UNHANDLED_REJECTION', error?.message || error);
	// Avoid memory leak by not storing promises
});

process.on('uncaughtException', (error) => {
	const log = require('./logger/log.js');
	log.error('UNCAUGHT_EXCEPTION', error?.message || error);
	if (error?.stack) log.error('UNCAUGHT_EXCEPTION', error.stack);
	// Allow logs to flush before exiting
	setTimeout(() => process.exit(1), 1000);
});

const axios = require("axios");
const fs = require("fs-extra");
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");

const TTLMap = require("./func/TTLMap.js");

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0; // Disable Bluebird promise return warning

function validJSON(pathDir) {
	try {
		if (!fs.existsSync(pathDir))
			throw new Error(`File "${pathDir}" not found`);
		execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
		return true;
	}
	catch (err) {
		let msgError = err.message;
		msgError = msgError.split("\n").slice(1).join("\n");
		const indexPos = msgError.indexOf("    at");
		msgError = msgError.slice(0, indexPos != -1 ? indexPos - 1 : msgError.length);
		throw new Error(msgError);
	}
}

const dirConfig = path.normalize(`${__dirname}/config.json`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands.json`);
const dirAccount = path.normalize(`${__dirname}/account.txt`);

for (const pathDir of [dirConfig, dirConfigCommands]) {
	try {
		validJSON(pathDir);
	}
	catch (err) {
		log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message.split("\n").map(line => `  ${line}`).join("\n")}\nPlease fix it and restart bot`);
		process.exit(0);
	}
}
const config = require(dirConfig);
if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds))
	config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(id => id.toString());
const configCommands = require(dirConfigCommands);

global.GoatBot = {
	startTime: Date.now() - process.uptime() * 1000, // time start bot (ms)
	commands: new Map(), // store all commands
	eventCommands: new Map(), // store all event commands
	commandFilesPath: [], // [{ filePath: "", commandName: [] }]
	eventCommandsFilesPath: [], // [{ filePath: "", commandName: [] }]
	aliases: new Map(), // store all aliases
	onFirstChat: new Set(), // store threadIDs that have been first chatted
	onFirstChatCommands: [], // store command names that use onFirstChat
	onChat: [], // store all onChat
	onEvent: [], // store all onEvent
	onReply: new TTLMap({ ttl: 30 * 60 * 1000, maxSize: 500, cleanupInterval: 60000 }), // 30 min TTL, max 500 entries
	onReaction: new TTLMap({ ttl: 30 * 60 * 1000, maxSize: 500, cleanupInterval: 60000 }), // 30 min TTL, max 500 entries
	onAnyEvent: [], // store all onAnyEvent
	config, // store config
	configCommands, // store config commands
	envCommands: {}, // store env commands
	envEvents: {}, // store env events
	envGlobal: {}, // store env global
	reLoginBot: function () { }, // function relogin bot, set in bot/login/login.js
	Listening: null, // store current listening handle
	oldListening: [], // store old listening handle
	callbackListenTime: {}, // store callback listen 
	storage5Message: [], // store 5 messages to check listening loop
	fcaApi: null, // store fca api
	botID: null // store bot id
};

global.FloppaBot = global.GoatBot;
global.Cassidy = global.GoatBot;

global.db = {
	// all data
	allThreadData: [],
	allUserData: [],
	allDashBoardData: [],
	allGlobalData: [],

	// model
	threadModel: null,
	userModel: null,
	dashboardModel: null,
	globalModel: null,

	// handle data
	threadsData: null,
	usersData: null,
	dashBoardData: null,
	globalData: null,

	receivedTheFirstMessage: {}
};

global.client = {
	dirConfig,
	dirConfigCommands,
	dirAccount,
	countDown: {},
	cache: {},
	database: {
		creatingThreadData: [],
		creatingUserData: [],
		creatingDashBoardData: [],
		creatingGlobalData: []
	},
	commandBanned: configCommands.commandBanned || {}
};

const utils = require("./utils.js");
global.utils = utils;
const { colors } = utils;
const shutdownManager = require("./func/gracefulShutdown.js");

// Initialize global.temp with size-limited data structures
global.temp = {
	createThreadData: [],
	createUserData: [],
	createThreadDataError: new Map(), // threadID -> timestamp; auto-expires after 5 min
	contentScripts: {
		cmds: {},
		events: {}
	},
	// Helper to limit array sizes
	_addWithLimit(arr, item, maxSize = 1000) {
		arr.push(item);
		if (arr.length > maxSize) {
			arr.splice(0, arr.length - maxSize);
		}
	}
};

// watch dirConfigCommands file and dirConfig
const watchAndReloadConfig = (dir, type, prop, logName) => {
	let lastModified = fs.statSync(dir).mtimeMs;
	let isFirstModified = true;

	fs.watch(dir, (eventType) => {
		if (eventType === type) {
			const oldConfig = global.GoatBot[prop];

			// wait 200ms to reload config
			setTimeout(() => {
				try {
					if (isFirstModified) {
						isFirstModified = false;
						return;
					}
					if (lastModified === fs.statSync(dir).mtimeMs) {
						return;
					}
					global.GoatBot[prop] = JSON.parse(fs.readFileSync(dir, 'utf-8'));
					log.success(logName, `Reloaded ${dir.replace(process.cwd(), "")}`);
				}
				catch (err) {
					log.warn(logName, `Can't reload ${dir.replace(process.cwd(), "")}`);
					global.GoatBot[prop] = oldConfig;
				}
				finally {
					try {
						lastModified = fs.statSync(dir).mtimeMs;
					} catch (e) {
						// file temporarily inaccessible
					}
				}
			}, 200);
		}
	});
};

watchAndReloadConfig(dirConfigCommands, 'change', 'configCommands', 'CONFIG COMMANDS');
watchAndReloadConfig(dirConfig, 'change', 'config', 'CONFIG');

global.GoatBot.envGlobal = global.GoatBot.configCommands.envGlobal || {};
global.GoatBot.envCommands = global.GoatBot.configCommands.envCommands || {};
global.GoatBot.envEvents = global.GoatBot.configCommands.envEvents || {};

// ———————————————— LOAD LANGUAGE ———————————————— //
const getText = global.utils.getText;

/**
 * MemoryManager - Monitors and manages memory to prevent leaks and ensure 24/7 long-term stability
 */
class MemoryManager {
	constructor(options = {}) {
		this.options = {
			checkInterval: options.checkInterval || 3 * 60 * 1000, // 3 minutes
			heapThreshold: options.heapThreshold || 350 * 1024 * 1024, // 350MB heap threshold
			maxOldListening: options.maxOldListening || 10,
			maxCallbackListenTime: options.maxCallbackListenTime || 100,
			maxOnFirstChatSize: options.maxOnFirstChatSize || 10000,
			...options
		};

		this.stats = {
			cleanups: 0,
			lastHeapUsed: 0,
			peakHeapUsed: 0
		};

		this._startMonitoring();
	}

	_startMonitoring() {
		setInterval(() => this._checkMemory(), this.options.checkInterval);
	}

	_checkMemory() {
		const memUsage = process.memoryUsage();
		this.stats.lastHeapUsed = memUsage.heapUsed;
		this.stats.peakHeapUsed = Math.max(this.stats.peakHeapUsed, memUsage.heapUsed);

		// Cleanup if heap exceeds threshold
		if (memUsage.heapUsed > this.options.heapThreshold) {
			this._performCleanup();
		}

		// Always do light cleanup
		this._lightCleanup();
	}

	_performCleanup() {
		const { GoatBot } = global;
		let cleaned = 0;

		// Cleanup old listening handles
		if (GoatBot.oldListening.length > this.options.maxOldListening) {
			const toRemove = GoatBot.oldListening.length - this.options.maxOldListening;
			for (let i = 0; i < toRemove; i++) {
				const handle = GoatBot.oldListening.shift();
				if (handle && typeof handle.stop === 'function') {
					try { handle.stop(); } catch (e) {}
				}
			}
			cleaned += toRemove;
		}

		// Cleanup callbackListenTime
		const callbackEntries = Object.keys(GoatBot.callbackListenTime);
		if (callbackEntries.length > this.options.maxCallbackListenTime) {
			const sorted = callbackEntries
				.map(key => ({ key, time: GoatBot.callbackListenTime[key] }))
				.sort((a, b) => a.time - b.time);

			const toRemove = sorted.length - this.options.maxCallbackListenTime;
			for (let i = 0; i < toRemove; i++) {
				delete GoatBot.callbackListenTime[sorted[i].key];
			}
			cleaned += toRemove;
		}

		// Cleanup onFirstChat if too large
		if (GoatBot.onFirstChat.size > this.options.maxOnFirstChatSize) {
			const entries = Array.from(GoatBot.onFirstChat);
			const toRemove = entries.slice(0, entries.length - this.options.maxOnFirstChatSize);
			toRemove.forEach(id => GoatBot.onFirstChat.delete(id));
			cleaned += toRemove.length;
		}

		// Clear expired premium users cache
		if (global.temp?.expiredPremiumUsers?.length > 1000) {
			global.temp.expiredPremiumUsers.splice(0, global.temp.expiredPremiumUsers.length - 1000);
			cleaned++;
		}

		// Cleanup receivedTheFirstMessage - cap at 5000 entries
		const rfm = global.db?.receivedTheFirstMessage;
		if (rfm) {
			const keys = Object.keys(rfm);
			if (keys.length > 5000) {
				const toDelete = Math.floor(keys.length * 0.2);
				for (let i = 0; i < toDelete; i++) delete rfm[keys[i]];
				cleaned += toDelete;
			}
		}

		// Force garbage collection if available
		if (global.gc && memUsage.heapUsed > this.options.heapThreshold * 1.5) {
			global.gc();
			cleaned++;
		}

		if (cleaned > 0) {
			this.stats.cleanups++;
			log.info('MEMORY', `Cleaned ${cleaned} items, heap: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`);
		}
	}

	_lightCleanup() {
		if (global.client?.cache) {
			const cache = global.client.cache;
			const now = Date.now();
			for (const [key, value] of Object.entries(cache)) {
				if (value?._timestamp && now - value._timestamp > 3600000) {
					delete cache[key];
				}
			}
		}
	}

	getStats() {
		const memUsage = process.memoryUsage();
		return {
			...this.stats,
			heapUsed: memUsage.heapUsed,
			heapTotal: memUsage.heapTotal,
			rss: memUsage.rss,
			external: memUsage.external,
			heapUsedMB: (memUsage.heapUsed / 1024 / 1024).toFixed(2),
			heapTotalMB: (memUsage.heapTotal / 1024 / 1024).toFixed(2),
			rssMB: (memUsage.rss / 1024 / 1024).toFixed(2)
		};
	}
}

// Initialize memory manager
const memoryManager = new MemoryManager();

// ———————————————— AUTO RESTART ———————————————— //
if (config.autoRestart) {
	const time = config.autoRestart.time;
	if (!isNaN(time) && time > 0) {
		utils.log.info("AUTO RESTART", getText("Goat", "autoRestart1", utils.convertTime(time, true)));
		setTimeout(() => {
			utils.log.info("AUTO RESTART", "Restarting...");
			process.exit(2);
		}, time);
	}
	else if (typeof time == "string" && time.match(/^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$/gmi)) {
		utils.log.info("AUTO RESTART", getText("Goat", "autoRestart2", time));
		const cron = require("node-cron");
		cron.schedule(time, () => {
			utils.log.info("AUTO RESTART", "Restarting...");
			process.exit(2);
		});
	}
}

(async () => {
	// ———————————————— CHECK VERSION ———————————————— //
	try {
		const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json", { timeout: 10000 });
		const currentVersion = require("./package.json").version;
		if (utils.compareVersion(version, currentVersion) === 1)
			utils.log.master("NEW VERSION", getText(
				"Goat",
				"newVersionDetected",
				colors.gray(currentVersion),
				colors.hex("#eb6a07", version),
				colors.hex("#eb6a07", "node update")
			));
	} catch (err) {
		log.warn("VERSION CHECK", `Skipped — could not reach upstream: ${err.message}`);
	}
	// ———————————————————— LOGIN ———————————————————— //
	require('./bot/login/login.js');
})();

