module.exports = {
  loop: function () {
    for (const creep of Object.values(Game.creeps)) {
      if (creep.spawning) {
        creep.say('🔄 Spawning')
        continue
      }
    }

    // New function for the required dependency
    function performAction () {
      for (const creep of Object.values(Game.creeps)) {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
        if (hostile) {
          creep.attack(hostile)
        }
      }
    }

    // Call the new function if needed
    performAction()
  }
}