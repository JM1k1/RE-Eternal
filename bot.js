const ReternalClient = require("./handle/ReternalClient.js");

const client = new ReternalClient({
  fetchAllMember: true,
  disableEveryone: true
});

require("./handle/events")(client);

require("dotenv").config();
client.login(process.env.BOT_TOKEN);