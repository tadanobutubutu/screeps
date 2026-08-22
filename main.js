// Before update: export const calculateScore = (player) => {
    return player.creeps.reduce((sum, creep) => sum + creep.carry.energy, 0);
};

export const moveCreep = (creep, targetPos) => {
    creep.moveTo(targetPos, { reusePath: 5 });
};