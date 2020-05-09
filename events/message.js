const { prefix } = require("../config.json");
const antiSpam = require("../handle/antispam");

module.exports = async (client, msg) => {
  antiSpam.message(msg);
  if (msg.author.bot || !msg.guild) return;
  if (!msg.member && msg.guild) msg.member = await msg.guild.members.fetch(msg);
  if (msg.content.startsWith(prefix))
    return require("../handle/command.js")(client, msg);
};
