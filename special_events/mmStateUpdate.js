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
  } else game.embed.setTitle(`Играют в ${game.name}`);
  return game.embed;
}
