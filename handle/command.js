const { prefix, owners } = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = (client, msg) => {
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift();
  args.missing = argsMissing;

  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  }
  if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (!cmd) return undefined;
  if (!owners.includes(msg.author.id) && cmd.conf.module.hide === true) return undefined;
  if (cmd.conf.authorPerm.length > 0 && !msg.member.hasPermission(cmd.conf.authorPerm)) return msg.channel.send(`❌ **Извините, но у вас нет прав ** __**${cmd.conf.authorPerm}**__ ** для выполнения этой комманды.**`).then(x => x.delete({ timeout: 10000, reason: '' }));
  cmd.run(client, msg, args);
};

function argsMissing(msg, res, help) {
  const embed = new MessageEmbed()
    .setColor("#FF1000")
    .setTitle(`🚫 Неправильное использование ${help.name}`)
    .addField("❓ Причина", `\`\`\`${res}\`\`\``)
    .addField("✅ Использование команды", `\`\`\`${help.usage}\`\`\``)
    .addField("📂 Пример", help.example.map(x => `\`\`\`${x}\`\`\``));
  return msg.channel.send(embed);
}