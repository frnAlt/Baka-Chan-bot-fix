const {  toTitleCase, UNIRedux  } = require("./unisym.js");

class NeonHub {
  constructor({ pulseEffect = true, commands }) {
    this.pulseEffect = pulseEffect;
    this.commands = new Map(
      commands.map((cmd) => [
        cmd.key,
        {
          ...cmd,
          aliases: cmd.aliases || [],
        },
      ])
    );
  }

  async runInContext(context) {
    const { input, output, args } = context;
    const commandKey = input.propertyArray[0];
    const commandArgs = args;

    let command;
    for (const [key, cmd] of this.commands) {
      if (key === commandKey || cmd.aliases.includes(`-${commandKey}`)) {
        command = cmd;
        break;
      }
    }

    if (!command) {
      return this.renderHome(context);
    }

    try {
      const result = await command.handler({
        ...context,
        args: commandArgs,
      });
      if (typeof result === "string") {
        return output.reply(this.addNeonPulse(result));
      }
      return this.addNeonPulse(result);
    } catch (error) {
      return output.reply(
        this.addNeonPulse(
          `⚠️ **SYSTEM ERROR** - Glitch in the neon grid: ${error.message}`
        )
      );
    }
  }

  async renderHome(context) {
    const { output, prefix, money, input } = context;
    const { name = "Unregistered", money: playerMoney = 0 } = await money.get(
      input.senderID
    );
    const gameList = Array.from(this.commands.values())
      .map(
        (cmd) =>
          `${UNIRedux.arrow} ${cmd.description}\n` +
          `   >> "${prefix}${context.commandName}-${cmd.key} ${
            cmd.args?.join(" ") || ""
          }"`
      )
      .join("\n\n");

    const response =
      `🌌 **${name}** @${toTitleCase(
        context.command?.meta?.name ?? "NeonHub"
      )}\n\n` +
      `${UNIRedux.arrow} ***${
        context.command?.meta?.description ?? "Options"
      }***\n\n` +
      `${gameList}\n\n` +
      `💵 **CREDITS**: ${playerMoney.toLocaleString()} | Plug in your bet!`;

    return output.reply(this.addNeonPulse(response));
  }

  addNeonPulse(text) {
    if (!this.pulseEffect) return text;
    return `✨[NEON PULSE]✨\n${text}\n✨[END PULSE]✨`;
  }
}
