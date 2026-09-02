/**
 * Represents a utility class for abstracting the api methods.
 * @class
 * @author Nealiana Kaye Cagara <https://github.com/lianecagara>
 * @license MIT
 */
const {  Box  } = require("fca-liane-utils");
module.exports = Object.assign(module.exports || {}, { Box });
const Liane = require("fca-liane-utils");

const meta = {
  name: "liane-box",
  author: "Liane Cagara",
  version: "1.0.0",
  description:
    "Behaves exactly like the Botpack 1.7.2 box functions, WARNING: doesn't work on web.",
  supported: "^1.0.0",
  order: 1,
  type: "plugin",
  expect: ["Box", "Liane", "box"],
};

async function use(obj) {
  obj.Box = Box;
  obj.Liane = Liane;
  obj.box = new Box(obj.api, obj.event);
  obj.next();
}
