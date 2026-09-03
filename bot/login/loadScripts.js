const { readdirSync, readFileSync, writeFileSync, existsSync } = require("fs-extra");
const path = require("path");
const exec = (cmd, options) => new Promise((resolve, reject) => {
	require("child_process").exec(cmd, options, (err, stdout) => {
		if (err)
			return reject(err);
		resolve(stdout);
	});
});
const { log, loading, getText, colors, removeHomeDir } = global.utils;
const { GoatBot } = global;
const { configCommands } = GoatBot;
const regExpCheckPackage = /require(\s+|)\((\s+|)[`'"]([^`'"]+)[`'"](\s+|)\)/g;
const packageAlready = [];
// const spinner = '\\|/-';
const spinner = [
	'⠋', '⠙', '⠹',
	'⠸', '⠼', '⠴',
	'⠦', '⠧', '⠇',
	'⠏'
];
let count = 0;

module.exports = async function (api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData, createLine) {
	/* { CHECK ORIGIN CODE } */

	const aliasesData = await globalData.get('setalias', 'data', []);
	if (aliasesData) {
		for (const data of aliasesData) {
			const { aliases, commandName } = data;
			for (const alias of aliases)
				if (GoatBot.aliases.has(alias))
					throw new Error(`Alias "${alias}" already exists in command "${commandName}"`);
				else
					GoatBot.aliases.set(alias, commandName);
		}
	}
	const folders = ["cmds", "events"];
	let text, setMap, typeEnvCommand;

	for (const folderModules of folders) {
		const makeColor = folderModules == "cmds" ?
			createLine("LOAD COMMANDS") :
			createLine("LOAD COMMANDS EVENT");
		console.log(colors.hex("#f5ab00")(makeColor));

		if (folderModules == "cmds") {
			text = "command";
			typeEnvCommand = "envCommands";
			setMap = "commands";
		}
		else if (folderModules == "events") {
			text = "event command";
			typeEnvCommand = "envEvents";
			setMap = "eventCommands";
		}

		const fullPathModules = path.normalize(process.cwd() + `/scripts/${folderModules}`);
		const Files = readdirSync(fullPathModules)
			.filter(file =>
				file.endsWith(".js") &&
				!file.endsWith("eg.js") && // ignore example file
				(process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) && // ignore dev file in production mode
				!configCommands[folderModules == "cmds" ? "commandUnload" : "commandEventUnload"]?.includes(file) // ignore unload command
			);

		const commandError = [];
		let commandLoadSuccess = 0;

		for (const file of Files) {
			const pathCommand = path.normalize(fullPathModules + "/" + file);
			try {
				// ————————————————— CHECK PACKAGE ————————————————— //
				const contentFile = readFileSync(pathCommand, "utf8");
				let allPackage = contentFile.match(regExpCheckPackage);
				if (allPackage) {
					allPackage = allPackage.map(p => p.match(/[`'"]([^`'"]+)[`'"]/)[1])
						.filter(p => p.indexOf("/") !== 0 && p.indexOf("./") !== 0 && p.indexOf("../") !== 0 && p.indexOf(__dirname) !== 0);
					for (let packageName of allPackage) {
						// @user/abc => @user/abc
						// @user/abc/dist/xyz.js => @user/abc
						// @user/abc/dist/xyz => @user/abc
						if (packageName.startsWith('@'))
							packageName = packageName.split('/').slice(0, 2).join('/');
						else
							packageName = packageName.split('/')[0];

						if (!packageAlready.includes(packageName)) {
							packageAlready.push(packageName);
							let isResolvable = false;
							try {
								require.resolve(packageName);
								isResolvable = true;
							} catch (_) {}

							const isLocalAlias = packageName.startsWith('@cass') ||
								packageName.startsWith('@defs') ||
								packageName.startsWith('@root') ||
								packageName.startsWith('cassidy-') ||
								packageName.startsWith('fca-') ||
								packageName.startsWith('output-') ||
								packageName.startsWith('@floppa');

							if (!isLocalAlias && !isResolvable && !existsSync(`${process.cwd()}/node_modules/${packageName}`)) {
								const wating = setInterval(() => {
									loading.info('PACKAGE', `${spinner[count % spinner.length]} Installing package ${colors.yellow(packageName)} for ${text} ${colors.yellow(file)}`);
									count++;
								}, 80);
								try {
									await exec(`npm install ${packageName} --no-audit --no-fund --legacy-peer-deps --${pathCommand.endsWith('.dev.js') ? 'no-save' : 'save'}`);
									clearInterval(wating);
									process.stderr.write('\r\x1b[K');
									console.log(`${colors.green('✔')} installed package ${packageName} successfully`);
								}
								catch (err) {
									clearInterval(wating);
									process.stderr.write('\r\x1b[K');
									console.log(`${colors.red('✖')} installed package ${packageName} failed`);
								}
							}
						}
					}
				}

				// —————————————— CHECK CONTENT SCRIPT —————————————— //
				global.temp.contentScripts[folderModules][file] = contentFile;


				let command = require(pathCommand);
				if (command && command.default && (command.default.config || command.default.meta || command.default.onStart || command.default.entry)) {
					command = command.default;
				}
				command.location = pathCommand;

				// Convert Floppa / Cassidy / Xavia commands to Goat format
				if (command.meta && !command.config) {
					command.config = {
						name: command.meta.name,
						version: command.meta.version || "1.0.0",
						author: command.meta.author || command.meta.credits || "Floppa Engine",
						cooldowns: command.meta.waitingTime || command.meta.cooldown || 5,
						role: command.meta.role !== undefined ? command.meta.role : 0,
						description: command.meta.description || "",
						category: command.meta.category || "Utility",
						guide: { en: command.meta.usage || "" },
						aliases: command.meta.otherNames || command.meta.aliases || []
					};
				}

				if (!command.onStart && (command.entry || command.onCall || command.run || command.execute)) {
					const execFn = command.entry || command.onCall || command.run || command.execute;
					command.onStart = async function ({ api, event, args, message, usersData, threadsData, globalData }) {
						const input = event.input || {
							body: event.body,
							args,
							senderID: event.senderID,
							threadID: event.threadID,
							messageID: event.messageID,
							sid: event.senderID,
							tid: event.threadID
						};
						const output = event.output || {
							reply: (text) => message.reply(text),
							send: (text) => message.send(text),
							react: (emoji) => message.reaction(emoji)
						};
						return execFn({
							api, event, args, message, input, output,
							usersDB: usersData, threadsDB: threadsData, globalDB: globalData,
							usersData, threadsData, globalData
						});
					};
				}

				const configCommand = command.config;
				if (!configCommand)
					throw new Error(`config of ${text} undefined`);
				configCommand.category = configCommand.category || "General";
				const commandName = configCommand.name;
				// ——————————————— CHECK SYNTAXERROR ——————————————— //
				if (!commandName)
					throw new Error(`name of ${text} undefined`);
				if (!command.onStart)
					throw new Error(`onStart of ${text} undefined`);
				if (typeof command.onStart !== "function")
					throw new Error(`onStart of ${text} must be a function`);
				if (GoatBot[setMap].has(commandName)) {
					continue;
				}
				const { onFirstChat, onChat, onLoad, onEvent, onAnyEvent } = command;
				const { envGlobal, envConfig } = configCommand;
				const { aliases } = configCommand;
				// ————————————————— CHECK ALIASES —————————————————— //
				const validAliases = [];
				if (aliases) {
					if (!Array.isArray(aliases))
						throw new Error("The value of \"config.aliases\" must be array!");
					for (const alias of aliases) {
						if (aliases.filter(item => item == alias).length > 1)
							continue;
						if (GoatBot.aliases.has(alias)) {
							continue;
						}
						validAliases.push(alias);
					}
					for (const alias of validAliases)
						GoatBot.aliases.set(alias, commandName);
				}
				// ——————————————— CHECK ENV GLOBAL ——————————————— //
				if (envGlobal) {
					if (typeof envGlobal != "object" || typeof envGlobal == "object" && Array.isArray(envGlobal))
						throw new Error("the value of \"envGlobal\" must be object");
					for (const i in envGlobal) {
						if (!configCommands.envGlobal[i]) {
							configCommands.envGlobal[i] = envGlobal[i];
						}
						else {
							const readCommand = readFileSync(pathCommand, "utf-8").replace(envGlobal[i], configCommands.envGlobal[i]);
							writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ———————————————— CHECK CONFIG CMD ——————————————— //
				if (envConfig) {
					if (typeof envConfig != "object" || typeof envConfig == "object" && Array.isArray(envConfig))
						throw new Error("The value of \"envConfig\" must be object");
					if (!configCommands[typeEnvCommand])
						configCommands[typeEnvCommand] = {};
					if (!configCommands[typeEnvCommand][commandName])
						configCommands[typeEnvCommand][commandName] = {};
					for (const [key, value] of Object.entries(envConfig)) {
						if (!configCommands[typeEnvCommand][commandName][key])
							configCommands[typeEnvCommand][commandName][key] = value;
						else {
							const readCommand = readFileSync(pathCommand, "utf-8").replace(value, configCommands[typeEnvCommand][commandName][key]);
							writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ————————————————— CHECK ONLOAD ————————————————— //
				if (onLoad) {
					if (typeof onLoad != "function")
						throw new Error("The value of \"onLoad\" must be function");
					await onLoad({ api, threadModel, userModel, dashBoardModel, globalModel, threadsData, usersData, dashBoardData, globalData });
				}
				// ——————————————— CHECK RUN ANYTIME ——————————————— //
				if (onChat)
					GoatBot.onChat.push(commandName);
				// ——————————————— CHECK ONFIRSTCHAT ——————————————— //
				if (onFirstChat) {
					if (!GoatBot.onFirstChatCommands.includes(commandName))
						GoatBot.onFirstChatCommands.push(commandName);
					GoatBot.onFirstChat._commandNames = GoatBot.onFirstChatCommands;
				}
				// ————————————————— CHECK ONEVENT ————————————————— //
				if (onEvent)
					GoatBot.onEvent.push(commandName);
				// ———————————————— CHECK ONANYEVENT ———————————————— //
				if (onAnyEvent)
					GoatBot.onAnyEvent.push(commandName);
				// —————————————— IMPORT TO GLOBALGOAT —————————————— //
				GoatBot[setMap].set(commandName.toLowerCase(), command);
				commandLoadSuccess++;
				// ————————————————— COMPARE COMMAND (removed in open source) ————————————————— //

				global.GoatBot[folderModules == "cmds" ? "commandFilesPath" : "eventCommandsFilesPath"].push({
					// filePath: pathCommand,
					filePath: path.normalize(pathCommand),
					commandName: [commandName, ...validAliases]
				});
			}
			catch (error) {
				commandError.push({
					name: file,
					error
				});
			}
			loading.info('LOADED', `${colors.green(`${commandLoadSuccess}`)}${commandError.length ? `, ${colors.red(`${commandError.length}`)}` : ''}`);
		}
		console.log("\r");
		if (commandError.length > 0) {
			log.err("LOADED", getText('loadScripts', 'loadScriptsError', colors.yellow(text)));
			for (const item of commandError)
				console.log(` ${colors.red('✖ ' + item.name)}: ${item.error.message}\n`, item.error);
		}
	}
};