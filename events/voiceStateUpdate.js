const Enmap = require("enmap");
users = new Enmap({ name: "users" });

module.exports = async (client, oldState, newState) => {
  if (newState.channel) {
    let nCount = 0;
    if (newState.channel.members != 0) newState.channel.members.forEach((member) => { member.user.bot? null: nCount++ });
    if (nCount == 2) {
      newState.channel.members.forEach((member) => {
        setUser(member);
      });
    }
    if (nCount > 2) {
      setUser(member);
    }
  }
  if (oldState.channel) {
    let oCount = 0;
    if (oldState.channel.members) oldState.channel.members.forEach((member) => { member.user.bot? null: oCount++ });
    if (oCount == 1) {
      oldState.channel.members.forEach((member) => {
        setDiff(member);
      });
      setDiff(oldState.member);
    }
    if (oCount >= 2) {
      setDiff(oldState.member);
    }
  }
};


function setUser(member) {
  if (member.user.bot) return;
  const key = `${member.user.id}`;
  users.ensure(key, {
    user: member.user.username,
    time: 0,
    stime: 0,
  });
  users.set(key, Date.now(), "time");
  //console.log(users);
}

function setDiff(member) {
  if (member.user.bot) return;
  const key = `${member.user.id}`;
  let startTime = users.get(key, "time");
  const diffTime = Math.floor(Math.abs(Date.now() - startTime) / 1000);
  users.set(key, {
    time: 0,
    stime: users.get(key, "stime") + diffTime,
  });
  //console.log(users);
}
