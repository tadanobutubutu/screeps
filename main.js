// role.healer.js
// Healer role implementation for game entities

function findHurtFriend(creep) {
  const friends = creep.room.find(FIND_MY_CREEPS);
  for (const friend of friends) {
    if (friend.hits < friend.hitsMax) {
      return friend;
    }
  }
  return null;
}

function heal(creep) {
  const target = findHurtFriend(creep);
  if (target) {
    if (creep.heal(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
    return true;
  }
  return false;
}

module.exports = {
  findHurtFriend,
  heal
};