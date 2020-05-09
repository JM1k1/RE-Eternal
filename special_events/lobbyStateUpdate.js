const reactionAwaitTime = 1000 * 7200;
const emoji = "🎮";

module.exports = async (client, game) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channel) {
      if (oldState.channel.id == game.lobby.id) {
        if (oldState.channel.members.size == 0) {
          oldState.channel.delete();
          return game.msg.delete();
        }
        await game.msg.edit(await updateEmbed(game));
      }
    }

    if (newState.channel) {
      if (newState.channel.id == game.lobby.id) {
        await game.msg.edit(await updateEmbed(game));
      }
    }
  });
};

async function updateEmbed(game) {
  let team = `${game.desc}\n\n**Игроки:**\n` + game.lobby.members.map(member => `${member.toString()}\n`).join("");
  let freeSlots = game.limit - (await game.lobby.members.size);
  if (!game.lobby.full) {
    game.embed.setTitle(`Ищут +${freeSlots} в ${game.name}`);
    game.embed.setAuthor(`Подбор игроков 🎮`, game.authorAvatar);
    game.embed.setDescription(team + `\nПрисоединиться:  [<:plus:708748280066211882>](${game.link})`);
    //awaitReaction(game);
  } else {
    game.embed.setTitle(`Играют в ${game.name}`);
    game.embed.setAuthor(`Приятной игры 🎮`, game.authorAvatar);
    game.embed.setDescription(team);
  }
  return game.embed;
}

async function awaitReaction(game) {
  try {
    if (global.status) return;
    if (await !game.msg) return;
    game.msg.reactions.removeAll();
    await game.msg.react(emoji);

    const filter = (reaction, user) =>
      emoji.includes(reaction.emoji.name) && !user.bot;

    let user = await game.msg
      .awaitReactions(filter, { max: 1, time: reactionAwaitTime })
      .then(
        (collected) =>
          collected.first() &&
          collected.first().users.cache.find((user) => !user.bot)
      );

    if (await !user) return;

    let member = await game.msg.guild.member(user);

    if (await !game.lobby.members.find((mem) => mem.user.id == user.id)) {
      if ((await member.voice) && (await member.voice.channel)) {
        await member.voice.setChannel(await game.lobby);
        return game.msg.reactions.removeAll();
      } else {
        game.msg.channel
          .send(
            `${member.user.toString()}, Вы должны сначала присоединиться к голосовому каналу.`
          )
          .then((msgN) => msgN.delete(client.util.msgTimeout));
      }
    } else {
      game.msg.channel
        .send(`${member.user.toString()}, Вы уже находитесь в лобби.`)
        .then((msgN) => msgN.delete(client.util.msgTimeout));
    }
    return awaitReaction(game);
  } catch (err) {
    console.log(`Await reaction error: ${err}`);
  }
}
