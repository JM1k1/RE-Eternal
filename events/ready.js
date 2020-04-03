const { readFileSync, writeFile } = require("fs");
const snek = require("node-superfetch");
module.exports = async (client) => {
  console.log(`${client.user.tag} is online.`);
  client.user.setActivity(`Тут пока что пусто.`, { type: "PLAYING" });
  setInterval(async () => await checkVkPost(client), 1000 * 30);
};

async function checkVkPost(client) {
  const lastId = readFileSync("storage/lastId.db", "utf8");
  const post = await getPostId();
  if (lastId < post.id) {
    require("./vknews")(client, post);
    writeFile("storage/lastId.db", post.id, (err) =>
      err ? console.log(err) : err
    );
  }
}

async function getPostId() {
  const { body } = await snek.get(
    `https://api.vk.com/method/wall.get?domain=replay_spb&count=2&v=5.52&access_token=${process.env.VK_TOKEN}`
  );
  if (body.response.items[0].date < body.response.items[1].date)
    return body.response.items[1];
  else return body.response.items[0];
}
