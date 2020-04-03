module.exports.run = async (client, msg, args) => {
    const serverQueue = client.queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send("Очередь пуста");
    if (!msg.member.voice.channel) return msg.channel.send("Вы должны сначала присоединиться к голосовому каналу");
    if (serverQueue.voiceChannel.id !== msg.member.voice.channel.id) return msg.channel.send(`Вы должны быть в канале **${serverQueue.voiceChannel.name}** чтобы пропустить песню`);
    if (!serverQueue) return msg.channel.send("Вы уверены? нечего пропустить, потому что очередь пуста");
    const members = serverQueue.voiceChannel.members.filter(x => !x.user.bot);
    if (serverQueue.songs[0].requester.id !== msg.author.id && members.size > 2) {
      if (serverQueue.songs[0].votes.includes(msg.author.id)) return msg.channel.send("Вы уже проголосовали, чтобы пропустить эту песню");
      serverQueue.songs[0].votes.push(msg.author.id);
              console.log(serverQueue.connection.dispatcher);
      if (serverQueue.songs[0].votes.length === 3) {
        msg.channel.send(`⏩ **Текущая песня пропущена: __${serverQueue.songs[0].title}__**`);
        return serverQueue.connection.dispatcher.end();
      }
      return msg.channel.send(`📢 Вы проголосовали за пропуск этой песни, нужно больше голосов! **${serverQueue.songs[0].votes.length} / 3**`);
    }
    msg.channel.send(`⏩ **Текущая песня пропущена: __${serverQueue.songs[0].title}__**`);
    return serverQueue.connection.dispatcher.end();
  };
  
  module.exports.conf = {
    aliases: [],
    clientPerm: "",
    authorPerm: ""
  };
  
  module.exports.help = {
    name: "skip",
    description: "Проспустить текущую песню",
    usage: "skip",
    example: ["skip"]
  };