const express = require("express");
const app = express();
const http = require("http");

app.get("/", (request, response) => {
    console.log("Ping Received: " + new Date().toUTCString());
    response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280001);

require("./bot.js");
