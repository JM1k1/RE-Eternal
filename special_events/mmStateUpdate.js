module.exports = async (client, msg, gameChannel, embed, limit, name, desc) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (oldState.channel != undefined) {
      if (oldState.channel.id == gameChannel.id) {
        if (oldState.channel.members.size == 0) {
          oldState.channel.delete();
          await msg.delete();
          return;
        }
        await msg.edit(
          await updateEmbed(embed, limit, oldState.channel, name, desc)
        );
      }
    }

    if (newState.channel != undefined) {
      if (newState.channel.id == gameChannel.id) {
        await msg.edit(await updateEmbed(embed, limit, newState.channel, name, desc));
      }
    }
  });
};

async function updateEmbed(embed, limit, channel, name, desc) {
  let team = `${desc}\n\nИгроки:\n`;
  let freeSlots = limit - await channel.members.size;
  channel.members.forEach((member) =>
    (team += `${member.toString()}\n`)
  );
  embed.setDescription(team);
  if (freeSlots > 0) {
    embed.setTitle(`Ищут + ${freeSlots} в ${name}`);
  } else embed.setTitle(`Играют в ${name}`);
  
  return embed;
}
