const { MessageEmbed, MessageAttachment } = require("discord.js");
const channelId = "708703182007697430";

module.exports = async (client, post) => {
  let photoArr = [];
  const { body } = await client.snek.get(
    `https://api.vk.com/method/groups.getById?group_id=108550761&fields=members_count,photo_max&v=5.52&access_token=${process.env.VK_TOKEN}`
  );
  const embed = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(body.response[0].name, body.response[0].photo_max)
    .setFooter(`${client.util.convertUnixTime(post.date)}`)
    .setDescription(post.text)
    .setTitle("Новый пост")
    .setURL(`https://vk.com/replay_spb?w=wall${post.from_id}_${post.id}`);

  if (post.attachments) {
    post.attachments.forEach((element) => {
      let item = element.video
        ? element.video
        : element.photo
        ? element.photo
        : null;
      if (item != null)
        photoArr.push(
          item.photo_2560
            ? item.photo_2560
            : item.photo_1280
            ? item.photo_1280
            : item.photo_807
            ? item.photo_807
            : item.photo_800
            ? item.photo_800
            : item.photo_604
            ? item.photo_604
            : item.photo_320
        );
    });
  }
  if (post.text != "" || photoArr[0]) {
    client.channels.cache
      .get(channelId)
      .send(photoArr[0] ? embed.setImage(photoArr.shift()) : embed)
      .then((msgN) => {
        msgN.react("👍");
        msgN.react("👎");
      });
  }
  photoArr.forEach((element) => {
    client.channels.cache.get(channelId).send(new MessageAttachment(element));
  });
};
