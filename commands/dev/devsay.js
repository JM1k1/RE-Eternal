const { owners } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
  if (!owners.includes(msg.author.id)) return;
  if (args.length < 2)
    return args.missing(msg, "Ты забыл указать юзера", this.help);
  let user = await msg.mentions.users.first();
  msg.channel.send("Сообщение отправлено!");
  return user.send(args.slice(1).join(" "));
};

module.exports.conf = {
  aliases: ["ds"],
  authorPerm: "",
};

module.exports.help = {
  name: "devsay",
  description: "Say as dev",
  usage: "devsay <id> <message>",
  example: ["devsay yo"],
};
