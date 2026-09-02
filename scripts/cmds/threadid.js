// @ts-check
/**
 * @type {CommandMeta}
 */
const meta = {
  name: "threadid",
  description: "Check threadID",
  author: "frnAlt",
  version: "1.0.1",
  usage: "{prefix}{name}",
  category: "Thread",
  permissions: [0],
  noPrefix: "both",
  waitingTime: 10,
  requirement: "3.0.0",
  otherNames: ["tid"],
  icon: "💬",
  noLevelUI: true,
};

const {  defineEntry  } = require("@cass/define");

const entry = defineEntry(async ({ input, output }) => {
  return output.reply(`${input.threadID}`);
});

module.exports = {
  config: meta,
};
