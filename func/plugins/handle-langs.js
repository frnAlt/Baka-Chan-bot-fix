const {  LangParser  } = require("@cass-modules/langparser");
const fs = require("fs");
const {  join  } = require("path");

const { defaultLang = "en" } = global.Cassidy.config;
global.logger;

global.logger("Loading Lang file...", "Langs");
let pth = join(process.cwd(), "CommandFiles", "langs", `${defaultLang}.lang`);
if (!fs.existsSync(pth)) {
  global.logger("Loading Lang EN file... (default file not found.)", "Langs");
  pth = join(process.cwd(), "CommandFiles", "langs", `$en.lang`);
}

let data = "";
try {
  data = fs.readFileSync(pth, "utf-8");
} catch (error) {
  global.logger("Err loading the file, this should not happen.", "Langs");
}

const langParser = new LangParser(data);

const meta = {
  name: "handle-langs",
  author: "Liane Cagara",
  version: "2.5.0",
  description: "Language System",
  supported: "^3.0.0",
  order: -1,
  type: "plugin",
  before: ["output"],
};

/**
 *
 * @param {CommandContext} ctx
 */
async function use(ctx) {
  try {
    ctx.langParser = langParser;
    ctx.getLang = langParser.createGetLang(ctx.command?.langs);
  } catch (error) {
    console.error(error);
  } finally {
    ctx.next();
  }
}
