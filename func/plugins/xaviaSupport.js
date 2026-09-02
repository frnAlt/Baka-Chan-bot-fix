// @ts-check

const {  Assets  } = require("@cass-modules/XaviaSupport/Assets");
const {  makeBalanceCTX  } = require("@cass-modules/XaviaSupport/Balance");
const {  createXaviaMessage  } = require("@cass-modules/XaviaSupport/utils");

const meta = {
  name: "xavia-support",
  author: "Liane Cagara, XaviaTeam",
  version: "1.0.0",
  description: "Just adds some xavia compatibility",
  supported: "^1.0.0",
  order: 4,
  after: ["output"],
  type: "plugin",
};

/**
 *
 * @param {CommandContext} ctx
 */
async function use(ctx) {
  const message = createXaviaMessage(
    ctx.event,
    {
      type: ctx.event.type,
      commandName: ctx.commandName,
    },
    ctx
  );
  ctx.message = message;
  const balance = makeBalanceCTX(ctx.event.senderID);
  ctx.balance = balance;
  const assets_ = Assets.gI();
  const assets = {
    from: assets_.from,
    ...assets_.from(ctx.command?.meta?.name),
  };
  ctx.assets = assets;
  return ctx.next();
}
