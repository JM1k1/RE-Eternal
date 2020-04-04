const { MessageEmbed } = require("discord.js");
const imageUrl = "https://www.digiseller.ru/preview/400521/p1_2578032_74d6c223.png";

module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "Нету названия", this.help);
  if (!msg.member.voice.channel) return msg.channel.send("Вы должны сначала присоединиться к голосовому каналу");
  gameLimit = parseInt(args[args.length - 1]);
  gameName = args[0];
  gameIndex = 1;
  gameDesc = args.slice(1, args.length - 1).join(' ');
  gameEmbed = await getGameEmbed(gameName, gameDesc, msg.author.displayAvatarURL());
  const gameMsg = await msg.channel.send(gameEmbed);
for (var i = 1; i < 10; i++){
  if (!(msg.guild.channels.cache.find(ch => ch.name == (`-${gameName} ${i}`)))){ 
    gameIndex = i ;
    break;
    }
}

  const gameChannel = await msg.guild.channels.create(`-${gameName} ${gameIndex}`, {
    type: 'voice', parent: '695976030510252033', userLimit: gameLimit,
    permissionOverwrites: [
       {
         id: "695234514334515220",
         deny: ['VIEW_CHANNEL'],
      },
    ],
  })
    msg.member.voice.setChannel(await gameChannel);
    msg.delete();
   return require("../../special_events/mmStateUpdate")(client, gameMsg ,gameChannel, gameEmbed, gameLimit, gameName, gameDesc);
};

async function getGameEmbed(gameName, gameDesc, userAvatar) {
    const gameEmbed = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor(`Подбор игроков`, userAvatar)
    .setTitle(`${gameName}`)
    .setDescription(`${gameDesc}`)
    .setThumbnail(imageUrl);
    return gameEmbed
}

module.exports.conf = {
  aliases: ["cl","mm"],
  authorPerm: "",
};

module.exports.help = {
  name: "createLobby",
  description: "Create voice lobby",
  usage: "cl",
  example: ["cl Overwatch <Ranked>"],
};
