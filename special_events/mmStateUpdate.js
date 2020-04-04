module.exports = async (client, msg, mmChannel, embed, limit, desc) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {


    if (oldState.channel != undefined) {
      if (oldState.channel.id == mmChannel.id) {
        if (oldState.channel.members.size == 0) {
          oldState.channel.delete();
          //await msg.delete();
          return;
        }

      }
    }
  
if (newState.channel != undefined) {
    if (newState.channel.id == mmChannel.id) {
        let team = '';
        mmChannel.members.forEach(member => member.toString()? team += `${member.toString()}\n` : null)
        embed.setDescription(team);
        await msg.edit(embed.setDescription(team));
    }
}
//member => member.toString() != undefined ? team += `${member.toString()}\n` : null

});
};


async function updateEmbed(embed, freeSize, channelMembers) {
    let team = '';
    channelMembers.forEach(member => member.toString()? team += `${member.toString()}\n` : null)
    embed.setDescription(team)
    if (freeSize > 0) embed.setTitle(`Ищут + ${(size)} в ${gameDesc}`);
    else embed.setTitle(`Играют в ${gameDesc}`);


}