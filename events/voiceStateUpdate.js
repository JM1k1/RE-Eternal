const Enmap = require("enmap");
users = new Enmap({ name: "users" });

module.exports = async (client, oldState, newState) => {
  if (newState.channel) {
    if (newState.channel.members.size == 2) {
        newState.channel.members.forEach((member) => {
    setUser(member);
      });
    }
    if (newState.channel.members.size > 2) {
        setUser(member);
    }
  }
  if (oldState.channel) {
    if (oldState.channel.members.size == 1) {
        oldState.channel.members.forEach((member) => {
            setDiff(member);
           });
           setDiff(oldState.member);
    }
    if (oldState.channel.members.size >= 2) {
        setDiff(oldState.member);
    }
  }
};


function setUser(member){
    const key = `${member.user.id}`;
    users.ensure(key, {
      user: member.user.username,
      time: 0,
      stime: 0,
    });
    users.set(key, Date.now(), "time");
    console.log(users);
}

function setDiff(member) {
    const key = `${member.user.id}`;
    let startTime = users.get(key, "time");
    const diffTime = Math.floor(Math.abs(Date.now() - startTime) / (1000 * 60));
    users.set(key, {
      time: 0,
      stime: users.get(key, "stime") + diffTime,
    });
    console.log(users);
}