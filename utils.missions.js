const MissionSystem = {
  initMemory() {
    if (!Memory.missions) {
      Memory.missions = {
        active: [],
        completed: 0,
      };
    }
  },

  createMission(type, target, reward) {
    const mission = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      target,
      reward,
      createdAt: Game.time,
      status: 'active',
    };
    Memory.missions.active.push(mission);
    return mission;
  },

  getMissionsForCreep(creep) {
    return Memory.missions.active.filter(m => m.status === 'active');
  },

  completeMission(missionId) {
    const mission = Memory.missions.active.find(m => m.id === missionId);
    if (mission) {
      mission.status = 'completed';
      Memory.missions.completed++;
    }
  },

  getActiveMissions() {
    return Memory.missions.active.filter(m => m.status === 'active');
  },

  createRandomMission() {
    const types = ['scout', 'harvest_boost', 'defense_patrol', 'build_sprint'];
    const type = types[Math.floor(Math.random() * types.length)];

    const targets = Object.values(Game.rooms)[0];
    const rewards = [100, 250, 500];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    return this.createMission(type, targets ? targets.name : 'sim', reward);
  },
};

module.exports = MissionSystem;
