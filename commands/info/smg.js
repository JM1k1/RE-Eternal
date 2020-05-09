const { MessageEmbed } = require("discord.js");
const { allowedRoles } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
  if (
    !msg.member.roles.cache.some((role) =>
      allowedRoles.some((i) => i == role.id)
    )
  )
    return (
      msg.channel
        .send(`${msg.author.toString()}, Доступ к команде запрещён.`)
        .then((msgN) => msgN.delete(client.util.msgTimeout(240))) &&
      msg.delete()
    );

  if (args.length < 1) return args.missing(msg, "Пустой заголовок", this.help);
  msg.delete();
  var sb = args.join(" ");
  if (sb.indexOf("{") != -1 && sb.indexOf("}") != -1) {
    var sbTitle = sb.slice(0, sb.indexOf("{"));
    var sbDescrip = sb.slice(sb.indexOf("{") + 1, sb.indexOf("}"));
  } else {
    if (sb.indexOf("(") != -1 && sb.indexOf(")")) {
      var sbTitle = sb.slice(0, sb.indexOf("("));
    } else if (sb.indexOf("/p") != -1) {
      var sbTitle = sb.slice(0, sb.indexOf("/p"));
    } else var sbTitle = sb;
    var sbDescrip = "";
  }
  if (sb.indexOf("(") != -1 && sb.indexOf(")") != -1) {
    var sbImage = sb.slice(sb.indexOf("(") + 1, sb.indexOf(")"));
  } else {
    var sbImage = "https://imgur.com/XUwLITJ";
  }
  const sbEmbed = new MessageEmbed()
    .setTitle(sbTitle)
    .setDescription(sbDescrip)
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setColor("#" + ((Math.random() * 0xffffff) << 0).toString(16))
    .setImage(sbImage);
  var msgNew = await msg.channel.send(sbEmbed);
  if (sb.includes("/p") != false) {
    await msgNew.react("👍");
    await msgNew.react("👎");
  }

  return disagreeReaction(msgNew, msg.author, 3600, ["👎"]);
};

const requiredAmount = 10;

async function disagreeReaction(message, author, time, validReactions) {
  const filter = (reaction, user) =>
    validReactions.includes(reaction.emoji.name) && !user.bot;
  var reactMsg = await message.awaitReactions(filter, {
    max: requiredAmount,
    time: time * 1000,
  });
  if (reactMsg.get("👎").count >= requiredAmount) return message.delete();
}

module.exports.conf = {
  aliases: ["smg"],
  authorPerm: "",
};

module.exports.help = {
  name: "specialmsg",
  description: "Возвращает встроенное сообщение",
  usage: "smg Заголовок {Описание} [Сслыка на изображение] /p",
  example: [
    "smg Новости {Какой-то текст} [https://i.imgur.com/PS5.png]",
    "specialmsg Собираемся на настолку {4 марта в 16:00} /p",
  ],
};
