const { MessageEmbed, Util } = require("discord.js");
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");
const env = require("dotenv").config();
const youtube = new YouTube(process.env.YT_TOKEN);
const choice = ["1⃣", "2⃣", "3⃣", "4⃣", "❌"];

module.exports.youtube = youtube;
module.exports.run = async (client, msg, args) => {
  try {
    if (args.length < 1) return args.missing(msg, "Нету ссылки или названия", this.help);
    const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.channel.send("Вы должны сначала присоединиться к голосовому каналу");
    if (client.queue.has(msg.guild.id) && voiceChannel.id !== client.queue.get(msg.guild.id).voiceChannel.id) return msg.channel.send(`You must be in **${client.queue.get(msg.guild.id).voiceChannel.name}** to play music`);
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      const playlist = await youtube.getPlaylist(url);
      const videos = await playlist.getVideos();
      for (const video of Object.values(videos)) {
        const video2 = await youtube.getVideoByID(video.id);
        await this.handleVideo(client, video2, msg, voiceChannel, true);
      }
      return msg.channel.send(`✅ Плейлист: **${playlist.title}** был добавлен в очередь!`);
    }
    try {
      const video = await youtube.getVideo(url);
      return this.handleVideo(client, video, msg, voiceChannel);
    } catch (e) {
      try {
        const videos = await youtube.searchVideos(args.join(" "), 4);
        let m = await msg.channel.send("Загрузка...");
        for (const chot of choice) {
          await m.react(chot);
        }
        m = await embed(m, videos, "search");
        const filter = (rect, usr) => choice.includes(rect.emoji.name) && usr.id === msg.author.id;
        m.createReactionCollector(filter, { time: 60000, max: 1 })
          .on("collect", async col => {
            if (col.emoji.name === "❌") return m.delete();
            const oneUrl = await youtube.getVideoByID(videos[choice.indexOf(col.emoji.name)].id);
            return this.handleVideo(client, oneUrl, msg, voiceChannel);
          })
          .on("end", c => m.delete());
      } catch (err) {
        return msg.channel.send("🚫 Результат не найден");
      }
    }
  } catch (e) {
    return msg.channel.send(`Oh no an error occured :( \`${e.message}\` try again later`);
  }
};

module.exports.handleVideo = async (client, video, msg, voiceChannel, playlist = false, force = false) => {
  const serverQueue = client.queue.get(msg.guild.id);
  const song = {
    id: video.id,
    title: Util.escapeMarkdown(video.title),
    thumbnail: video.thumbnails.high.url,
    url: `https://www.youtube.com/watch?v=${video.id}`,
    votes: [],
    duration: video.duration,
    requester: msg.author,
    loop: false
  };
  if (!serverQueue) {
    const queueConstruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 50,
      playing: true
    };
    client.queue.set(msg.guild.id, queueConstruct);
    queueConstruct.songs.push(song);
    try {
      const connection = await voiceChannel.join();
      queueConstruct.connection = connection;
      playlist ? undefined : embed(msg, song, "addQueue");
      play(client, msg.guild, queueConstruct.songs[0]);
    } catch (e) {
      client.queue.delete(msg.guild.id);
      return msg.channel.send(`Oh no an error occured :( \`${e.message}\``);
    }
  } else {
    force ? serverQueue.songs.splice(1, 0, song) : serverQueue.songs.push(song);
    if (!playlist) return embed(msg, song, "addQueue");
  }
};

function play(client, guild, song, type = "biasa", seek = 0) {
  const serverQueue = client.queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    return client.queue.delete(guild.id);
  }
  const dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: "audioonly" }), { seek: seek })
    .on("finish", res => {
      if (res && res.includes("seek")) {
        const seekTo = parseInt(res.split(" ")[1], 10);
        serverQueue.songs.shift();
        play(client, guild, serverQueue.songs[0], "seek", seekTo);
      } else {
		 const shiffed = serverQueue.songs.shift();
        if (serverQueue.loop) serverQueue.songs.push(shiffed);
		 play(client, guild, serverQueue.songs[0]);
      }
    })
    .on("error", err => console.error(err));
  dispatcher.setVolume(serverQueue.volume / 50);
  type !== "seek" ? embed(serverQueue.textChannel, song) : undefined;
}

function embed(msg, song, type = "biasa") {
  if (type === "addQueue") {
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(`✅ **Добавлен в очередь: **__**${song.title}**__`)
      .setThumbnail(song.thumbnail);
    return msg.channel.send(embed).then(m => m.delete({timeout:6000,reason:""}));
  }
  if (type === "search") {
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(song.map((x, i) => `${choice[i]} [${x.title}](${x.shortURL})`));
    return msg.edit("🎵 __**Выбор песни**__", { embed: embed });
  }
  return msg.send(`✅ **Сейчас играет: **__**${song.title}**__`);
}

module.exports.conf = {
  aliases: ["p", "pl"],
  clientPerm: "",
  authorPerm: ""
};

module.exports.help = {
  name: "play",
  description: "Играет песни с YouTube",
  usage: "play <url | query | playlist>",
  example: ["play oreno wasuremono", "play https://m.youtube.com/watch?v=UERDkJ5jMjs", "play http://www.youtube.com/playlist?list=PLxC_BSkebVLy4MbwKtpGSq0qv2ivZWl22"]
};