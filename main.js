// Screeps AI - Z世代向けドーパミン爆発システム
// Auto-monitoring + Gamification + Visual Effects + Auto Evolution

const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleExplorer = require('role.explorer');
const roleMedic = require('role.medic');
const roleTransporter = require('role.transporter');
const roleScout = require('role.scout');
const defenseManager = require('defense.manager');
const utilsMemory = require('utils.memory');
const logger = require('utils.logging');
const EmotionSystem = require('utils.emotions');
const memVis = require('memory.visualizer');
const autoTutorial = require('tutorial.auto');
const gamification = require('gamification');
const vfx = require('visual.effects');
const autoEvolution = require('auto.evolution');

module.exports.loop = function () {
  try {
    // 🤖 AUTO EVOLUTION - 自動進化システム
    autoEvolution.run();
    
    // 🎮 AUTO TUTORIAL MODE - チュートリアル自動実行
    if (autoTutorial.isTutorial()) {
      console.log('🤖 AUTO TUTORIAL MODE ACTIVE');
      autoTutorial.run();
      autoTutorial.showProgress();
      return;
    }
    
    // Initialize systems
    logger.init();
    gamification.init();
    gamification.updateStreak();
    
    // Clean up memory
    utilsMemory.cleanMemory();
    
    // 💾 Memory visualizer - auto record
    memVis.recordSnapshot();
    
    // 🧹 Memory cleanup (every 100 ticks)
    if (Game.time % 100 === 0) {
      memVis.cleanup();
    }
    
    // 💾 Auto backup (every 1000 ticks)
    if (Game.time % 1000 === 0) {
      memVis.backup();
    }
    
    // 🎮 Gamification milestones
    if (Game.time % 100 === 0) {
      gamification.checkMilestones();
    }
    
    // 📊 Render gamification dashboard
    if (Game.time % 10 === 0) {
      gamification.renderDashboard();
    }

    // Auto-spawn configuration
    const targetCreeps = {
      harvester: 2,
      upgrader: 2,
      builder: 2,
      repairer: 1,
      transporter: 1,
      scout: 1,
      medic: 1,
      explorer: 1
    };

    // Count creeps by role
    const creepCounts = {};
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;
      creepCounts[role] = (creepCounts[role] || 0) + 1;
    }

    // Auto-spawn logic
    for (const spawnName in Game.spawns) {
      const spawn = Game.spawns[spawnName];
      
      if (spawn.spawning) {
        const spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text(
          '🛠️' + spawningCreep.memory.role,
          spawn.pos.x + 1,
          spawn.pos.y,
          { align: 'left', opacity: 0.8 }
        );
        
        // スポーンエフェクト
        if (Game.time % 5 === 0) {
          vfx.stars(spawn.pos, 5);
        }
        
        continue;
      }

      // Find role that needs spawning
      for (const role in targetCreeps) {
        const current = creepCounts[role] || 0;
        const target = targetCreeps[role];
        
        if (current < target) {
          const newName = role + '_' + Game.time;
          const body = getBodyForRole(role, spawn.room.energyAvailable);
          
          if (body.length > 0) {
            const result = spawn.spawnCreep(body, newName, { memory: { role: role } });
            
            if (result === OK) {
              logger.info('Spawning new ' + role + ': ' + newName);
              creepCounts[role] = current + 1;
              
              // スポーン成功エフェクト
              vfx.successExplosion(spawn.pos);
              gamification.addXP(20, 'Spawned ' + role);
              
              break;
            } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
              logger.warn('Failed to spawn ' + role + ': ' + result);
            }
          }
          break;
        }
      }
    }

    // Run all creeps with error handling & emotion system
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      const role = creep.memory.role;

      logger.tryCatch(function() {
        // 😊 Update and display emotions
        EmotionSystem.display(creep);
        
        // Run role logic
        switch (role) {
          case 'harvester':
            roleHarvester.run(creep);
            break;
          case 'upgrader':
            roleUpgrader.run(creep);
            break;
          case 'builder':
            roleBuilder.run(creep);
            break;
          case 'repairer':
            roleRepairer.run(creep);
            break;
          case 'explorer':
            roleExplorer.run(creep);
            break;
          case 'medic':
            roleMedic.run(creep);
            break;
          case 'transporter':
            roleTransporter.run(creep);
            break;
          case 'scout':
            roleScout.run(creep);
            break;
          default:
            logger.warn('Unknown role: ' + role);
        }
      }, 'creep_' + name);
    }
    
    // 👥 Social interactions - creeps greet each other when nearby
    if (Game.time % 50 === 0) {
      const creeps = Object.values(Game.creeps);
      for (let i = 0; i < creeps.length; i++) {
        for (let j = i + 1; j < creeps.length; j++) {
          if (Math.random() > 0.7) {
            EmotionSystem.interact(creeps[i], creeps[j]);
          }
        }
      }
    }

    // Run defense manager for all owned rooms
    for (const roomName in Game.rooms) {
      const room = Game.rooms[roomName];
      if (room.controller && room.controller.my) {
        logger.tryCatch(function() {
          defenseManager.run(room);
        }, 'defense_' + roomName);
      }
    }

    // Display stats every 100 ticks
    if (Game.time % 100 === 0) {
      logger.info('Tick: ' + Game.time + ', Creeps: ' + Object.keys(Game.creeps).length);
      
      const logStats = logger.getStats();
      if (logStats.errors > 0) {
        logger.warn('Recent errors: ' + logStats.errors + ' (auto-fix system active)');
      }
      
      // 😊 Display emotion stats
      const emotionStats = EmotionSystem.getStats();
      logger.info('Emotions - Happy: ' + (emotionStats.veryHappy + emotionStats.happy) + 
                  ', Neutral: ' + emotionStats.neutral + 
                  ', Sad: ' + (emotionStats.sad + emotionStats.verySad));
      
      // 🎮 Display gamification stats
      const gm = Memory.gamification;
      if (gm) {
        logger.info('Level: ' + gm.level + ', XP: ' + gm.xp + '/' + gm.xpToNext + 
                    ', Score: ' + gm.totalScore);
      }
      
      // 🤖 Display evolution stats
      const evo = Memory.evolution;
      if (evo) {
        logger.info('Evolutions: ' + evo.stats.totalEvolutions + 
                    ', Queue: ' + evo.queue.length + 
                    ', Suggestions: ' + evo.suggestions.length);
      }
    }
    
  } catch (e) {
    // Top-level error catch
    if (typeof logger !== 'undefined' && logger.error) {
      logger.error('CRITICAL: Main loop exception: ' + e.message + '\n' + e.stack);
    } else {
      console.log('❌ CRITICAL ERROR: ' + e.message);
    }
  }
};

function getBodyForRole(role, energy) {
  const bodies = {
    harvester: [[WORK, WORK, CARRY, MOVE], 300],
    upgrader: [[WORK, WORK, CARRY, MOVE], 300],
    builder: [[WORK, CARRY, CARRY, MOVE], 300],
    repairer: [[WORK, CARRY, MOVE], 200],
    transporter: [[CARRY, CARRY, MOVE, MOVE], 200],
    scout: [[MOVE], 50],
    medic: [[HEAL, MOVE], 300],
    explorer: [[MOVE], 50]
  };

  const body = bodies[role] || [[MOVE, WORK, CARRY], 200];
  const cost = body[1];
  const parts = body[0];
  
  if (energy >= cost) {
    return parts;
  }
  
  // Fallback to minimal body
  return [MOVE, WORK, CARRY];
}

// ==============================================
// ⌨️ SUPER SHORT CONSOLE COMMANDS
// ==============================================

// 😊 Emotion commands
global.e = EmotionSystem.getStats.bind(EmotionSystem);
global.ec = EmotionSystem.checkCreep.bind(EmotionSystem);

// 💾 Memory commands  
global.m = memVis.showStats.bind(memVis);
global.mh = memVis.showHistory.bind(memVis);
global.ml = memVis.showLeaderboard.bind(memVis);
global.md = memVis.readDiary.bind(memVis);
global.mm = memVis.showMap.bind(memVis);
global.mc = memVis.cleanup.bind(memVis);
global.mb = memVis.backup.bind(memVis);
global.mr = memVis.restore.bind(memVis);

// 🎮 Tutorial commands
global.t = autoTutorial.showProgress.bind(autoTutorial);
global.ts = autoTutorial.skipIfPossible.bind(autoTutorial);

// ✨ Gamification commands
global.g = gamification.showDashboard.bind(gamification);
global.gr = gamification.reset.bind(gamification);

// 🤖 Auto Evolution commands
global.evo = autoEvolution.showDashboard.bind(autoEvolution);
global.evor = autoEvolution.reset.bind(autoEvolution);

// Helper function for common commands
global.help = function() {
  console.log('\n✨ === Quick Commands === ✨');
  console.log('\n😊 Emotions:');
  console.log('  e()       - emotion stats');
  console.log('  ec(name)  - check creep');
  console.log('\n💾 Memory:');
  console.log('  m()       - memory stats');
  console.log('  mh()      - history');
  console.log('  mh(20)    - history 20');
  console.log('  ml()      - leaderboard');
  console.log('  ml(type)  - specific board');
  console.log('  md(name)  - read diary');
  console.log('  mm()      - show map');
  console.log('  mc()      - cleanup');
  console.log('  mb()      - backup');
  console.log('  mr()      - restore');
  console.log('\n🎮 Tutorial:');
  console.log('  t()       - tutorial progress');
  console.log('  ts()      - skip tutorial');
  console.log('\n✨ Gamification:');
  console.log('  g()       - gamification dashboard');
  console.log('  gr()      - reset gamification');
  console.log('\n🤖 Auto Evolution:');
  console.log('  evo()     - evolution dashboard');
  console.log('  evor()    - reset evolution');
  console.log('\nLeaderboard types:');
  console.log('  harvested, built, upgraded, repaired');
  console.log('\n✨ Type help() to see this again!');
};

// Show help on first load
if (!Memory.helpShown) {
  Memory.helpShown = true;
  global.help();
}
