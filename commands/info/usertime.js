const { MessageEmbed } = require("discord.js");
const Enmap = require("enmap");
users = new Enmap({ name: "users" });

module.exports.run = async (client, msg, args) => {
  let user = await msg.mentions.users.first();
  if (!user) return args.missing(msg, "Не упомянут пользователь", this.help);
  const key = `${user.id}`;
  try {
    var spendTime = users.get(key, "stime");
  } catch (err) {
    return msg.channel.send(
      "Не могу найти пользователя, возможно он еще не заходил в голосовые каналы"
    );
  }
  if (spendTime >= 3600) {
    msg.channel.send(
      `${user.toString()} провел в голосовом чате: ${Math.floor(
        spendTime / (60 * 60)
      )} ч ${Math.floor((spendTime % 3600) / 60)} мин ${
        (spendTime % 3600) % 60
      } сек`
    );
  } else if (spendTime >= 60) {
    msg.channel.send(
      `${user.toString()} провел в голосовом чате: ${Math.floor(
        spendTime / 60
      )} мин ${spendTime % 60} сек`
    );
  } else {
    msg.channel.send(
      `${user.toString()} провел в голосовом чате: ${spendTime % 60} сек`
    );
  }

  msg.delete();
};

module.exports.conf = {
  aliases: ["ut"],
  authorPerm: "ADMINISTRATOR",
};

module.exports.help = {
  name: "ut",
  description: "Returns time user spend in voice channel",
  usage: "ut [user mention]",
  example: ["ut @JMiki"],
};
