const { MessageEmbed } = require("discord.js");
const imageUrl =
  "https://www.digiseller.ru/preview/400521/p1_2578032_74d6c223.png";

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "Нету названия", this.help);
  if (!msg.member.voice.channel) {
    msg.delete();
    return msg.channel
      .send("Вы должны сначала присоединиться к голосовому каналу")
      .then((msgN) =>
        msgN.delete({ timeout: 6 * 1000, reason: "It had to be done." })
      );
  }

  var game = {
    name: args[0],
    desc: parseInt(args[args.length])
      ? args.slice(1, args.length).join(" ")
      : args.slice(1, args.length - 1).join(" "),
    limit: parseInt(args[args.length - 1] || 0),
  };
  game.embed = await getGameEmbed(game, msg.author.displayAvatarURL());

  game.msg = await msg.channel.send(game.embed);

  for (var i = 1; i < 20; i++) {
    if (
      !msg.guild.channels.cache.find((ch) => ch.name == `${game.name} ${i}`)
    ) {
      game.nameId = i;
      break;
    }
  }

  game.channel = await msg.guild.channels.create(
    `${game.name} ${game.nameId}`,
    {
      type: "voice",
      parent: "695976030510252033",
      userLimit: game.limit,
      permissionOverwrites:
        game.limit > 0
          ? [
              {
                id: "695234514334515220",
                deny: ["VIEW_CHANNEL"],
              },
            ]
          : null,
    }
  );

  msg.member.voice.setChannel(await game.channel);
  
  msg.delete();
  return require("../../special_events/lobbyStateUpdate")(client, game);
};

async function getGameEmbed(game, userAvatar) {
  const gameEmbed = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor(`Подбор игроков 🎮`, userAvatar)
    .setTitle(`${game.name}`)
    .setDescription(`${game.desc}`)
    .setThumbnail(imageUrl);
  return gameEmbed;
}

module.exports.conf = {
  aliases: ["m", "cl"],
  authorPerm: "",
};

module.exports.help = {
  name: "createlobby",
  description: "Create voice lobby",
  usage: "cl [game_name] <game_desc> <limit>",
  example: ["cl Overwatch Ranked 6"],
};
