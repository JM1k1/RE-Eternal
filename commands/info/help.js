const { MessageEmbed } = require("discord.js");
const { owners } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
    if (args.length < 1) {
      let module = client.helps.array();
      if (!owners.includes(msg.author.id))
        module = client.helps.array().filter((x) => !x.hide);
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setFooter(
          "ℹ️ Чтобы получить дополнительную информацию, используйте e!help <имя команды>"
        );
      for (const mod of module) {
        embed.addField(
          `${mod.emot} | ${mod.name}`,
          mod.cmds.map((x) => `\`${x}\``).join(", ")
        );
      }
      return msg.channel.send(embed);
    }
    let cmd;
    if (client.commands.has(args[0])) {
      cmd = client.commands.get(args[0]);
    }
    if (client.aliases.has(args[0])) {
      cmd = client.commands.get(client.aliases.get(args[0]));
    }
    if (!cmd) {
      const embed = new MessageEmbed()
        .setColor("#FF1000")
        .setTitle("🚫 У меня нет такой команды");
      const search = client.commands
        .keyArray()
        .filter((x) => x.includes(args[0]))
        .map((x) => `▫ __**${x}**__`);
      search.length > 0
        ? embed.setDescription(`**Вы имеете в виду это? :**\n${search.join("\n")}`)
        : undefined;
      return msg.channel.send(embed);
    }
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`❗ Информация о команде для ${cmd.help.name}`)
      .setDescription(`**${cmd.help.description}**`)
      .addField(
        "✂️ Псевдонимы",
        cmd.conf.aliases.length > 0
          ? cmd.conf.aliases.map((x) => `${x}`).join(", ")
          : "Нет"
      )
      .addField(
        "👤 Необходимый уровень доступа",
        cmd.conf.authorPerm.length > 0 ? cmd.conf.authorPerm : "Нет"
      )
      .addField("Использование", cmd.help.usage)
      .addField(
        "📂 Пример",
        cmd.help.example.map((x) => `▫ __**${x}**__`).join("\n")
      )
      .setFooter(
        "ℹ️ Не пишите <> или [], это означает, что <> необходимо, а [] необязательно"
      );
    return msg.channel.send(embed);
};

module.exports.conf = {
  aliases: ["h"],
  clientPerm: "",
  authorPerm: "",
};

module.exports.help = {
  name: "help",
  description: "Первая команда, которую вы наберете",
  usage: "help [комманда]",
  example: ["help", "help ping"],
};
