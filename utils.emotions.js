/**
 * 😊 Creep Emotion System
 *
 * Creeps have emotions based on their experiences!
 * They express their feelings through emojis.
 */

const EMOTIONS = {
    HAPPY: '😊',
    EXCITED: '🤩',
    PROUD: '😎',
    LOVE: '😍',
    ENERGETIC: '⚡',
    SUCCESSFUL: '⭐',
    WORKING: '🛠️',
    THINKING: '🤔',
    FOCUSED: '🎯',
    WALKING: '🚶',
    TIRED: '😫',
    CONFUSED: '😵',
    WORRIED: '😟',
    HURT: '🤕',
    STUCK: '😨',
    HUNGRY: '🍔',
    HARVESTING: '⛏️',
    BUILDING: '🛠️',
    UPGRADING: '⬆️',
    REPAIRING: '🔧',
    HEALING: '💊',
    FIGHTING: '⚔️',
    TRANSPORTING: '🚚',
    BIRTHDAY: '🎉',
    LEVELUP: '🎆',
    CELEBRATING: '🎊',
};

const MOOD_LEVELS = {
    VERY_HAPPY: 5,
    HAPPY: 4,
    NEUTRAL: 3,
    SAD: 2,
    VERY_SAD: 1,
};

class EmotionSystem {
    static initialize(creep) {
        if (!creep.memory.emotions) {
            creep.memory.emotions = {
                mood: MOOD_LEVELS.NEUTRAL,
                lastEmotion: EMOTIONS.HAPPY,
                experiencePoints: 0,
                achievements: [],
                personalityTraits: this.generatePersonality(),
                birthTick: Game.time,
            };
        }
    }

    static generatePersonality() {
        const traits = ['cheerful', 'serious', 'energetic', 'calm', 'curious', 'determined'];
        return traits[Math.floor(Math.random() * traits.length)];
    }

    /**
     * エネルギーレベルに基づく感情を取得
     */
    static _getEnergyEmotion(creep) {
        const energyPercent =
            creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
        if (energyPercent < 0.1) return { emoji: EMOTIONS.HUNGRY, moodChange: -1 };
        if (energyPercent > 0.9) return { emoji: EMOTIONS.ENERGETIC, moodChange: 1 };
        return null;
    }

    /**
     * 健康状態に基づく感情を取得
     */
    static _getHealthEmotion(creep) {
        const healthPercent = creep.hits / creep.hitsMax;
        if (healthPercent < 0.5) return { emoji: EMOTIONS.HURT, moodChange: -2 };
        return null;
    }

    /**
     * スタック状態に基づく感情を取得
     */
    static _getStuckEmotion(creep) {
        if (
            creep.memory.lastPos &&
            creep.pos.x === creep.memory.lastPos.x &&
            creep.pos.y === creep.memory.lastPos.y
        ) {
            creep.memory.stuckCounter = (creep.memory.stuckCounter || 0) + 1;
            if (creep.memory.stuckCounter > 3) {
                return { emoji: EMOTIONS.STUCK, moodChange: -1 };
            }
        } else {
            creep.memory.stuckCounter = 0;
        }
        creep.memory.lastPos = { x: creep.pos.x, y: creep.pos.y };
        return null;
    }

    /**
     * ロールに基づく感情を取得
     */
    static _getRoleEmotion(creep) {
        switch (creep.memory.role) {
            case 'harvester':
                return creep.harvest ? EMOTIONS.HARVESTING : null;
            case 'builder':
                return creep.build ? EMOTIONS.BUILDING : null;
            case 'upgrader':
                return EMOTIONS.UPGRADING;
            case 'repairer':
                return EMOTIONS.REPAIRING;
            case 'medic':
                return EMOTIONS.HEALING;
            default:
                return null;
        }
    }

    static updateEmotion(creep) {
        this.initialize(creep);

        const emotions = creep.memory.emotions;

        const updateOffset = creep.name.length % 5;
        if ((Game.time + updateOffset) % 5 !== 0 && emotions.lastEmotion) {
            return emotions.lastEmotion;
        }

        let emoji = EMOTIONS.WORKING;
        let moodChange = 0;

        const emotionChecks = [
            this._getEnergyEmotion(creep),
            this._getHealthEmotion(creep),
            this._getStuckEmotion(creep),
        ];

        for (const result of emotionChecks) {
            if (result) {
                emoji = result.emoji;
                moodChange += result.moodChange;
            }
        }

        const roleEmoji = this._getRoleEmotion(creep);
        if (roleEmoji) {
            emoji = roleEmoji;
        }

        if (Game.time - emotions.birthTick === 1500) {
            emoji = EMOTIONS.BIRTHDAY;
            this.celebrate(creep, 'Lived 1500 ticks!');
            moodChange = 3;
        }

        emotions.mood = Math.max(1, Math.min(5, emotions.mood + moodChange));

        if (emotions.personalityTraits === 'cheerful' && Math.random() > 0.7) {
            emoji = EMOTIONS.HAPPY;
        }

        emotions.lastEmotion = emoji;
        return emoji;
    }

    static display(creep) {
        const emoji = this.updateEmotion(creep);
        creep.say(emoji, true);
    }

    static celebrate(creep, achievement) {
        if (!creep.memory.emotions.achievements) {
            creep.memory.emotions.achievements = [];
        }
        creep.memory.emotions.achievements.push({
            name: achievement,
            tick: Game.time,
        });
        creep.memory.emotions.mood = MOOD_LEVELS.VERY_HAPPY;

        for (let i = 0; i < 5; i++) {
            creep.say(EMOTIONS.CELEBRATING, true);
        }
    }

    static getMoodDescription(creep) {
        this.initialize(creep);
        const mood = creep.memory.emotions.mood;

        if (mood >= 5) return 'Very Happy 😄';
        if (mood >= 4) return 'Happy 😊';
        if (mood >= 3) return 'Neutral 😐';
        if (mood >= 2) return 'Sad 😟';
        return 'Very Sad 😭';
    }

    static interact(creep1, creep2) {
        if (creep1.pos.inRangeTo(creep2, 1)) {
            this.initialize(creep1);
            this.initialize(creep2);

            creep1.memory.emotions.mood = Math.min(5, creep1.memory.emotions.mood + 0.5);
            creep2.memory.emotions.mood = Math.min(5, creep2.memory.emotions.mood + 0.5);

            creep1.say('👋', true);
            creep2.say('😊', true);
        }
    }

    static getPerformanceModifier(creep) {
        this.initialize(creep);
        const mood = creep.memory.emotions.mood;

        if (mood >= 5) return 1.1;
        if (mood >= 4) return 1.05;
        if (mood >= 3) return 1.0;
        if (mood >= 2) return 0.95;
        return 0.9;
    }

    static getStats() {
        const stats = {
            veryHappy: 0,
            happy: 0,
            neutral: 0,
            sad: 0,
            verySad: 0,
            total: 0,
        };

        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            this.initialize(creep);
            const mood = creep.memory.emotions.mood;

            if (mood >= 5) stats.veryHappy++;
            else if (mood >= 4) stats.happy++;
            else if (mood >= 3) stats.neutral++;
            else if (mood >= 2) stats.sad++;
            else stats.verySad++;

            stats.total++;
        }

        return stats;
    }

    static checkCreep(creepName) {
        const creep = Game.creeps[creepName];
        if (!creep) {
            console.log('❌ Creep not found');
            return;
        }

        this.initialize(creep);
        const emotions = creep.memory.emotions;

        console.log('\n🤖 Creep Emotion Report');
        console.log('Name:', creepName);
        console.log('Mood:', this.getMoodDescription(creep));
        console.log('Current Emotion:', emotions.lastEmotion);
        console.log('Personality:', emotions.personalityTraits);
        console.log('Age:', Game.time - emotions.birthTick, 'ticks');
        console.log('Achievements:', emotions.achievements.length);

        if (emotions.achievements.length > 0) {
            console.log('\n🏆 Achievements:');
            emotions.achievements.forEach((a) => {
                console.log('-', a.name, '(tick', a.tick, ')');
            });
        }
    }
}

module.exports = EmotionSystem;
