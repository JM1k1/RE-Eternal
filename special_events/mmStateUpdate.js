module.exports = async (client, game) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channel != undefined) {
      if (oldState.channel.id == game.channel.id) {
        if (oldState.channel.members.size == 0) {
          oldState.channel.delete();
          await game.msg.delete();
          return;
        }
        await game.msg.edit(await updateEmbed(game));
      }
    }

    if (newState.channel != undefined) {
      if (newState.channel.id == game.channel.id) {
        await game.msg.edit(await updateEmbed(game));
      }
    }
  });
};

async function updateEmbed(game) {
  let team = `${game.desc}\n\nИгроки:\n`;
  let freeSlots = game.limit - (await game.channel.members.size);
  game.channel.members.forEach((member) => (team += `${member.toString()}\n`));
  game.embed.setDescription(team);
  if (freeSlots > 0) {
    game.embed.setTitle(`Ищут + ${freeSlots} в ${game.name}`);
    promptMessage(game, 30);
  } else game.embed.setTitle(`Играют в ${game.name}`);
  return game.embed;
}

async function promptMessage(game, time) {
  time *= 1000;
try {
  if (await !game.msg) return;
    game.msg.reactions.removeAll();
    await game.msg.react("🎮");

  const filter = async (reaction, user) => "🎮".includes(reaction.emoji.name);

  let user = await game.msg
    .awaitReactions(filter, { max: 2, time: time })
    .then(
      (collected) =>
        collected.first() && collected.first().users.cache.array()[1]
    );

 let member = await game.msg.guild.member(user);

    if (!member) return;
  if (await !game.channel.members.find((mem) => mem.user.id == user.id)) {
    if (await member.voice && await member.voice.channel) {
      await member.voice.setChannel(await game.channel);
    } else {
        game.msg.channel.send(`${member.user.toString()}, вы должны сначала присоединиться к голосовому каналу`).then(msgN => msgN.delete({timeout: 6*1000, reason: 'It had to be done.'}));
        return promptMessage(game, 30);
    }
  } else {
    game.msg.channel.send(`${member.user.toString()}, вы уже находитесь в лобби`).then(msgN => msgN.delete({timeout: 6*1000, reason: 'It had to be done.'}));
    return promptMessage(game, 30);
}
  game.msg.reactions.removeAll();
} catch(err){
    console.log(err);
}
}
