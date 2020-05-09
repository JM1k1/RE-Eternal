class Util {
  static msgTimeout(time) { return { timeout: time * 1000, reason: "It had to be done." }}

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

  static sortByName(arr, prop) {
    return arr.sort((a, b) => {
      if (prop) return a[prop].toLowerCase() > b[prop].toLowerCase() ? 1 : -1;
      return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    });
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

  static removeDuplicates(arr) {
    if (arr.length === 0 || arr.length === 1) return arr;
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (newArr.includes(arr[i])) continue;
      newArr.push(arr[i]);
    }
    return newArr;
  }

  static codeblock(string, code) {
    return `\`\`\`${code}\n${string}\`\`\``;
  }

  static decodeHtmlEntities(text) {
    return text.replace(/&#(\d+);/g, (rep, code) => String.fromCharCode(code));
  }

  static percentColor(pct, percentColors) {
    let i = 1;
    for (i; i < percentColors.length - 1; i++) {
      if (pct < percentColors[i].pct) {
        break;
      }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
      r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper)
        .toString(16)
        .padStart(2, "0"),
      g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper)
        .toString(16)
        .padStart(2, "0"),
      b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
        .toString(16)
        .padStart(2, "0"),
    };
    return `#${color.r}${color.g}${color.b}`;
  }

  static firstUpperCase(text, split = " ") {
    return text
      .split(split)
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(" ");
  }

  static cleanAnilistHTML(html) {
    let clean = html
      .replace(/\r|\n|\f/g, "")
      .replace(/<br>/g, "\n")
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/<\/?i>/g, "*")
      .replace(/<\/?b>/g, "**")
      .replace(/~!|!~/g, "||")
      .replace(/&mdash;/g, "—");
    if (clean.length > 2000) clean = `${clean.substr(0, 1995)}...`;
    const spoilers = (clean.match(/\|\|/g) || []).length;
    if (spoilers !== 0 && spoilers && spoilers % 2) clean += "||";
    return clean;
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
