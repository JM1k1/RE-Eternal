const { Client, Collection } = require("discord.js");
const modules = require("./module");

class ReternalClient extends Client {
  constructor(opt) {
    super(opt);
    this.commands = modules.commands;
    this.aliases = modules.aliases;
    this.helps = modules.helps;
    this.snek = require("node-superfetch");
    this.util = require("./util.js");
    this.queue = new Collection();
  }
}

module.exports = ReternalClient;
