/**
 * Emotion System Utilities
 */

const EmotionSystem = {
    initialize: function (creep) {
        if (!creep || !creep.memory) return;
        if (!creep.memory.emotions) {
            creep.memory.emotions = {};
        }
        const em = creep.memory.emotions;
        if (typeof em.mood !== 'number' || isNaN(em.mood)) {
            em.mood = 3;
        }
        if (!Array.isArray(em.achievements)) {
            em.achievements = [];
        }
        if (!em.lastEmotion) {
            em.lastEmotion = '😊';
        }
        if (typeof em.birthTick !== 'number') {
            em.birthTick = (global.Game && global.Game.time) || 0;
        }
        if (!em.personalityTraits) {
            em.personalityTraits = 'cheerful';
        }
    },

    celebrate: function (creep, achievement) {
        if (!creep || !creep.memory) return;
        this.initialize(creep);

        let sanitizedName = String(achievement || '');
        if (sanitizedName.length > 100) {
            sanitizedName = sanitizedName.substring(0, 100);
        }

        const em = creep.memory.emotions;
        em.achievements.push({
            name: sanitizedName,
            time: (global.Game && global.Game.time) || 0,
        });

        if (em.achievements.length > 10) {
            em.achievements.shift();
        }
    },

    updateEmotion: function (creep) {
        if (!creep || !creep.memory) return;
        this.initialize(creep);

        const em = creep.memory.emotions;
        let mood = em.mood;
        if (typeof mood !== 'number' || isNaN(mood)) {
            mood = 3;
        }

        // Clamp mood between 1 and 5
        if (mood < 1) mood = 1;
        if (mood > 5) mood = 5;

        em.mood = mood;
    },

    interact: function (creep1, creep2) {
        if (!creep1 || !creep2 || !creep1.memory || !creep2.memory) return;

        this.initialize(creep1);
        this.initialize(creep2);

        let mood1 = creep1.memory.emotions.mood;
        let mood2 = creep2.memory.emotions.mood;

        if (typeof mood1 !== 'number' || isNaN(mood1)) mood1 = 3;
        if (typeof mood2 !== 'number' || isNaN(mood2)) mood2 = 3;

        mood1 = Math.min(5, Math.max(1, mood1 + 0.5));
        mood2 = Math.min(5, Math.max(1, mood2 + 0.5));

        creep1.memory.emotions.mood = mood1;
        creep2.memory.emotions.mood = mood2;

        if (typeof creep1.say === 'function') creep1.say('👋');
        if (typeof creep2.say === 'function') creep2.say('😊');
    },

    display: function (creep) {
        if (!creep) return;
        this.initialize(creep);
        if (typeof creep.say === 'function') {
            creep.say(creep.memory.emotions.lastEmotion || '😊');
        }
    },

    getStats: function () {
        const creeps = (global.Game && global.Game.creeps) || {};
        const stats = { veryHappy: 0, happy: 0, neutral: 0, sad: 0, verySad: 0, total: 0 };
        for (const name in creeps) {
            const c = creeps[name];
            if (c && c.memory && c.memory.emotions) {
                stats.total++;
                const m = c.memory.emotions.mood;
                if (m >= 4.5) stats.veryHappy++;
                else if (m >= 3.5) stats.happy++;
                else if (m >= 2.5) stats.neutral++;
                else if (m >= 1.5) stats.sad++;
                else stats.verySad++;
            }
        }
        return stats;
    },

    checkCreep: function (creepName) {
        const creep = global.Game && global.Game.creeps && global.Game.creeps[creepName];
        if (!creep) return null;
        this.initialize(creep);
        return creep.memory.emotions;
    },
};

module.exports = EmotionSystem;
