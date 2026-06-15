/* global STRUCTURE_RAMPART */
// Screeps AI - Z世代向けドーパミン爆発システム
// Adaptive Load Management - CPU/メモリに応じて機能を動的に制御

const Sentry = require('@sentry/browser')

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Security: Prevent unintentional exposure of PII (IP, user IDs, etc.)
  sendDefaultPii: false,
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})

const posthog = require('posthog-js')

posthog.init(process.env.POSTHOG_API_KEY, {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-01-30'
})

Sentry.getCurrentScope().setTag('posthog_session_id', posthog.get_session_id())

const roleHarvester = require('role.harvester')
const roleHealer = require('role.healer')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')
const roleRepairer = require('role.repairer')
const roleExplorer = require('role.explorer')
const roleMedic = require('role.medic')
const roleTransporter = require('role.transporter')
const roleScout = require('role.scout')
const defenseManager = require('defense.manager')
const utilsMemory = require('utils.memory')
const logger = require('utils.logging')
const EmotionSystem = require('utils.emotions')
const memVis = require('memory.visualizer')
const autoTutorial = require('tutorial.auto')
const gamification = require('gamification')
const vfx = require('visual.effects')
const autoEvolution = require('auto.evolution')
const adaptiveSystem = require('system.adaptive')
const dashboard = require('utils.dashboard')
const TaskQueue = require('utils.tasks')

// ⚡ パフォーマンス最適化: ティックごとのオブジェクト割り当てを減らすため、定数スタイルをホイストした。
const STYLE_SPAWN_TEXT = {
  align: 'left',
  opacity: 0.8,
  stroke: '#000000',
  strokeWidth: 0.05
}

// ⚡ パフォーマンス最適化: ホイストされた設定とロジック関数
// Moving these outside the loop prevents redundant object allocation and function re-definition every tick.
const TARGET_CREEPS_NORMAL = {
  harvester: 2,
  upgrader: 1,
  builder: 1,
  repairer: 1
}

const TARGET_CREEPS_ADVANCED = {
  harvester: 2,
  upgrader: 2,
  builder: 2,
  repairer: 1,
  transporter: 1,
  scout: 1,
  medic: 1,
  explorer: 1
}

// ⚡ パフォーマンス最適化: ティックごとの割り当てを避けるため、Object.entriesを事前計算する
const TARGET_CREEPS_NORMAL_ENTRIES = Object.entries(TARGET_CREEPS_NORMAL)
const TARGET_CREEPS_ADVANCED_ENTRIES = Object.entries(TARGET_CREEPS_ADVANCED)

const BODY_CONFIGS = {
  harvester: [[WORK, WORK, CARRY, MOVE], 300],
  upgrader: [[WORK, WORK, CARRY, MOVE], 300],
  builder: [[WORK, CARRY, CARRY, MOVE], 300],
  repairer: [[WORK, CARRY, MOVE], 200],
  transporter: [[CARRY, CARRY, MOVE, MOVE], 200],
  scout: [[MOVE], 50],
  medic: [[HEAL, MOVE], 300],
  explorer: [[MOVE], 50]
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted creep logic function.
 */
function runCreepLogic (creep, role, isEmotionsEnabled) {
  // 😊 Emotions (NORMAL以上)
  if (isEmotionsEnabled) {
    EmotionSystem.display(creep)
  }

  // Run role logic
  switch (role) {
    case 'harvester':
      roleHarvester.run(creep)
      break
    case 'upgrader':
      roleUpgrader.run(creep)
      break
    case 'builder':
      roleBuilder.run(creep)
      break
    case 'repairer':
      roleRepairer.run(creep)
      break
    case 'explorer':
      if (adaptiveSystem.isEnabled('advancedRoles')) {
        roleExplorer.run(creep)
      }
      break
    case 'medic':
      if (adaptiveSystem.isEnabled('advancedRoles')) {
        roleMedic.run(creep)
      }
      break
    case 'transporter':
      if (adaptiveSystem.isEnabled('advancedRoles')) {
        roleTransporter.run(creep)
      }
      break
    case 'scout':
      if (adaptiveSystem.isEnabled('advancedRoles')) {
        roleScout.run(creep)
      }
      break
    default:
      if (adaptiveSystem.isEnabled('logging')) {
        logger.warn('Unknown role: ' + role)
      }
      creep.memory.role = 'harvester'
  }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted defense logic function.
 */
function runDefenseLogic (room) {
  defenseManager.run(room)
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: ホイストされたクリープ実行関数。クロージャの生成を削減。
 * 直接引数を受け取ることで中間オブジェクトの割り当てを回避。
 */
function runCreepWithLogging (creep, role, name, isEmotionsEnabled) {
  logger.tryCatch(runCreepLogic, 'creep_' + name, creep, role, isEmotionsEnabled)
}

function runCreepMinimal (creep, role, name, isEmotionsEnabled) {
  try {
    runCreepLogic(creep, role, isEmotionsEnabled)
  } catch (e) {
    Sentry.captureException(e)
    logger.error('Error in creep ' + name + ': ' + e.message)
  }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: 部屋ごとのキャッシュ初期化と構造物のスキャンを行う。
 * processCreeps関数の肥大化を防ぐための抽出。
 */
function initializeRoomBasicCache (room) {
  // 1. キャッシュ用配列の初期化
  room._myCreeps = []
  room._myCreepsTick = Game.time
  room._roleCounts = {
    harvester: 0,
    upgrader: 0,
    builder: 0,
    repairer: 0,
    transporter: 0,
    scout: 0,
    medic: 0,
    explorer: 0
  }
  room._injuredCreeps = []
  room._injuredCreepsTick = Game.time
  room._myConstructionSites = []
  room._myConstructionSitesTick = Game.time
  room._defenders = []
  room._defendersTick = Game.time
  room._criticalCreep = null
  room._criticalStructure = null

  // 2. 構造物、敵、ソースのスキャン（1ティックに1回）
  const allStructures = room.find(FIND_STRUCTURES)
  room._allStructures = allStructures
  room._allStructuresTick = Game.time

  const allCreeps = room.find(FIND_CREEPS)
  room._allCreeps = allCreeps
  room._allCreepsTick = Game.time
  room._hostileCreeps = allCreeps.filter((c) => !c.my)
  room._hostileCreepsTick = Game.time
  room._activeSources = room.find(FIND_SOURCES_ACTIVE)
  room._activeSourcesTick = Game.time

  return allStructures
}

function _categorizeMyStructure (s, type, state) {
  state.myStructures.push(s)

  // ⚡ PERFORMANCE: Index owned structures by type for O(1) lookup.
  if (!state.myStructuresByType[type]) {
    state.myStructuresByType[type] = []
  }
  state.myStructuresByType[type].push(s)

  if (
    type === STRUCTURE_EXTENSION ||
        type === STRUCTURE_SPAWN ||
        type === STRUCTURE_TOWER ||
        type === STRUCTURE_LAB
  ) {
    // ⚡ PERFORMANCE: Hoist store to reduce Proxy property lookups.
    const store = s.store
    if (store && store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      state.deliveryTargets.push(s)
      if (type !== STRUCTURE_LAB) {
        state.harvesterDeliveryTargets.push(s)
      }
    }

    if (type === STRUCTURE_TOWER) {
      state.towers.push(s)
    } else if (type === STRUCTURE_SPAWN) {
      state.spawns.push(s)
      if (!s.spawning) {
        state.freeSpawns.push(s)
      }
    }
  }
}

function _categorizeContainer (s, state) {
  state.containers.push(s)
  const store = s.store
  if (store) {
    if (store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      state.fillableContainers.push(s)
    }
    if (store[RESOURCE_ENERGY] > 0) {
      state.withdrawalSources.push(s)
    }
  }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Refactored to use positional arguments instead of object destructuring.
 * Passing a single object literal `{ s, type, hits, hitsMax, room, state }` in a high-frequency loop
 * (once per damaged structure) triggers per-tick object allocation and increased GC pressure.
 * Switching to positional arguments eliminates these allocations.
 * Expected Impact: ~10-20% reduction in loop overhead in rooms with many damaged structures.
 */
function _categorizeRepairTarget (s, type, hits, hitsMax, room, state) {
  state.repairTargets.push(s)
  // ⚡ PERFORMANCE: Track target with min hits for O(1) lookup.
  if (hits < state.minHits) {
    state.minHits = hits
    state.minHitsRepairTarget = s
  }

  // ⚡ PERFORMANCE: Hoist critical structure detection (hits < 30%, excluding ramparts)
  // This matches defense.manager.js priority and avoids redundant per-tower searches.
  if (!room._criticalStructure && hits < hitsMax * 0.3 && type !== STRUCTURE_RAMPART) {
    room._criticalStructure = s
  }
}

function categorizeRoomStructures (room, allStructures) {
  // 3. 構造物の分類（1パスで実行）
  const state = {
    myStructures: [],
    myStructuresByType: Object.create(null),
    deliveryTargets: [],
    harvesterDeliveryTargets: [],
    repairTargets: [],
    containers: [],
    fillableContainers: [],
    withdrawalSources: [],
    towers: [],
    spawns: [],
    freeSpawns: [],
    minHitsRepairTarget: null,
    minHits: Infinity
  }

  for (let i = 0; i < allStructures.length; i++) {
    const s = allStructures[i]
    const type = s.structureType

    // ⚡ PERFORMANCE: Skip walls and roads (most numerous) early to reduce redundant checks and Proxy lookups.
    // Wall is most numerous in fortified rooms, Road is most numerous in developed rooms.
    // s.my incurs a cross-boundary Proxy lookup, so we check non-owned types first.
    if (type === STRUCTURE_WALL) {
      continue
    }

    const isRoad = type === STRUCTURE_ROAD

    // ⚡ PERFORMANCE: Hoist hits and hitsMax to minimize Proxy lookups.
    const hits = s.hits
    const hitsMax = s.hitsMax
    const isDamaged = hits < hitsMax

    // ⚡ PERFORMANCE: if-else if構造を使用して不要なチェックを回避。
    // 一般的な非所有構造物（Road, Container）を先にチェックし、高コストな s.my Proxy ルックアップを回避。
    if (isRoad) {
      // Roadは所有物ではないため、個別の分類は不要（修理チェックのみ後に実行）
    } else if (type === STRUCTURE_CONTAINER) {
      _categorizeContainer(s, state)
    } else if (s.my) {
      _categorizeMyStructure(s, type, state)
    }

    // ⚡ PERFORMANCE: Consolidate repair logic to avoid redundant checks across branches.
    if (isDamaged) {
      _categorizeRepairTarget(s, type, hits, hitsMax, room, state)
    }
  }

  // ストレージを引出元に追加
  if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1000) {
    state.withdrawalSources.push(room.storage)
  }

  room._myStructures = state.myStructures
  room._myStructuresByType = state.myStructuresByType
  room._myStructuresTick = Game.time
  room._deliveryTargets = state.deliveryTargets
  room._harvesterDeliveryTargets = state.harvesterDeliveryTargets
  room._repairTargets = state.repairTargets
  room._minHitsRepairTarget = state.minHitsRepairTarget
  room._containers = state.containers
  room._containersTick = Game.time
  room._fillableContainers = state.fillableContainers
  room._fillableContainersTick = Game.time
  room._withdrawalSources = state.withdrawalSources
  room._withdrawalSourcesTick = Game.time
  room._towers = state.towers
  room._towersTick = Game.time
  room._spawns = state.spawns
  room._spawnsTick = Game.time
  room._freeSpawns = state.freeSpawns
  room._freeSpawnsTick = Game.time
}

function warmRoomCache (room) {
  const allStructures = initializeRoomBasicCache(room)
  categorizeRoomStructures(room, allStructures)
}

function categorizeConstructionSites (sites) {
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    if (site.my && site.room) {
      site.room._myConstructionSites.push(site)
    }
  }
}

function collectCreepData (creeps, creepCounts, isLoggingEnabled) {
  for (let i = 0; i < creeps.length; i++) {
    const creep = creeps[i]
    const memory = creep.memory
    let role = memory.role

    if (role === undefined || role === null) {
      role = memory.role = 'harvester'
      if (isLoggingEnabled) {
        logger.warn('Creep ' + creep.name + ' had no role, set to harvester')
      }
    }
    creep._role = role
    creepCounts[role] = (creepCounts[role] || 0) + 1

    const room = creep.room
    if (room) {
      room._myCreeps.push(creep)
      if (room._roleCounts[role] !== undefined) {
        room._roleCounts[role]++
      }
      if (creep.hits < creep.hitsMax) {
        room._injuredCreeps.push(creep)
        if (!room._criticalCreep && creep.hits < creep.hitsMax * 0.5) {
          room._criticalCreep = creep
        }
      }
      if (role === 'defender') {
        room._defenders.push(creep)
      }
    }
  }
}

function executeCreepLogic (creeps, isLoggingEnabled, isEmotionsEnabled) {
  const processFn = isLoggingEnabled ? runCreepWithLogging : runCreepMinimal
  for (let i = 0; i < creeps.length; i++) {
    const creep = creeps[i]
    processFn(creep, creep._role, creep.name, isEmotionsEnabled)
  }
}

function processCreeps (rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
  const creepCounts = Object.create(null)

  for (let i = 0; i < rooms.length; i++) {
    warmRoomCache(rooms[i])
  }

  categorizeConstructionSites(sites)
  collectCreepData(creeps, creepCounts, isLoggingEnabled)
  executeCreepLogic(creeps, isLoggingEnabled, isEmotionsEnabled)

  return creepCounts
}

function handleSpawning (spawn, creepCounts, targetCreepEntries, isLoggingEnabled) {
  if (spawn.spawning) {
    const spawningCreep = Game.creeps[spawn.spawning.name]
    const role = spawningCreep.memory.role
    spawn.room.visual.text('🛠️' + role, spawn.pos.x + 1, spawn.pos.y, STYLE_SPAWN_TEXT)

    const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects')
    if (isVisualEffectsEnabled) {
      const progress =
                (spawn.spawning.needTime - spawn.spawning.remainingTime) / spawn.spawning.needTime
      vfx.progressBar(
        { x: spawn.pos.x, y: spawn.pos.y + 1, roomName: spawn.room.name },
        progress,
        1,
        'SPAWNING'
      )
    }

    if (isVisualEffectsEnabled && Game.time % 5 === 0) {
      vfx.stars(spawn.pos, 5)
    }

    return
  }

  // ⚡ PERFORMANCE: Hoist energyAvailable to avoid redundant Proxy lookups in the role loop.
  const energyAvailable = spawn.room.energyAvailable

  for (let i = 0; i < targetCreepEntries.length; i++) {
    const entry = targetCreepEntries[i]
    const role = entry[0]
    const target = entry[1]
    const current = creepCounts[role] || 0

    if (current < target) {
      const newName = role + '_' + Game.time
      const body = getBodyForRole(role, energyAvailable)

      if (body.length > 0) {
        const result = spawn.spawnCreep(body, newName, { memory: { role } })

        if (result === OK) {
          if (isLoggingEnabled) {
            logger.info('Spawning new ' + role + ': ' + newName)
          }
          creepCounts[role] = current + 1

          const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects')
          if (isVisualEffectsEnabled) {
            vfx.successExplosion(spawn.pos)
          }
          if (adaptiveSystem.isEnabled('gamification')) {
            gamification.addXP(20, 'Spawned ' + role)
          }

          break
        } else if (result !== ERR_NOT_ENOUGH_ENERGY) {
          if (isLoggingEnabled) {
            logger.warn('Failed to spawn ' + role + ': ' + result)
          }
        }
      }
      break
    }
  }
}

function handleDefenseAndDashboard (rooms, isLoggingEnabled, isVisualEffectsEnabled) {
  if (adaptiveSystem.isEnabled('defense')) {
    // ⚡ PERFORMANCE: 引数で渡されたrooms配列を使用。
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i]
      if (room.controller && room.controller.my) {
        if (isVisualEffectsEnabled) {
          dashboard.displayVisuals(room)
        }

        const roomName = room.name
        if (isLoggingEnabled) {
          logger.tryCatch(runDefenseLogic, 'defense_' + roomName, room)
        } else {
          try {
            runDefenseLogic(room)
          } catch (e) {
            Sentry.captureException(e)
            // Security: Use logging system for consistent escaping and error tracking.
            logger.error('Error in defense ' + roomName + ': ' + e.message)
          }
        }
      }
    }
  }
}

function _displayCoreStats (creeps) {
  logger.info('--- TICK: ' + Game.time + ' ---')
  logger.info('CREEPS: ' + creeps.length)
  logger.info(
    'CPU: ' +
            Game.cpu.getUsed().toFixed(2) +
            '/' +
            Game.cpu.limit +
            ' (Bucket: ' +
            Game.cpu.bucket +
            ')'
  )
  logger.info('MEM: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB')
}

function _displayLogStats () {
  const logStats = logger.getStats()
  if (logStats.errors > 0) {
    logger.warn('Recent errors: ' + logStats.errors)
  }
}

function _displayEmotionStats () {
  const emotionStats = EmotionSystem.getStats()
  logger.info('EMOTIONS: Happy: ' + emotionStats.happy + ', Neutral: ' + emotionStats.neutral)
}

function _displayGamificationStats () {
  const gm = Memory.gamification
  if (gm) {
    logger.info('GAMIFICATION: Level ' + (gm.level || 1) + ' XP: ' + (gm.xp || 0))
  }
}

function displayStats (creeps) {
  _displayCoreStats(creeps)

  if (adaptiveSystem.isEnabled('logging')) {
    _displayLogStats()
  }

  if (adaptiveSystem.isEnabled('emotions')) {
    _displayEmotionStats()
  }

  if (adaptiveSystem.isEnabled('gamification')) {
    _displayGamificationStats()
  }
}

// ==============================================
// 📋 TASK QUEUE REGISTRATION
// ==============================================
TaskQueue.registerTask(
  'emergencyCleanup',
  100,
  () => adaptiveSystem.emergencyCleanup(),
  () => adaptiveSystem.evaluate() === adaptiveSystem.MODE.EMERGENCY
)

TaskQueue.registerTask(
  'loggerInit',
  1,
  () => logger.init(),
  () => adaptiveSystem.isEnabled('logging')
)

TaskQueue.registerTask(
  'gamificationInit',
  1,
  () => {
    gamification.init()
    gamification.updateStreak()
  },
  () => adaptiveSystem.isEnabled('gamification')
)

TaskQueue.registerTask(
  'memVisSnapshot',
  20,
  () => memVis.recordSnapshot(),
  () => adaptiveSystem.isEnabled('memoryVisualizer')
)

TaskQueue.registerTask(
  'memVisCleanup',
  200,
  () => {
    memVis.cleanup()
    utilsMemory.cleanCache()
  },
  () => adaptiveSystem.isEnabled('memoryVisualizer')
)

TaskQueue.registerTask(
  'memVisBackup',
  2000,
  () => memVis.backup(),
  () => adaptiveSystem.isEnabled('memoryVisualizer')
)

TaskQueue.registerTask(
  'gamificationMilestones',
  100,
  () => gamification.checkMilestones(),
  () => adaptiveSystem.isEnabled('gamification')
)

TaskQueue.registerTask(
  'gamificationDashboard',
  1,
  () => gamification.renderDashboard(),
  () => adaptiveSystem.isEnabled('gamification')
)

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Social interaction logic extracted to reduce main loop complexity.
 */
function handleSocialInteractions (rooms) {
  if (!adaptiveSystem.isEnabled('socialInteractions') || Game.time % 100 !== 0) {
    return
  }

  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i]
    const creepsInRoom = room._myCreeps || room.find(FIND_MY_CREEPS)

    for (let j = 0; j < creepsInRoom.length; j++) {
      const creep = creepsInRoom[j]
      for (let k = j + 1; k < creepsInRoom.length; k++) {
        const neighbor = creepsInRoom[k]
        if (
          Math.max(
            Math.abs(creep.pos.x - neighbor.pos.x),
            Math.abs(creep.pos.y - neighbor.pos.y)
          ) <= 1
        ) {
          if (Math.random() > 0.7) {
            EmotionSystem.interact(creep, neighbor)
          }
        }
      }
    }
  }
}

function handleMemoryCleanup () {
  if (!Memory.lastCleanup || Game.time - Memory.lastCleanup > 1500) {
    for (const name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name]
      }
    }
    Memory.lastCleanup = Game.time
  }
}

function adjustSpawnPriority () {
  if (!Memory.spawnPriority) {
    Memory.spawnPriority = ['harvester', 'upgrader', 'builder', 'repairer']
  }
  if (Game.time % 500 === 0) {
    const counts = {}
    for (const name in Game.creeps) {
      const c = Game.creeps[name]
      counts[c.memory.role] = (counts[c.memory.role] || 0) + 1
    }
    Memory.spawnPriority.sort((a, b) => (counts[a] || 0) - (counts[b] || 0))
  }
}

function cleanupPathCache () {
  if (!Memory.pathCache) Memory.pathCache = {}
  if (Game.time % 1000 === 0) {
    const oldPaths = Object.keys(Memory.pathCache).filter(
      (key) => Memory.pathCache[key].tick < Game.time - 1000
    )
    oldPaths.forEach((key) => delete Memory.pathCache[key])
  }
}

function runMainTick () {
  const rooms = (global._rooms = Object.values(Game.rooms || {}))
  const creeps = (global._creeps = Object.values(Game.creeps || {}))
  const spawns = (global._spawns = Object.values(Game.spawns || {}))
  const constructionSites = (global._constructionSites = Object.values(
    Game.constructionSites || {}
  ))

  if (spawns.length > 0) {
    global._primarySpawn = spawns[0]
    global._primarySpawnTick = Game.time
  }

  adaptiveSystem.evaluate()

  if (Game.time % 100 === 0) {
    utilsMemory.cleanMemory()
  }

  if (adaptiveSystem.isEnabled('tutorial') && autoTutorial.isTutorial()) {
    autoTutorial.run()
    autoTutorial.showProgress()
    return
  }

  TaskQueue.run()

  const isLoggingEnabled = adaptiveSystem.isEnabled('logging')
  const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects')
  const isAdvancedRolesEnabled = adaptiveSystem.isEnabled('advancedRoles')
  const isEmotionsEnabled = adaptiveSystem.isEnabled('emotions')

  const targetCreepEntries = isAdvancedRolesEnabled
    ? TARGET_CREEPS_ADVANCED_ENTRIES
    : TARGET_CREEPS_NORMAL_ENTRIES

  const creepCounts = processCreeps(
    rooms,
    creeps,
    constructionSites,
    isLoggingEnabled,
    isEmotionsEnabled
  )

  if (Game.time % 1000 === 0 && adaptiveSystem.isEnabled('autoEvolution')) {
    autoEvolution.run()
  }

  for (let i = 0; i < spawns.length; i++) {
    handleSpawning(spawns[i], creepCounts, targetCreepEntries, isLoggingEnabled)
  }

  handleSocialInteractions(rooms)
  handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled)

  if (Game.time % 100 === 0) {
    displayStats(creeps)
  }
}

module.exports.loop = function () {
  handleMemoryCleanup()
  adjustSpawnPriority()
  cleanupPathCache()

  try {
    runMainTick()
  } catch (e) {
    Sentry.captureException(e)
    const safeStack = logger.getSafeStack(e.stack)
    logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\n' + safeStack : ''))
  }
}

// ⚡ PERFORMANCE: Hoisted default body configuration to avoid per-call array allocation.
const DEFAULT_BODY_CONFIG = [[MOVE, WORK, CARRY], 200]
const DEFAULT_BODY_PARTS = [MOVE, WORK, CARRY]

function getBodyForRole (role, energy) {
  const bodyConfig = BODY_CONFIGS[role] || DEFAULT_BODY_CONFIG

  if (energy >= bodyConfig[1]) {
    return bodyConfig[0]
  }

  return DEFAULT_BODY_PARTS
}

// ==============================================
// ⌨️ CONSOLE COMMANDS
// ==============================================

// ⚡ Adaptive System
global.adaptive = adaptiveSystem.showDashboard.bind(adaptiveSystem)
global.mode = adaptiveSystem.setMode.bind(adaptiveSystem)

// 😊 Emotion commands
global.e = EmotionSystem.getStats.bind(EmotionSystem)
global.ec = EmotionSystem.checkCreep.bind(EmotionSystem)

// 💾 Memory commands
global.m = memVis.showStats.bind(memVis)
global.mh = memVis.showHistory.bind(memVis)
global.ml = memVis.showLeaderboard.bind(memVis)
global.md = memVis.readDiary.bind(memVis)
global.mm = memVis.showMap.bind(memVis)
global.mc = memVis.cleanup.bind(memVis)
global.mb = memVis.backup.bind(memVis)
global.mr = memVis.restore.bind(memVis)

// 🎮 Tutorial commands
global.t = autoTutorial.showProgress.bind(autoTutorial)
global.ts = autoTutorial.skipIfPossible.bind(autoTutorial)

// ✨ Gamification commands
global.g = gamification.showDashboard.bind(gamification)
global.gr = gamification.reset.bind(gamification)

// 🤖 Auto Evolution commands
global.evo = autoEvolution.showDashboard.bind(autoEvolution)
global.evor = autoEvolution.reset.bind(autoEvolution)

// Helper function
global.help = function () {
  console.log('adaptive() - system dashboard')
  console.log('mode(n) - force mode (0=EMERGENCY, 1=MINIMAL, 2=NORMAL, 3=FULL)')
  console.log('e() - emotion stats')
  console.log('ec(name) - check creep')
  console.log('m() - memory stats')
  console.log('mh() - history')
  console.log('ml() - leaderboard')
  console.log('mc() - cleanup')
  console.log('g() - gamification dashboard')
  console.log('evo() - auto evolution dashboard')
}

if (!Memory.helpShown) {
  Memory.helpShown = true
  global.help()
}
