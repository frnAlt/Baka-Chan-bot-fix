// @ts-check
const {  defineEntry  } = require("@cass/define");
const {  BriefcaseAPI  } = require("@cass-modules/BriefcaseAPI");

/**
 * @type {CommandMeta}
 */
const meta = {
  name: "briefcase",
  description: "Manage your items.",
  author: "frnAlt",
  version: "1.3.1",
  usage: "{prefix}{name} <action> [args]",
  category: "Inventory",
  role: 0,
  waitingTime: 1,
  otherNames: ["case", "brief", "bc", "items", "inv", "inventory"],
  requirement: "2.5.0",
  icon: "🧰",
  cmdType: "cplx_g",
  isGame: true,
};

const { invLimit } = global.Cassidy;

/**
 * @type {CommandStyle}
 */
const style = {
  title: "Briefcase 🧰",
  titleFont: "bold",
  contentFont: "fancy",
};

const briefcase = new BriefcaseAPI({
  inventoryLimit: invLimit,
  inventoryIcon: "🧰",
  inventoryName: "Inventory",
  inventoryKey: "inventory",
  isHypen: false,
  showCollectibles: true,
  meta,
});

const entry = defineEntry((ctx) => briefcase.runInContext(ctx));

module.exports = {
  config: meta,
};
