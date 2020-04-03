class Util {
  static randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static shuffle(array) {
    const arr = array.slice(0);
    for (let i = arr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  static chunk(array, chunkSize) {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  }

  static parseDur(ms) {
    let seconds = ms / 1000;
    const days = parseInt(seconds / 86400);
    seconds %= 86400;
    const hours = parseInt(seconds / 3600);
    seconds %= 3600;
    const minutes = parseInt(seconds / 60);
    seconds = parseInt(seconds % 60);

    if (days) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  }

  static async verify(user, msg, time = 30000) {
    await msg.react("🇾");
    await msg.react("🇳");
    const data = await msg.awaitReactions(
      (reaction) => reaction.users.has(user.id),
      { time: time, max: 1 }
    );
    if (data.firstKey() === "🇾") return true;
    return false;
  }

  static codeblock(string, code) {
    return `\`\`\`${code}\n${string}\`\`\``;
  }

  static decodeHtmlEntities(text) {
    return text.replace(/&#(\d+);/g, (rep, code) => String.fromCharCode(code));
  }

  static convertUnixTime(uTime) {
    var a = new Date(uTime * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      (date < 10 ? "0" + date : date) +
      "." +
      (month < 10 ? "0" + month : month) +
      "." +
      year +
      " " +
      hour +
      ":" +
      min +
      ":" +
      sec;
    return time;
  }
}

module.exports = Util;
