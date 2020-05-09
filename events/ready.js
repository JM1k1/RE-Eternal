const { readFileSync, writeFile } = require("fs");
var lastId = readFileSync("data/lastPostId", "utf8");
const { prefix } = require("../config.json")

module.exports = async (client) => {
  console.log(`✅ ${client.user.tag} is online.`);
  client.user.setActivity(`${prefix}help`, { type: "PLAYING" });
  setInterval(await checkVkPost, 1000 * 600, client);
};

async function checkVkPost(client) {
  const count = 5;
  const { body } = await client.snek.get(
    `https://api.vk.com/method/wall.get?domain=replay_spb&count=${count}&v=5.52&access_token=${process.env.VK_TOKEN}`
  );
  for (let i = count - 1; i > -1; i--) {
    if (body.response.items[i].id > lastId) {
      let post = body.response.items[i];
      lastId = post.id;
      await require("../special_events/vknews")(client, post);
    }
  }
  writeFile("data/lastPostId", lastId, (err) => err);
}
