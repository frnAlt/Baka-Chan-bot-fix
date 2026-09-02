// @ts-check
const {  Files  } = require("@cass-modules/File");
const {  NeaxScript  } = require("@cass-modules/NeaxScript");
const {  UNISpectra  } = require("@cassidy/unispectra");
const UNIUtils = require("@cass-modules/unisym");
const SmartSpectra = require("@cass-modules/SmartSpectra");

const meta = {
  name: "extra-ctx",
  author: "Liane Cagara",
  version: "1.0.0",
  description: "Just registers context variables.",
  supported: "^1.0.0",
  order: -100000,
  type: "plugin",
};

/**
 *
 * @param {CommandContextOG} ctx
 */
async function use(ctx) {
  ctx.Files = Files;
  ctx.NeaxScript = NeaxScript;
  ctx.UNISpectra = UNISpectra;
  ctx.UNIUtils = UNIUtils;
  ctx.SmartSpectra = SmartSpectra;
  ctx.pause = global.utils.delay;
  return ctx.next();
}
