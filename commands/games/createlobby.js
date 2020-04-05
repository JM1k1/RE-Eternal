const { MessageEmbed } = require("discord.js");
const gameAssets = require("../../assets/games.json");

module.exports.run = async (client, msg, args) => {
  if (args.length < 1)
    return args.missing(msg, "Не указано название игры", this.help);
  if (!msg.member.voice.channel)
    return msg.channel
      .send("Вы должны сначала присоединиться к голосовому каналу")
      .then((msgN) =>
        msgN.delete({ timeout: 6 * 1000, reason: "It had to be done." })
      );

  var game = {
    name: args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(),
    desc: parseInt(args[args.length])           //Set game description
      ? args.slice(1, args.length).join(" ")
      : args.slice(1, args.length - 1).join(" "),
    limit: parseInt(args[args.length - 1] || 0), //Set lobby limit
    image: gameAssets.default.image,
    authorAvatar: msg.author.displayAvatarURL(),
  };

  //Find game image
  for (var i = 0; i < gameAssets.list.length; i++)
    if (gameAssets.list[i]["name"] == game.name) game.image = gameAssets.list[i].image;

  //Set game embed by async function
  game.embed = await getGameEmbed(game);

  //Get game message
  game.msg = await msg.channel.send(game.embed);

  //Find channel name id
  for (var i = 1; i < 20; i++) {
    if (
      !msg.guild.channels.cache.find((ch) => ch.name == `${game.name} ${i}`)
    ) {
      game.nameId = i;
      break;
    }
  }
  console.log();

  // Create lobby
  game.lobby = await msg.guild.channels.create(
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
                deny: ["VIEW_CHANNEL", "CONNECT"],
              },
            ]
          : null,
    }
  );
  //Move message author to lobby
  msg.member.voice.setChannel(await game.lobby);

  msg.delete();

  return require("../../special_events/lobbyStateUpdate")(client, game);
};

async function getGameEmbed(game) {
  const gameEmbed = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor(`Подбор игроков 🎮`, game.authorAvatar)
    .setTitle(`${game.name}`)
    .setDescription(`${game.desc}`)
    .setThumbnail(game.image);
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
