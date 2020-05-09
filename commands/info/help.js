const { MessageEmbed } = require("discord.js");
const { prefix } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) {
    var gifId = ["KDsjzYqeMkObAqn2QU"];
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor("Help", msg.author.displayAvatarURL())
      .setTitle("Спасибо, что решил воспользоваться ботом Re:play!")
      .setImage(
        "https://media.giphy.com/media/" +
          gifId[Math.floor(Math.random() * gifId.length)] +
          "/giphy.gif"
      )
      .setFooter(
        `ℹ️ Чтобы получить дополнительную информацию, используйте ${prefix}help <имя команды>`
    )
      .setDescription(`
Ниже ты найдешь описание ролей и команд, доступных тебе для использования.
\n<@&589906909528719418> — этот статус получает любой новичок, присоединившийся впервые к нашему дискорду. С этим званием ты можешь писать в освновные разделы и присоединяться к лобби. Есть карта Re:play? Тогда скорее пиши в сообщения группы для присвоения тебе особого членского статуса!
\n<@&571339418867073034> — член нашего клуба. С этим статусом ты можешь писать во все каналы, создавать игровые лобби, а так же посты и мероприятия.
\n<@&708709661343350804> — ты почетный член нашего клуба и тебе доступны все вышеописанные возможности. Почет тебе и наша любовь. А еще ты можешь заказывать свою музыку в лобби!
\n<@&571339892081164308> — всё вышеперечисленное, но с доступом в особый VIP канал, в который имеют доступ офицеры и ты!
\n<@&569936068909072406> — он же админ. Всегда помогут тебе с любой проблемой и навести порядок в случае конфликтов.
\nКак пользоваться ботом?
Набираем "${prefix}" а после пишем одну из команд:
\n**createlobby** (cl) — создает игровое лобби вместе с постом в лфг. Можно указать название игры и количество мест, чтобы создать лобби с соответствующими параметрами.
\n__Использование:__ ${prefix}cl <Название игры или лобби> [Описание] [Лимит игроков]
__Пример:__ Создаем лобби с лимитом в 6 игроков для игры в Овер с пометкой, что играем в ранкеде. 
\`!createlobby Overwatch Ranked 6\`
\n**specialmsg** (smg) — создает встроенное сообщение. Можно указать название и описание, добавить картинку и голосование, чтобы создать пост с соответствующими параметрами.
\n__Использование:__ ${prefix}smg <Название поста> [{Описание}] [(Ссылка на картинку)] [/p] - для голосования
__Пример:__ Создаем пост для сбора в рейд. 
\`!smg Ищу людей в рейд {В WOW Classic на Рагнароса} (www.img.com/ragnaros.jpg) /p\`
\nℹ️ Не пишите <> или [], это означает что <> необходимо, а [] необязательно \
`);
//\nℹ️ Чтобы получить список комманд, используйте **${prefix}help list**
    return msg.channel.send(embed).then(msgN => msgN.delete({timeout: 360 * 1000, reason: ""}) ) && msg.delete();
  }

  let cmd;
  if (client.commands.has(args[0])) {
    cmd = client.commands.get(args[0]);
  }
  if (client.aliases.has(args[0])) {
    cmd = client.commands.get(client.aliases.get(args[0]));
  }
  if (!cmd || cmd.conf.hide) {
    const embed = new MessageEmbed()
      .setColor("#FF1000")
      .setTitle("🚫 У меня нет такой команды");
    const search = client.commands
      .keyArray()
      .filter((x) => x.includes(args[0]))
      .map((x) => `▫ __**${prefix}${x}**__`);
    search.length > 0
      ? embed.setDescription(
          `**Вы имеете в виду это? :**\n${search.join("\n")}`
        )
      : undefined;
    return msg.channel.send(embed);
  }
  var desc = `**${cmd.help.description}**\n`;
  desc += `\n✂️ **Сокращения**\n`;
  desc +=
    cmd.conf.aliases.length > 0
      ? cmd.conf.aliases.map((x) => `${prefix}${x}`).join(", ")
      : "Нет";
  desc += "\n\n🕹 **Использование**\n" + prefix + cmd.help.usage;
  desc +=
    "\n\n📂 **Пример**\n" +
    cmd.help.example.map((x) => `▫ __${prefix}${x}__`).join("\n");
  const embed = new MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`❗ Информация о команде ${cmd.help.name}`)
    .setDescription(desc);
  return msg.channel.send(embed);
};

module.exports.conf = {
  aliases: ["h"],
  authorPerm: "",
};

module.exports.help = {
  name: "help",
  description: "Первая команда, которую вы наберете",
  usage: "help [комманда]",
  example: ["help", "help ping"],
};
