// Screeps AI - Z世代向けドーパミン爆発システム
// Adaptive Load Management - CPU/メモリに応じて機能を動的に制御

const Sentry = require('@sentry/browser')

Sentry.init({
  dsn: 'https://a2fb8f53973b3a46d63d378d2160bcb0@o4510911569199104.ingest.us.sentry.io/4511117816037376',
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

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted configurations and logic functions
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
 */
function runCreepWithLogging (item, isEmotionsEnabled) {
  logger.tryCatch(runCreepLogic, 'creep_' + item.name, item.creep, item.role, isEmotionsEnabled)
}

function runCreepMinimal (item, isEmotionsEnabled) {
  try {
    runCreepLogic(item.creep, item.role, isEmotionsEnabled)
  } catch (e) {
    Sentry.captureException(e)
    logger.error('Error in creep ' + item.name + ': ' + e.message)
  }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: 部屋ごとのキャッシュ初期化と構造物のスキャンを行う。
 * processCreeps関数の肥大化を防ぐための抽出。
 */
function warmRoomCache (room) {
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

  // 2. 構造物、敵、ソースのスキャン（1ティックに1回）
  const allStructures = room.find(FIND_STRUCTURES)
  room._allStructures = allStructures
  room._allStructuresTick = Game.time

  room._hostileCreeps = room.find(FIND_HOSTILE_CREEPS)
  room._hostileCreepsTick = Game.time
  room._activeSources = room.find(FIND_SOURCES_ACTIVE)
  room._activeSourcesTick = Game.time

  // 3. 構造物の分類（1パスで実行）
  const myStructures = []
  const deliveryTargets = []
  const harvesterDeliveryTargets = []
  const repairTargets = []
  const containers = []
  const fillableContainers = []
  const withdrawalSources = []
  const towers = []
  const spawns = []
  const freeSpawns = []
  let minHitsRepairTarget = null
  let minHits = Infinity

  for (let i = 0; i < allStructures.length; i++) {
    const s = allStructures[i]
    const type = s.structureType

    // ⚡ PERFORMANCE: Skip walls (most numerous) to reduce redundant checks and Proxy lookups.
    // Estimated impact: Reduces structure loop CPU overhead by ~30-50% in fortified rooms.
    if (type === STRUCTURE_WALL) continue

    const hits = s.hits
    const hitsMax = s.hitsMax
    const isDamaged = hits < hitsMax

    // ⚡ PERFORMANCE: if-else if構造を使用して不要なチェックを回避
    if (s.my) {
      myStructures.push(s)

      // 防衛・スポーン・納品先の分類
      if (
        type === STRUCTURE_EXTENSION ||
                type === STRUCTURE_SPAWN ||
                type === STRUCTURE_TOWER ||
                type === STRUCTURE_LAB
      ) {
        if (s.store && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          deliveryTargets.push(s)
          if (type !== STRUCTURE_LAB) harvesterDeliveryTargets.push(s)
        }

        if (type === STRUCTURE_TOWER) {
          towers.push(s)
        } else if (type === STRUCTURE_SPAWN) {
          spawns.push(s)
          if (!s.spawning) freeSpawns.push(s)
        }
      }

      // 味方の構造物の修理
      if (isDamaged) {
        repairTargets.push(s)
        // ⚡ PERFORMANCE: 最もダメージを受けているターゲットを追跡 (O(1) lookup用)
        if (hits < minHits) {
          minHits = hits
          minHitsRepairTarget = s
        }
      }
    } else if (type === STRUCTURE_CONTAINER) {
      containers.push(s)
      const store = s.store
      if (store) {
        if (store.getFreeCapacity(RESOURCE_ENERGY) > 0) fillableContainers.push(s)
        if (store[RESOURCE_ENERGY] > 0) withdrawalSources.push(s)
      }
      if (isDamaged) {
        repairTargets.push(s)
        if (hits < minHits) {
          minHits = hits
          minHitsRepairTarget = s
        }
      }
    } else if (isDamaged) {
      // 道路などの修理 (Walls already skipped via early continue)
      repairTargets.push(s)
      if (hits < minHits) {
        minHits = hits
        minHitsRepairTarget = s
      }
    }
  }

  // ストレージを引出元に追加
  if (room.storage && room.storage.store[RESOURCE_ENERGY] > 1000) {
    withdrawalSources.push(room.storage)
  }

  room._myStructures = myStructures
  room._myStructuresTick = Game.time
  room._deliveryTargets = deliveryTargets
  room._harvesterDeliveryTargets = harvesterDeliveryTargets
  room._repairTargets = repairTargets
  room._minHitsRepairTarget = minHitsRepairTarget
  room._containers = containers
  room._containersTick = Game.time
  room._fillableContainers = fillableContainers
  room._fillableContainersTick = Game.time
  room._withdrawalSources = withdrawalSources
  room._withdrawalSourcesTick = Game.time
  room._towers = towers
  room._towersTick = Game.time
  room._spawns = spawns
  room._spawnsTick = Game.time
  room._freeSpawns = freeSpawns
  room._freeSpawnsTick = Game.time
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: クリープのデータ収集と初期化を行う。
 * processCreeps関数の肥大化を防ぐための抽出。
 */
function collectCreepData (
  creep,
  creepCounts,
  creepsToProcess,
  isLoggingEnabled,
  isEmotionsEnabled
) {
  const memory = creep.memory
  const n = creep.name
  let role = memory.role
  if (!role) {
    role = memory.role = 'harvester'
    if (isLoggingEnabled) logger.warn('Creep ' + n + ' had no role, set to harvester')
  }
  creepCounts[role] = (creepCounts[role] || 0) + 1

  // ロジック実行用に情報を保持
  creepsToProcess.push({ creep, role, name: n })

  const room = creep.room
  if (room) {
    room._myCreeps.push(creep)
    if (room._roleCounts[role] !== undefined) room._roleCounts[role]++
    if (creep.hits < creep.hitsMax) room._injuredCreeps.push(creep)
    if (role === 'defender') room._defenders.push(creep)
  }
}

function processCreeps (rooms, creeps, sites, isLoggingEnabled, isEmotionsEnabled) {
  const creepCounts = Object.create(null)
  const creepsToProcess = []

  // ⚡ PERFORMANCE: 部屋ごとのキャッシュ初期化と構造物のスキャンを一括で行う
  // 引数で渡されたrooms配列を使用。
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i]

    warmRoomCache(room)
  }

  // ⚡ PERFORMANCE: クリープの処理ループとデータ収集を一括で行う
  // 引数で渡されたcreeps配列を使用。
  for (let i = 0; i < creeps.length; i++) {
    const creep = creeps[i]
    collectCreepData(creep, creepCounts, creepsToProcess, isLoggingEnabled, isEmotionsEnabled)
  }

  // 建設サイトの処理 (⚡ PERFORMANCE: 引数で渡されたsites配列を使用)
  for (let i = 0; i < sites.length; i++) {
    const site = sites[i]
    if (site.my && site.room) site.room._myConstructionSites.push(site)
  }

  // ⚡ PERFORMANCE: ホイストされたロジック実行
  // ループ内での条件分岐を避けるため、実行関数を決定する
  const processFn = isLoggingEnabled ? runCreepWithLogging : runCreepMinimal

  for (let i = 0; i < creepsToProcess.length; i++) {
    processFn(creepsToProcess[i], isEmotionsEnabled)
  }
  return creepCounts
}

function handleSpawning (spawn, creepCounts, targetCreeps, isLoggingEnabled) {
  if (spawn.spawning) {
    const spawningCreep = Game.creeps[spawn.spawning.name]
    const role = spawningCreep.memory.role
    spawn.room.visual.text('🛠️' + role, spawn.pos.x + 1, spawn.pos.y, {
      align: 'left',
      opacity: 0.8,
      stroke: '#000000',
      strokeWidth: 0.05
    })

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

  for (const role in targetCreeps) {
    const current = creepCounts[role] || 0
    const target = targetCreeps[role]

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
  console.log(
    '\n⚡ Tick: ' +
            Game.time +
            ', Mode: ' +
            adaptiveSystem.getModeName(adaptiveSystem.evaluate()).toUpperCase()
  )
  console.log('👥 Creeps: ' + (creeps ? creeps.length : Object.keys(Game.creeps).length))
  console.log(
    '💡 CPU: ' +
            Game.cpu.getUsed().toFixed(2) +
            '/' +
            Game.cpu.limit +
            ' (Bucket: ' +
            Game.cpu.bucket +
            ')'
  )
  console.log('💾 Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB')
}

function _displayLogStats () {
  const logStats = logger.getStats()
  if (logStats.errors > 0) {
    logger.warn('Recent errors: ' + logStats.errors)
  }
}

function _displayEmotionStats () {
  const emotionStats = EmotionSystem.getStats()
  console.log(
    '😊 Happy: ' +
              (emotionStats.veryHappy + emotionStats.happy) +
              ', Neutral: ' +
              emotionStats.neutral
  )
}

function _displayGamificationStats () {
  const gm = Memory.gamification
  if (gm) {
    console.log('🎮 Level: ' + gm.level + ', XP: ' + gm.xp + '/' + gm.xpToNext)
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

module.exports.loop = function () {
  try {
    // ⚡ PERFORMANCE: Fetch global collections once per tick at the absolute start
    // to avoid redundant Proxy lookup overhead and provide fresh data for all modules.
    // Proxyオブジェクトへの反復アクセスを避けるため、ループの最初に各コレクションを取得する。
    const rooms = (global._rooms = Object.values(Game.rooms || {}))
    const creeps = (global._creeps = Object.values(Game.creeps || {}))
    const spawns = (global._spawns = Object.values(Game.spawns || {}))
    const constructionSites = (global._constructionSites = Object.values(
      Game.constructionSites || {}
    ))

    // ⚡ PERFORMANCE: Cache the primary spawn immediately for use in TaskQueue and initialization.
    if (spawns.length > 0) {
      global._primarySpawn = spawns[0]
      global._primarySpawnTick = Game.time
    }

    adaptiveSystem.evaluate()

    // ⚡ PERFORMANCE: Throttle memory cleanup to run every 100 ticks.
    // This reduces O(N) memory iteration overhead on every tick.
    if (Game.time % 100 === 0) {
      utilsMemory.cleanMemory()
    }

    if (adaptiveSystem.isEnabled('tutorial') && autoTutorial.isTutorial()) {
      console.log('🤖 AUTO TUTORIAL MODE ACTIVE')
      autoTutorial.run()
      autoTutorial.showProgress()
      return
    }

    TaskQueue.run()

    const isLoggingEnabled = adaptiveSystem.isEnabled('logging')
    const isVisualEffectsEnabled = adaptiveSystem.isEnabled('visualEffects')
    const isAdvancedRolesEnabled = adaptiveSystem.isEnabled('advancedRoles')
    const isEmotionsEnabled = adaptiveSystem.isEnabled('emotions')

    const targetCreeps = isAdvancedRolesEnabled ? TARGET_CREEPS_ADVANCED : TARGET_CREEPS_NORMAL

    const creepCounts = processCreeps(
      rooms,
      creeps,
      constructionSites,
      isLoggingEnabled,
      isEmotionsEnabled
    )

    // ⚡ PERFORMANCE: autoEvolution.run()をprocessCreepsの後に移動し、準備された部屋キャッシュ
    // (_roleCounts, _myCreeps)を再利用可能にする。1000ティックごとに実行。
    if (Game.time % 1000 === 0 && adaptiveSystem.isEnabled('autoEvolution')) {
      autoEvolution.run()
    }

    // ⚡ PERFORMANCE: pre-fetchedなspawns配列を使用して反復処理を最適化
    for (let i = 0; i < spawns.length; i++) {
      const spawn = spawns[i]
      handleSpawning(spawn, creepCounts, targetCreeps, isLoggingEnabled)
    }

    if (adaptiveSystem.isEnabled('socialInteractions') && Game.time % 100 === 0) {
      // ⚡ PERFORMANCE: Replace O(N²) global loop with O(N) room-based spatial search.
      // Using findInRange(1) leverages the engine's internal spatial indexing.
      const processedPairs = new Set()
      for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i]
        const creepsInRoom = room._myCreeps || room.find(FIND_MY_CREEPS)

        for (const creep of creepsInRoom) {
          const neighbors = creep.pos.findInRange(FIND_MY_CREEPS, 1)
          for (const neighbor of neighbors) {
            if (creep.id === neighbor.id) continue

            // Create a unique key for the pair to ensure we only check it once.
            const pairKey =
                            creep.id < neighbor.id
                              ? `${creep.id}:${neighbor.id}`
                              : `${neighbor.id}:${creep.id}`

            if (!processedPairs.has(pairKey)) {
              processedPairs.add(pairKey)
              if (Math.random() > 0.7) {
                EmotionSystem.interact(creep, neighbor)
              }
            }
          }
        }
      }
    }

    handleDefenseAndDashboard(rooms, isLoggingEnabled, isVisualEffectsEnabled)

    if (Game.time % 100 === 0) {
      displayStats(creeps)
    }
  } catch (e) {
    Sentry.captureException(e)
    // Security: Use logging system for consistent escaping, path sanitization, and error tracking.
    const safeStack = logger.getSafeStack(e.stack)
    logger.error('CRITICAL ERROR: ' + e.message + (safeStack ? '\n' + safeStack : ''))
  }
}

function getBodyForRole (role, energy) {
  const bodyConfig = BODY_CONFIGS[role] || [[MOVE, WORK, CARRY], 200]
  const cost = bodyConfig[1]
  const parts = bodyConfig[0]

  if (energy >= cost) {
    return parts
  }

  return [MOVE, WORK, CARRY]
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
  console.log('\n✨ === Quick Commands === ✨')
  console.log('\n⚡ Adaptive System:')
  console.log('  adaptive() - system dashboard')
  console.log('  mode(0-3)  - force mode (0=EMERGENCY, 1=MINIMAL, 2=NORMAL, 3=FULL)')
  console.log('\n😊 Emotions:')
  console.log('  e()        - emotion stats')
  console.log('  ec(name)   - check creep')
  console.log('\n💾 Memory:')
  console.log('  m()        - memory stats')
  console.log('  mh()       - history')
  console.log('  ml()       - leaderboard')
  console.log('  mc()       - cleanup')
  console.log('\n🎮 Gamification:')
  console.log('  g()        - dashboard')
  console.log('\n🤖 Auto Evolution:')
  console.log('  evo()      - dashboard')
}

if (!Memory.helpShown) {
  Memory.helpShown = true
  global.help()
}
