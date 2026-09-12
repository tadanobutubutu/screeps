/**
 * Security & Memory Protection: Creep Emotion System
 */
const MAX_ACHIEVEMENTS = 10;
const MAX_NAME_LENGTH = 100;

function initialize(creep) {
    if (!creep || !creep.memory) return;
    if (!creep.memory.emotions) creep.memory.emotions = {};
    const e = creep.memory.emotions;
    if (typeof e.mood !== 'number' || isNaN(e.mood)) e.mood = 3;
    if (!Array.isArray(e.achievements)) e.achievements = [];
    if (!e.lastEmotion) e.lastEmotion = '😊';
    if (e.birthTick === undefined) e.birthTick = typeof Game !== 'undefined' ? Game.time : 0;
}

function celebrate(creep, achievement) {
    initialize(creep);
    if (!creep || !creep.memory || !creep.memory.emotions) return;
    const name = String(achievement || '').substring(0, MAX_NAME_LENGTH);
    const achievements = creep.memory.emotions.achievements;
    achievements.push({ name, tick: typeof Game !== 'undefined' ? Game.time : 0 });
    while (achievements.length > MAX_ACHIEVEMENTS) {
        achievements.shift();
    }
}

function updateEmotion(creep) {
    initialize(creep);
    if (!creep || !creep.memory || !creep.memory.emotions) return;
    const e = creep.memory.emotions;
    if (typeof e.mood !== 'number' || isNaN(e.mood)) e.mood = 3;
    e.mood = Math.min(5, Math.max(1, e.mood));
}

function interact(creep1, creep2) {
    if (!creep1 || !creep2 || !creep1.memory || !creep2.memory) return;
    initialize(creep1);
    initialize(creep2);
    if (!creep1.memory.emotions || !creep2.memory.emotions) return;
    updateEmotion(creep1);
    updateEmotion(creep2);
    creep1.memory.emotions.mood = Math.min(5, Math.max(1, creep1.memory.emotions.mood + 0.5));
    creep2.memory.emotions.mood = Math.min(5, Math.max(1, creep2.memory.emotions.mood + 0.5));
}

module.exports = {
    initialize,
    celebrate,
    updateEmotion,
    interact,
    display: (creep) => updateEmotion(creep),
    getStats: () => ({}),
    checkCreep: () => ({}),
};
