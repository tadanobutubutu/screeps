/**
 * Auto Tutorial System - チュートリアルを完全自動でクリア
 */

const autoTutorial = {
  /**
   * チュートリアル検出
   */
  isTutorial: function() {
    // Tutorialモード検出
    return Game.tutorial && Game.tutorial.currentStep !== undefined;
  },
  
  /**
   * メイン自動実行
   */
  run: function() {
    if (!this.isTutorial()) {
      return false;
    }
    
    const step = Game.tutorial.currentStep;
    console.log('🎮 Auto Tutorial - Step: ' + step);
    
    // ステップ別処理
    switch(step) {
      case 1:
        this.step1_createHarvester();
        break;
      case 2:
        this.step2_harvestEnergy();
        break;
      case 3:
        this.step3_upgradeController();
        break;
      case 4:
        this.step4_buildExtension();
        break;
      case 5:
        this.step5_defendRoom();
        break;
      default:
        this.autoStep();
    }
    
    return true;
  },
  
  /**
   * Step 1: Create harvester
   */
  step1_createHarvester: function() {
    const spawn = Game.spawns['Spawn1'];
    if (!spawn) return;
    
    // Harvesterがいなければ作成
    const harvesters = _.filter(Game.creeps, (c) => c.memory.role === 'harvester');
    
    if (harvesters.length === 0 && !spawn.spawning) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester1', {
        memory: { role: 'harvester' }
      });
      console.log('✅ Created Harvester');
    }
  },
  
  /**
   * Step 2: Harvest energy
   */
  step2_harvestEnergy: function() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      
      if (creep.store.getFreeCapacity() > 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
          }
        }
      } else {
        const spawn = Game.spawns['Spawn1'];
        if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn);
        }
      }
    }
  },
  
  /**
   * Step 3: Upgrade controller
   */
  step3_upgradeController: function() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
          }
        }
      } else {
        if (creep.room.controller) {
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
          }
        }
      }
    }
  },
  
  /**
   * Step 4: Build extension
   */
  step4_buildExtension: function() {
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length > 0) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
          const sources = creep.room.find(FIND_SOURCES);
          if (sources.length > 0) {
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0]);
            }
          }
        } else {
          if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
      }
    }
  },
  
  /**
   * Step 5: Defend room
   */
  step5_defendRoom: function() {
    const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    
    if (towers.length > 0) {
      const tower = towers[0];
      const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
      
      if (hostiles.length > 0) {
        tower.attack(hostiles[0]);
        console.log('💥 Attacking hostile!');
      }
    }
  },
  
  /**
   * 汎用自動ステップ
   */
  autoStep: function() {
    // 基本的なCreep動作
    for (const name in Game.creeps) {
      const creep = Game.creeps[name];
      
      // エネルギーが空
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const sources = creep.room.find(FIND_SOURCES);
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
          }
        }
      } else {
        // 建設サイト優先
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length > 0) {
          if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        } else if (creep.room.controller) {
          // 次にControllerアップグレード
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
          }
        } else {
          // Spawnに配達
          const spawn = Game.spawns['Spawn1'];
          if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
          }
        }
      }
    }
    
    // Tower防衛
    const towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    for (const tower of towers) {
      const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
      if (hostiles.length > 0) {
        tower.attack(hostiles[0]);
      }
    }
    
    // 自動Spawn
    const spawn = Game.spawns['Spawn1'];
    if (spawn && !spawn.spawning && Object.keys(Game.creeps).length < 3) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {
        memory: { role: 'worker' }
      });
    }
  },
  
  /**
   * チュートリアルスキップ（可能な場合）
   */
  skipIfPossible: function() {
    if (Game.tutorial && Game.tutorial.skip) {
      Game.tutorial.skip();
      console.log('⏩ Tutorial skipped!');
      return true;
    }
    return false;
  },
  
  /**
   * チュートリアル進捗表示
   */
  showProgress: function() {
    if (!this.isTutorial()) return;
    
    console.log('🎮 Tutorial Progress:');
    console.log('  Current Step: ' + Game.tutorial.currentStep);
    console.log('  Creeps: ' + Object.keys(Game.creeps).length);
    console.log('  Energy: ' + (Game.spawns['Spawn1'] ? Game.spawns['Spawn1'].store[RESOURCE_ENERGY] : 0));
  }
};

module.exports = autoTutorial;
