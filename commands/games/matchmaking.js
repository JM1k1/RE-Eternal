const { MessageEmbed } = require("discord.js");
const imageUrl = "https://www.digiseller.ru/preview/400521/p1_2578032_74d6c223.png";
module.exports.run = async (client, msg, args) => {
  if (args.length < 1) return args.missing(msg, "Нету названия", this.help);
  if (!msg.member.voice.channel) return msg.channel.send("Вы должны сначала присоединиться к голосовому каналу");
  gameLimit = parseInt(args[args.length - 1]);
  team = [`${msg.author.toString()}\n`]
  gameName = args[0];
  gameIndex = 1;
  gameDesc = args.slice(0, args.length - 1).join(' ');

  const mmEmbed = new MessageEmbed()
    .setColor("PURPLE")
    .setAuthor(`Подбор игроков`, msg.author.displayAvatarURL())
    .setTitle(`Ищут + ${(gameLimit - 1)} в ${gameDesc}`)
    .setDescription(team)
    .setThumbnail(imageUrl);
  const mmMsg = await msg.channel.send(mmEmbed);
for (var i = 1; i < 10; i++){
  if (!(msg.guild.channels.cache.find(ch => ch.name == (`-${gameName} ${i}`)))){ 
    gameIndex = i ;
    break;
    }
}

  const mmChannel = await msg.guild.channels.create(`-${gameName} ${gameIndex}`, {
    type: 'voice', parent: '695976030510252033', userLimit: gameLimit,
    permissionOverwrites: [
       {
         id: "695234514334515220",
         deny: ['VIEW_CHANNEL'],
      },
    ],
  })
    msg.member.voice.setChannel(await mmChannel);
   return require("../../special_events/mmStateUpdate")(client, mmMsg ,mmChannel, mmEmbed, gameLimit, );
};

module.exports.conf = {
  aliases: ["mm"],
  authorPerm: "",
};

module.exports.help = {
  name: "matchmaking",
  description: "Ping pong with the bot",
  usage: "mm",
  example: ["mm Overwatch <Ranked>"],
};
