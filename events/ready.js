const { readFileSync, writeFile } = require("fs");
var lastId = readFileSync("storage/lastId.db", "utf8");

module.exports = async (client) => {
  console.log(`${client.user.tag} is online.`);
  client.user.setActivity(`Тут пока что пусто.`, { type: "PLAYING" });
  setInterval(checkVkPost, 1000 * 15, client);
};

async function checkVkPost(client) {
  const { body } = await client.snek.get(
    `https://api.vk.com/method/wall.get?domain=replay_spb&count=2&v=5.52&access_token=${process.env.VK_TOKEN}`
  );
  let post;
  if (body.response.items[0].date < body.response.items[1].date)
    post = body.response.items[1];
  else post = body.response.items[0];
  if (lastId < post.id) {
    require("./vknews")(client, post);
    lastId = post.id;
    writeFile("storage/lastId.db", post.id, (err) => err);
  }
}
