// @ts-check
const baybayin = require("baybayin-transliterator");

/**
 * @type {CommandMeta}
 */
const meta = {
  name: "baybayin",
  description: "Convert text into baybayin",
  version: "2.5.0",
  usage: "<prefix>baybayin <query>",
  author: "frnAlt",
  category: "Utilities",
  role: 0,
  noPrefix: false,
  waitingTime: 2,
  requirement: "3.0.0",
  icon: "✏️",
};

/**
 * @type {CommandStyle}
 */
const style = {
  title: "Baybayin ✏️",
  titleFont: "bold",
  contentFont: "fancy",
};

async function entry({ input, output }) {
  const trans = input.arguments.join(" ");
  if (!trans) {
    return output.reply(
      `✏️ | Please provide a word or a sentence to translate into baybayin`
    );
  }
  return output.reply(`**Result:**\n\n${baybayin(trans).baybayin}`);
}

/*@Liane ikaw na bahala irefix to ulit*/

module.exports = {
  config: meta,
};
