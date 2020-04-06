const { MessageEmbed } = require("discord.js");
const DefaultRole = "695239403907448853";
module.exports = async (client, member) => {
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name == "тестирование"
  );
  if (!channel) return;
  var gifId = [
    "VOPK1BqsMEJRS",
    "iIAZe3cJp27DIK2GM3",
    "Nx0rz3jtxtEre",
    "xTiTnsBpTSEGxIhXqM",
  ];
  const helloEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle(`Добро пожаловать в Discord канал ${member.guild.name}`)
    .setThumbnail("https://media.giphy.com/media/lrgwlecUyTi9RfXb58/giphy.gif")
    .setDescription(
      "\nДля получения статуса члена клуба обратитесь к <@274556825754664960> \n\nДля комфортного времяпрепровождения рекомендуем озокомиться с каналами:\n<#695234711701815336>\n<#695234668697747636>\n\n__Подчёркнутый__ **Жирный**\n\nПолезные ссылки: \n[Группа вк](https://vk.com/replay_spb)"
    )
    .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
    .setImage(
      "https://media.giphy.com/media/" +
        gifId[Math.floor(Math.random() * gifId.length)] +
        "/giphy.gif"
    );

  channel.send(helloEmbed);
  member.roles.add(DefaultRole).catch(console.error);
  client.users.cache
    .get("274556825754664960")
    .send(`Серега, к нам присоединился: ${member.user.toString()}`);
};
