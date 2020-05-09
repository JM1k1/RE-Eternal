const Enmap = require("enmap");
const { devRoles } = require("../../config.json");

module.exports.run = async (client, msg, args) => {
  if (
    !msg.member.roles.cache.some((role) => devRoles.some((i) => i == role.id))
  )
    return (
      msg.channel
        .send(`${msg.author.toString()}, Доступ к команде запрещён.`)
        .then((msgN) => msgN.delete(client.util.msgTimeout(240))) &&
      msg.delete()
    );

  var users = await new Enmap({ name: "users" });
  var sorted = users.array().sort((a, b) => b.stime - a.stime);
  var usrStr = "";
  for (const data of sorted) {
    let timeStr = "";
    if (data.stime >= 3600)
      timeStr = ` ${Math.floor(data.stime / (60 * 60))} ч ${Math.floor(
        (data.stime % 3600) / 60
      )} мин`;
    else if (data.stime >= 60) timeStr = `${Math.floor(data.stime / 60)} мин`;
    if (timeStr.length > 0) {
      usrStr += `${await client.users
        .fetch(data.userId)
        .then((usr) => usr.toString())} Время: ${timeStr}\n`;
    }
  }

  msg.author.send(`Список\n${usrStr}`);
  return msg.delete();
};

module.exports.conf = {
  aliases: ["ul"],
  authorPerm: "",
};

module.exports.help = {
  name: "userlist",
  description: "Возвращает таблицу с пользователями",
  usage: "userlist",
  example: ["ul"],
};
