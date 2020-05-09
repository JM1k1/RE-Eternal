const { MessageEmbed } = require("discord.js");
const { prefix } = require("../config.json");
const DefaultRole = "589906909528719418";
const welcomeChannelId = "708702272657293312";
module.exports = async (client, member) => {
  var gifId = [
    //"KxVSYNvW5xC3SUYOrW",
    // "iIAZe3cJp27DIK2GM3",
    "Nx0rz3jtxtEre",
    //"fWx2VKbQyHBzroGgXO",
  ];

  const helloEmbed = new MessageEmbed()
    .setColor("BLUE")
    .setTitle(`Добро пожаловать в ${member.guild.name}`)
    .setAuthor(`${member.user.username}`, member.user.displayAvatarURL())
    .setThumbnail(
      "https://sun9-28.userapi.com/c858528/v858528917/ae416/_F_sUeRTtDo.jpg"
    )
    .setImage(
      "https://media.giphy.com/media/" +
        gifId[Math.floor(Math.random() * gifId.length)] +
        "/giphy.gif"
    )
    .setDescription(
      `\nПриветствуем свежеприбывших бро и бротесс!
      Ты попал на игровой сервер **${member.guild.name}**, где ты сможешь завести новые знакомства, открыть для себя новые игры и развлечения, а так же поднакопить игровых часов в нашем заведении, участвую и организовывая игровые эвенты!\n\nПолучай часы в Re: play, проводя время с друзьями на нашем сервере. За каждые 10 часов игры тут - ты получишь 1 час в Game - Cafe. Подробности узнавай в группе или при общении с офицерами (<@&569936068909072406>).
      \nПользуйся нашими ботами специально разработанными для нужд наших пользователей. Создавай тематические лобби, посты, эвенты или просто ставь музыку под онлайн ролевку с друзьями. Полный список возможностей и команд ты сможешь узнать, набрав в чате **${prefix}help** и бот тебе поможет во всем разобраться.\n\nПросим тебе не флудить в каналах, кроме <#569938010536149052> и не оскорблять напрямую других участников серврера.
      \nПриятной игры в discord - филиале Re: play!
      \n[<:vk:708667238743539744> Наша группа](https://vk.com/replay_spb)
      \n[<:twitch:708672175342616588> Наши стримы](https://dashboard.twitch.tv/justrega)
      \n**BETA_TEST_CHALLENGE**
      Нашел баг или другую интересную дырку в логике наших ботов ? Не торопись абьюзить систему, друг! Напиши нам в группу в вк с подробным описанием бага и мы наградим тебя игровыми днями в нашем клубе.`
    );

  client.channels.cache.get(welcomeChannelId).send(helloEmbed);
  member.roles.add(DefaultRole).catch(console.error);
  client.users.cache
    .get("274556825754664960")
    .send(`Серега, к нам присоединился: ${member.user.toString()}`);
};
