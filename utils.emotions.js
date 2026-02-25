/**
 * 😊 Creep Emotion System
 * 
 * Creeps have emotions based on their experiences!
 * They express their feelings through emojis.
 */

const EMOTIONS = {
  // 😊 Positive emotions
  HAPPY: '😊',
  EXCITED: '🤩',
  PROUD: '😎',
  LOVE: '😍',
  ENERGETIC: '⚡',
  SUCCESSFUL: '⭐',
  
  // 😐 Neutral emotions
  WORKING: '🛠️',
  THINKING: '🤔',
  FOCUSED: '🎯',
  WALKING: '🚶',
  
  // 😔 Negative emotions
  TIRED: '😫',
  CONFUSED: '😵',
  WORRIED: '😟',
  HURT: '🤕',
  STUCK: '😨',
  HUNGRY: '🍔',
  
  // 💪 Activity-based
  HARVESTING: '⛏️',
  BUILDING: '🛠️',
  UPGRADING: '⬆️',
  REPAIRING: '🔧',
  HEALING: '💊',
  FIGHTING: '⚔️',
  TRANSPORTING: '🚚',
  
  // 🎉 Special
  BIRTHDAY: '🎉',
  LEVELUP: '🎆',
  CELEBRATING: '🎊'
};

const MOOD_LEVELS = {
  VERY_HAPPY: 5,
  HAPPY: 4,
  NEUTRAL: 3,
  SAD: 2,
  VERY_SAD: 1
};

class EmotionSystem {
  /**
   * Initialize emotion system for a creep
   */
  static initialize(creep) {
    if (!creep.memory.emotions) {
      creep.memory.emotions = {
        mood: MOOD_LEVELS.NEUTRAL,
        lastEmotion: EMOTIONS.HAPPY,
        experiencePoints: 0,
        achievements: [],
        personalityTraits: this.generatePersonality(),
        birthTick: Game.time
      };
    }
  }
  
  /**
   * Generate random personality traits
   */
  static generatePersonality() {
    const traits = ['cheerful', 'serious', 'energetic', 'calm', 'curious', 'determined'];
    return traits[Math.floor(Math.random() * traits.length)];
  }
  
  /**
   * Update creep's emotion based on current situation
   */
  static updateEmotion(creep) {
    this.initialize(creep);
    
    const emotions = creep.memory.emotions;
    let emoji = EMOTIONS.WORKING;
    let moodChange = 0;
    
    // Check energy level
    const energyPercent = creep.store.getUsedCapacity(RESOURCE_ENERGY) / creep.store.getCapacity(RESOURCE_ENERGY);
    
    if (energyPercent < 0.1) {
      emoji = EMOTIONS.HUNGRY;
      moodChange = -1;
    } else if (energyPercent > 0.9) {
      emoji = EMOTIONS.ENERGETIC;
      moodChange = 1;
    }
    
    // Check health
    const healthPercent = creep.hits / creep.hitsMax;
    if (healthPercent < 0.5) {
      emoji = EMOTIONS.HURT;
      moodChange = -2;
    }
    
    // Check if stuck (same position)
    if (creep.memory.lastPos && 
        creep.pos.x === creep.memory.lastPos.x && 
        creep.pos.y === creep.memory.lastPos.y) {
      creep.memory.stuckCounter = (creep.memory.stuckCounter || 0) + 1;
      if (creep.memory.stuckCounter > 3) {
        emoji = EMOTIONS.STUCK;
        moodChange = -1;
      }
    } else {
      creep.memory.stuckCounter = 0;
    }
    creep.memory.lastPos = {x: creep.pos.x, y: creep.pos.y};
    
    // Role-based emotions
    switch(creep.memory.role) {
      case 'harvester':
        if (creep.harvest) emoji = EMOTIONS.HARVESTING;
        break;
      case 'builder':
        if (creep.build) emoji = EMOTIONS.BUILDING;
        break;
      case 'upgrader':
        emoji = EMOTIONS.UPGRADING;
        break;
      case 'repairer':
        emoji = EMOTIONS.REPAIRING;
        break;
      case 'medic':
        emoji = EMOTIONS.HEALING;
        break;
    }
    
    // Check for achievements
    if (Game.time - emotions.birthTick === 1500) {
      emoji = EMOTIONS.BIRTHDAY;
      this.celebrate(creep, 'Lived 1500 ticks!');
      moodChange = 3;
    }
    
    // Update mood (between 1-5)
    emotions.mood = Math.max(1, Math.min(5, emotions.mood + moodChange));
    
    // Personality affects emoji choice
    if (emotions.personalityTraits === 'cheerful' && Math.random() > 0.7) {
      emoji = EMOTIONS.HAPPY;
    }
    
    emotions.lastEmotion = emoji;
    return emoji;
  }
  
  /**
   * Display emotion above creep
   */
  static display(creep) {
    const emoji = this.updateEmotion(creep);
    creep.say(emoji, true);
  }
  
  /**
   * Make creep celebrate
   */
  static celebrate(creep, achievement) {
    if (!creep.memory.emotions.achievements) {
      creep.memory.emotions.achievements = [];
    }
    creep.memory.emotions.achievements.push({
      name: achievement,
      tick: Game.time
    });
    creep.memory.emotions.mood = MOOD_LEVELS.VERY_HAPPY;
    
    // Show celebration for 5 ticks
    for (let i = 0; i < 5; i++) {
      creep.say(EMOTIONS.CELEBRATING, true);
    }
  }
  
  /**
   * Get creep's current mood description
   */
  static getMoodDescription(creep) {
    this.initialize(creep);
    const mood = creep.memory.emotions.mood;
    
    if (mood >= 5) return 'Very Happy 😄';
    if (mood >= 4) return 'Happy 😊';
    if (mood >= 3) return 'Neutral 😐';
    if (mood >= 2) return 'Sad 😟';
    return 'Very Sad 😭';
  }
  
  /**
   * Interact with another creep (social feature)
   */
  static interact(creep1, creep2) {
    if (creep1.pos.inRangeTo(creep2, 1)) {
      // Both creeps get happy when near each other
      this.initialize(creep1);
      this.initialize(creep2);
      
      creep1.memory.emotions.mood = Math.min(5, creep1.memory.emotions.mood + 0.5);
      creep2.memory.emotions.mood = Math.min(5, creep2.memory.emotions.mood + 0.5);
      
      // Exchange emojis
      creep1.say('👋', true);
      creep2.say('😊', true);
    }
  }
  
  /**
   * Get emotion-based performance modifier
   */
  static getPerformanceModifier(creep) {
    this.initialize(creep);
    const mood = creep.memory.emotions.mood;
    
    // Happy creeps work slightly better!
    if (mood >= 5) return 1.1;  // 10% bonus
    if (mood >= 4) return 1.05; // 5% bonus
    if (mood >= 3) return 1.0;  // Normal
    if (mood >= 2) return 0.95; // 5% penalty
    return 0.9; // 10% penalty
  }
  
  /**
   * Get stats for all creeps
   */
  static getStats() {
    const stats = {
      veryHappy: 0,
      happy: 0,
      neutral: 0,
      sad: 0,
      verySad: 0,
      total: 0
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
  
  /**
   * Console command to check creep emotions
   */
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
      emotions.achievements.forEach(a => {
        console.log('-', a.name, '(tick', a.tick, ')');
      });
    }
  }
}

module.exports = EmotionSystem;
