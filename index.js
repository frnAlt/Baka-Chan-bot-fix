/**
 * @title Baka-Chan Bot V2 Runner
 * @author Gtajisan aka Farhan (frnAlt)
 * @description Supervisor process for Baka-Chan Bot V2 with memory management and crash recovery
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	// --expose-gc : lets MemoryManager call global.gc() to force V8 GC when heap is high
	// --max-old-space-size=400 : caps V8 old-gen heap at 400 MB so Node aggressively collects before hitting system limits
	const child = spawn(process.execPath, ["--expose-gc", "--max-old-space-size=400", "Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: false,
		env: { ...process.env, NODE_ENV: process.env.NODE_ENV || "production" }
	});

	child.on("close", (code) => {
		log.info("Project stopped with code:", code);
		if (code === 0) {
			log.info("Project", "Stopped cleanly. Not restarting.");
			return;
		}
		const delay = code === 2 ? 0 : 3000;
		log.info("Project", `Restarting in ${delay / 1000}s...`);
		setTimeout(() => startProject(), delay);
	});
}

startProject();

