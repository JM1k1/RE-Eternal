const AntiSpam = require("discord-anti-spam");

const antiSpam = new AntiSpam({
  warnThreshold: 5,
  kickThreshold: 10,
  maxInterval: 2000,
  maxDuplicatesInterval: 60000,
  warnMessage: "{@user}, Пожалуйста, прекратите спамить.",
  kickMessage: "**{user_tag}** был выгнан за спам.",
  maxDuplicatesWarning: 3,
  maxDuplicatesKick: 6,
  deleteMessagesAfterBanForPastDays: 1,
  exemptPermissions: [
    "ADMINISTRATOR",
    "MANAGE_GUILD",
    "BAN_MEMBERS",
  ],
  ignoreBots: true,
  verbose: true,
  ignoredUsers: [],
  ignoredRoles: ["569936068909072406", "571339892081164308","571339418867073034"],
  ignoredChannels: ["569938010536149052"],
  banEnabled: false,
});

module.exports = antiSpam;