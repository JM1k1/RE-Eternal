const { devRoles } = require("../../config.json");
const Enmap = require("enmap");
users = new Enmap({ name: "users" });

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
  let user = await msg.mentions.users.first();
  if (!user) return args.missing(msg, "Не указан пользователь", this.help);
  const key = `${user.id}`;
  try {
    var spendTime = users.get(key, "stime");
  } catch (err) {
    return msg.channel.send(
      "Пользователь не найден, возможно он еще не заходил в голосовые каналы"
    );
  }
  if (spendTime >= 3600) {
    msg.author.send(
      `${user.toString()} провел в голосовом чате: ${Math.floor(
        spendTime / (60 * 60)
      )} ч ${Math.floor((spendTime % 3600) / 60)} мин ${
        (spendTime % 3600) % 60
      } сек`
    );
  } else if (spendTime >= 60) {
    msg.author.send(
      `${user.toString()} провел в голосовом чате: ${Math.floor(
        spendTime / 60
      )} мин ${spendTime % 60} сек`
    );
  } else {
    msg.author.send(
      `${user.toString()} провел в голосовом чате: ${spendTime % 60} сек`
    );
  }

  msg.delete();
};

module.exports.conf = {
  aliases: ["ut"],
  authorPerm: "",
};

module.exports.help = {
  name: "usertime",
  description: "Returns time user spend in voice channel",
  usage: "ut [user mention]",
  example: ["ut @JMiki"],
};
