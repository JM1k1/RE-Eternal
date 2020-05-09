const { devRoles } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
  if (
    !msg.member.roles.cache.some((role) => devRoles.some((i) => i == role.id))
  )
    return (
      msg.channel
        .send(`${msg.author.toString()}, Доступ к команде запрещён.`)
        .then((msgN) => msgN.delete(client.util.msgTimeout(240))) &&
      msg.delete()
    );

  if (args.length < 1)
    return args.missing(msg, "Пустое сообщение", this.help);

  let user = await msg.mentions.users.first();
  if (user) {
    msg.channel
      .send("Сообщение отправлено!")
      .then((msg) => msg.delete({ timeout: 5000, reason: "" }));
    msg.delete();
    return user.send(args.slice(1).join(" "));
  } else return msg.channel.send(args.join(" ")) && msg.delete();
};

module.exports.conf = {
  aliases: ["ds"],
  authorPerm: "",
};

module.exports.help = {
  name: "devsay",
  description: "Отправляет сообщение от имени бота",
  usage: "devsay [@пользователь]",
  example: ["devsay @JMiki Привет!", "ds Всем привет!"],
};
