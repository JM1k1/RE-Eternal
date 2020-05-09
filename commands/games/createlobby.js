const { MessageEmbed } = require("discord.js");
const gameAssets = require("../../assets/games.json");
const { allowedRoles } = require("../../config.json");
const channelId = "708718532602626089";
module.exports.run = async (client, msg, args) => {
  //Checks if the author of the message has the required role
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

  //Check if message contains name
  if (args.length < 1)
    return args.missing(msg, "Не указано название лобби", this.help);

  //Checks if member in voice channel
  if (!msg.member.voice.channel)
    return msg.channel
      .send(
        `${msg.author.toString()}, Вы должны сначала присоединиться к любому голосовому каналу.`
      )
      .then((msgN) => msgN.delete(client.util.msgTimeout(10)));

  var game = {
    name: args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(),
    desc: parseInt(args[args.length]) //Set game description
      ? args.slice(1, args.length).join(" ")
      : args.slice(1, args.length - 1).join(" "),
    limit: parseInt(args[args.length - 1] || 0), //Set lobby limit
    image: gameAssets.default.image,
    authorAvatar: msg.author.displayAvatarURL(),
  };

  //Finds game image
  for (var i = 0; i < gameAssets.list.length; i++)
    if (gameAssets.list[i]["name"] == game.name)
      game.image = gameAssets.list[i].image;

  //Sets game embed by async function
  game.embed = await getGameEmbed(game);

  //Finds channel name id
  for (var i = 1; i < 20; i++) {
    if (
      !msg.guild.channels.cache.find((ch) => ch.name == `${game.name} ${i}`)
    ) {
      game.nameId = i;
      break;
    }
  }

  //Gets game message
  game.msg = await client.channels.cache.get(channelId).send(game.embed);

  //Create lobby
  game.lobby = await msg.guild.channels.create(`${game.name} ${game.nameId}`, {
    type: "voice",
    parent: "569931496669052934",
    userLimit: game.limit,
    permissionOverwrites:
      game.limit > 0
        ? [
            {
              id: "569931496236777482",
              deny: ["VIEW_CHANNEL"],
            },
          ]
        : null,
  });

  //Create lobby link
  game.link = await game.lobby.createInvite();

  //Delete createlobby message
  msg.delete();

  //Move message author to lobby
  msg.member.voice.setChannel(await game.lobby);

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
  aliases: ["cl"],
  authorPerm: "",
};

module.exports.help = {
  name: "createlobby",
  description: "Создает лобби",
  usage: "cl <Название> [Описание] [Лимит]",
  example: ["cl Overwatch Ranked 6", "cl Code", "createlobby CoD 3"],
};
