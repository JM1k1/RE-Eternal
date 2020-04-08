const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "Пустое описание", this.help);
  msg.delete();
  var sb = args.join(" ");
  if (sb.indexOf("{") != -1 && sb.indexOf("}") != -1) {
    var sbTitle = sb.slice(0, sb.indexOf("{"));
    var sbDescrip = sb.slice(sb.indexOf("{") + 1, sb.indexOf("}"));
  } else {
    if (sb.indexOf("[") != -1 && sb.indexOf("]")) {
      var sbTitle = sb.slice(0, sb.indexOf("["));
    } else if (sb.indexOf("/p") != -1) {
      var sbTitle = sb.slice(0, sb.indexOf("/p"));
    } else var sbTitle = sb;
    var sbDescrip = "";
  }
  if (sb.indexOf("[") != -1 && sb.indexOf("]") != -1) {
    var sbImage = sb.slice(sb.indexOf("[") + 1, sb.indexOf("]"));
  } else {
    var sbImage = "https://imgur.com/XUwLITJ";
  }
  const sbEmbed = new MessageEmbed()
    .setTitle(sbTitle)
    .setDescription(sbDescrip)
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setColor("#" + ((Math.random() * 0xffffff) << 0).toString(16))
    .setImage(sbImage);
  msg.channel.send(sbEmbed).then((msgR) => {
    if (sb.includes("/p") != false) {
      msgR.react("👍");
      msgR.react("👎");
    }
  });
};

module.exports.conf = {
  aliases: ["smg"],
  authorPerm: "",
};

module.exports.help = {
  name: "specialmsg",
  description: "Returns embed message",
  usage: "smg Title {Description} [image Url] /p",
  example: [
    "smg News {We got new game console - PS5} [https://i.imgur.com/PS5.png] /p",
    "specialmsg Report {JMiki - Cool guy}",
  ],
};
