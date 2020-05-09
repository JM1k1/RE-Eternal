const { MessageEmbed } = require("discord.js");

module.exports.run = async (client, msg, args) => {
  try {
    const m = await msg.channel.send("Ping...");
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .addField(
        "⏳ Задержка",
        `__**${m.createdTimestamp - msg.createdTimestamp}ms**__`
      )
      .addField("💓 API", `__**${Math.floor(client.ws.ping)}ms**__`);
    return m.edit(`🏓 Pong..`, { embed: embed });
  } catch (e) {
    console.log("error:", e);
  }
};

module.exports.conf = {
  aliases: ["pi"],
  authorPerm: "",
};

module.exports.help = {
  name: "ping",
  description: "Ping pong with the bot",
  usage: "ping",
  example: ["ping"],
};
