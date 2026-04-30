/* global describe, test, expect, beforeEach, jest, Game, Memory, _, WORK, CARRY, MOVE, ATTACK, RANGED_ATTACK, HEAL, TOUGH, CLAIM, STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL, STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_CONTROLLER, STRUCTURE_LINK, STRUCTURE_STORAGE, STRUCTURE_TOWER, STRUCTURE_OBSERVER, STRUCTURE_POWER_BANK, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_LAB, STRUCTURE_TERMINAL, STRUCTURE_CONTAINER, STRUCTURE_NUKER, STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE, FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT, FIND_CREEPS, FIND_MY_CREEPS, FIND_HOSTILE_CREEPS, FIND_SOURCES_ACTIVE, FIND_SOURCES, FIND_DROPPED_RESOURCES, FIND_STRUCTURES, FIND_MY_STRUCTURES, FIND_HOSTILE_STRUCTURES, FIND_FLAGS, FIND_CONSTRUCTION_SITES, FIND_MY_SPAWNS, FIND_HOSTILE_SPAWNS, FIND_MY_CONSTRUCTION_SITES, FIND_HOSTILE_CONSTRUCTION_SITES, FIND_MINERALS, FIND_NUKES, FIND_TOMBSTONES, FIND_POWER_CREEPS, FIND_MY_POWER_CREEPS, FIND_HOSTILE_POWER_CREEPS, FIND_DEPOSITS, FIND_RUINS, RESOURCE_ENERGY, RESOURCE_POWER, RESOURCE_HYDROGEN, RESOURCE_OXYGEN, RESOURCE_UTRIUM, RESOURCE_LEMERGIUM, RESOURCE_KEANIUM, RESOURCE_ZYNTHIUM, RESOURCE_CATALYST, RESOURCE_GHODIUM, ERR_NOT_OWNER, ERR_NO_PATH, ERR_NAME_EXISTS, ERR_BUSY, ERR_NOT_FOUND, ERR_NOT_ENOUGH_ENERGY, ERR_NOT_ENOUGH_RESOURCES, ERR_INVALID_TARGET, ERR_FULL, ERR_NOT_IN_RANGE, ERR_INVALID_ARGS, ERR_TIRED, ERR_NO_BODYPART, ERR_NOT_ENOUGH_EXTENSIONS, ERR_RCL_NOT_ENOUGH, ERR_GCL_NOT_ENOUGH */
/**
 * Auto Tutorial System - チュートリアルを完全自動でクリア
 */

const autoTutorial = {
  /**
     * チュートリアル検出
     */
  isTutorial: function () {
    // Tutorialモード検出
    return Game.tutorial && Game.tutorial.currentStep !== undefined
  },

  /**
     * メイン自動実行
     */
  run: function () {
    if (!this.isTutorial()) {
      return false
    }

    const step = Game.tutorial.currentStep
    console.log('🎮 Auto Tutorial - Step: ' + step)

    // ステップ別処理
    switch (step) {
      case 1:
        this.step1_createHarvester()
        break
      case 2:
        this.step2_harvestEnergy()
        break
      case 3:
        this.step3_upgradeController()
        break
      case 4:
        this.step4_buildExtension()
        break
      case 5:
        this.step5_defendRoom()
        break
      default:
        this.autoStep()
    }

    return true
  },

  /**
     * Step 1: Create harvester
     */
  step1_createHarvester: function () {
    const spawn = Game.spawns.Spawn1
    if (!spawn) {
      return
    }

    // Harvesterがいなければ作成
    const harvesters = _.filter(Game.creeps, (c) => c.memory.role === 'harvester')

    if (harvesters.length === 0 && !spawn.spawning) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester1', {
        memory: { role: 'harvester' }
      })
      console.log('✅ Created Harvester')
    }
  },

  /**
     * Step 2: Harvest energy
     */
  step2_harvestEnergy: function () {
    const sourcesCache = {}
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      if (creep.store.getFreeCapacity() > 0) {
        const roomName = creep.room.name
        const sources =
                    sourcesCache[roomName] ||
                    (sourcesCache[roomName] = creep.room.find(FIND_SOURCES))
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0])
          }
        }
      } else {
        const spawn = Game.spawns.Spawn1
        if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(spawn)
        }
      }
    }
  },

  /**
     * Step 3: Upgrade controller
     */
  step3_upgradeController: function () {
    const sourcesCache = {}
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      if (creep.store[RESOURCE_ENERGY] === 0) {
        const roomName = creep.room.name
        const sources =
                    sourcesCache[roomName] ||
                    (sourcesCache[roomName] = creep.room.find(FIND_SOURCES))
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0])
          }
        }
      } else {
        if (creep.room.controller) {
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
          }
        }
      }
    }
  },

  /**
     * Step 4: Build extension
     */
  step4_buildExtension: function () {
    const sitesCache = {}
    const sourcesCache = {}
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      const roomName = creep.room.name
      const targets =
                sitesCache[roomName] ||
                (sitesCache[roomName] = creep.room.find(FIND_CONSTRUCTION_SITES))
      if (targets.length > 0) {
        if (creep.store[RESOURCE_ENERGY] === 0) {
          const roomName = creep.room.name
          const sources =
                        sourcesCache[roomName] ||
                        (sourcesCache[roomName] = creep.room.find(FIND_SOURCES))
          if (sources.length > 0) {
            if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0])
            }
          }
        } else {
          if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0])
          }
        }
      }
    }
  },

  /**
     * Step 5: Defend room
     */
  step5_defendRoom: function () {
    const hostilesCache = {}
    const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER)

    if (towers.length > 0) {
      const tower = towers[0]
      const roomName = tower.room.name
      const hostiles =
                hostilesCache[roomName] ||
                (hostilesCache[roomName] = tower.room.find(FIND_HOSTILE_CREEPS))

      if (hostiles.length > 0) {
        tower.attack(hostiles[0])
        console.log('💥 Attacking hostile!')
      }
    }
  },

  /**
     * 汎用自動ステップ
     */
  autoStep: function () {
    const sourcesCache = {}
    const sitesCache = {}
    const hostilesCache = {}
    // 基本的なCreep動作
    for (const name in Game.creeps) {
      const creep = Game.creeps[name]

      // エネルギーが空
      if (creep.store[RESOURCE_ENERGY] === 0) {
        const roomName = creep.room.name
        const sources =
                    sourcesCache[roomName] ||
                    (sourcesCache[roomName] = creep.room.find(FIND_SOURCES))
        if (sources.length > 0) {
          if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0])
          }
        }
      } else {
        // 建設サイト優先
        const roomName = creep.room.name
        const targets =
                    sitesCache[roomName] ||
                    (sitesCache[roomName] = creep.room.find(FIND_CONSTRUCTION_SITES))
        if (targets.length > 0) {
          if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0])
          }
        } else if (creep.room.controller) {
          // 次にControllerアップグレード
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller)
          }
        } else {
          // Spawnに配達
          const spawn = Game.spawns.Spawn1
          if (spawn && creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn)
          }
        }
      }
    }

    // Tower防衛
    const towers = _.filter(Game.structures, (s) => s.structureType === STRUCTURE_TOWER)
    for (const tower of towers) {
      const roomName = tower.room.name
      const hostiles =
                hostilesCache[roomName] ||
                (hostilesCache[roomName] = tower.room.find(FIND_HOSTILE_CREEPS))
      if (hostiles.length > 0) {
        tower.attack(hostiles[0])
      }
    }

    // 自動Spawn
    const spawn = Game.spawns.Spawn1
    if (spawn && !spawn.spawning && Object.keys(Game.creeps).length < 3) {
      spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {
        memory: { role: 'worker' }
      })
    }
  },

  /**
     * チュートリアルスキップ（可能な場合）
     */
  skipIfPossible: function () {
    if (Game.tutorial && Game.tutorial.skip) {
      Game.tutorial.skip()
      console.log('⏩ Tutorial skipped!')
      return true
    }
    return false
  },

  /**
     * チュートリアル進捗表示
     */
  showProgress: function () {
    if (!this.isTutorial()) {
      return
    }

    console.log('🎮 Tutorial Progress:')
    console.log('  Current Step: ' + Game.tutorial.currentStep)
    console.log('  Creeps: ' + Object.keys(Game.creeps).length)
    console.log(
      '  Energy: ' + (Game.spawns.Spawn1 ? Game.spawns.Spawn1.store[RESOURCE_ENERGY] : 0)
    )
  }
}

module.exports = autoTutorial
