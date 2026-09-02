// @ts-check

const {  exec  } = require("child_process");

/**
 * @type {CommandMeta}
 */
const meta = {
  name: "exec",
  otherNames: ["shell", "$", "terminal"],
  author: "frnAlt",
  version: "1.0.3",
  description: "Execute shell commands",
  usage: "{prefix}{name} <command>",
  category: "Elevated",
  role: 2,
  waitingTime: 5,
  botAdmin: true,
  noPrefix: false,
  whiteList: null,
  ext_plugins: {},
  requirement: "3.0.0",
  icon: ">_",
};

const style = {
  title: "Terminal >_",
  titleFont: "bold",
  contentFont: "none",
};

/**
 *
 * @param {CommandContext} ctx
 * @returns
 */
async function entry({ output, input }) {
  if (!input.isAdmin) return output.reply("Bruh?");
  output.reaction("⏳");
  const command = input.arguments.join(" ");
  if (!command) {
    await output.reply("❌ Please provide a command to execute.");
    return;
  }
  let foo;
  if (!input.isWeb) {
    foo = await output.reply(`⚙️ Executing Command....`);
  }

  let result = "";

  const childProcess = exec(`${command}`, async (error, stdout, stderr) => {
    if (stdout) result += stdout;
    if (stderr) result += stderr;
    if (error) result += error;
    if (!input.isWeb) {
    }
  });

  childProcess.on("close", () => {
    output.reaction("✅");
    if (foo) {
      output.edit(
        `✅ Command executed successfully:\n\n${result}`,
        foo.messageID
      );
    } else {
      output.reply(`✅ Command executed successfully:\n\n${result}`);
    }
  });
}

module.exports = {
  config: meta,
};
