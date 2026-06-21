/* global STRUCTURE_RAMPART */
// Screeps AI - Z世代向けドーパミン爆発システム
// Adaptive Load Management - CPU/メモリに応じて機能を動的に制御

const Sentry = require('@sentry/browser');

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // Security: Prevent unintentional exposure of PII (IP, user IDs, etc.)
    sendDefaultPii: false,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
});

const posthog = require('posthog-js');

posthog.init(process.env.POSTHOG_API_KEY, {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-01-30',
});

Sentry.getCurrentScope().setTag('posthog_session_id', posthog.get_session_id());

const roleHarvester = require('role.harvester');
const roleHealer = require('role.healer');
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
const adaptiveSystem = require('system.adaptive');
const dashboard = require('utils.dashboard');
const TaskQueue = require('utils.tasks');

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted constant styles to reduce per-tick object allocation.
const STYLE_SPAWN_TEXT = {
    align: 'left',
    opacity: 0.8,
    stroke: '#000000',
    strokeWidth: 0.05,
};

// ⚡ PERFORMANCE OPTIMIZATION: Hoisted configurations and logic functions
// Moving these outside the loop prevents redundant object allocation and function re-definition every tick.
const TARGET_CREEPS_NORMAL = {
    harvester: 2,
    upgrader: 1,
    builder: 1,
    repairer: 1,
};

const TARGET_CREEPS_ADVANCED = {
    harvester: 2,
    upgrader: 2,
    builder: 2,
    repairer: 1,
    transporter: 1,
    scout: 1,
    medic: 1,
    explorer: 1,
};

const BODY_CONFIGS = {
    harvester: [[WORK, WORK, CARRY, MOVE], 300],
    upgrader: [[WORK, WORK, CARRY, MOVE], 300],
    builder: [[WORK, CARRY, CARRY, MOVE], 300],
    repairer: [[WORK, CARRY, MOVE], 200],
    transporter: [[CARRY, CARRY, MOVE, MOVE], 200],
    scout: [[MOVE], 50],
    medic: [[HEAL, MOVE], 300],
    explorer: [[MOVE], 50],
};

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted creep logic function.
 */
function runCreepLogic(creep, role, isEmotionsEnabled) {
    // 😊 Emotions (NORMAL以上)
    if (isEmotionsEnabled) {
        EmotionSystem.display(creep);
    }

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
            if (adaptiveSystem.isEnabled('advancedRoles')) {
                roleExplorer.run(creep);
            }
            break;
        case 'medic':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
                roleMedic.run(creep);
            }
            break;
        case 'transporter':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
                roleTransporter.run(creep);
            }
            break;
        case 'scout':
            if (adaptiveSystem.isEnabled('advancedRoles')) {
                roleScout.run(creep);
            }
            break;
        default:
            if (adaptiveSystem.isEnabled('logging')) {
                logger.warn('Unknown role: ' + role);
            }
            creep.memory.role = 'harvester';
    }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted defense logic function.
 */
function runDefenseLogic(room) {
    defenseManager.run(room);
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: ホイストされたクリープ実行関数。クロージャの生成を削減。
 * 直接引数を受け取ることで中間オブジェクトの割り当てを回避。
 */
function runCreepWithLogging(creep, role, name, isEmotionsEnabled) {
    logger.tryCatch(runCreepLogic, 'creep_' + name, creep, role, isEmotionsEnabled);
}

function runCreepMinimal(creep, role, name, isEmotionsEnabled) {
    try {
        runCreepLogic(creep, role, isEmotionsEnabled);
    } catch (e) {
        Sentry.captureException(e);
        logger.error('Error in creep ' + name + ': ' + e.message);
    }
}

/**
 * ⚡ PERFORMANCE OPTIMIZATION: 部屋ごとのキャッシュ初期化と構造物のスキャンを行う。
 * processCreeps関数の肥大化を防ぐための抽出。
 */
function initializeRoomBasicCache(room) {
    // 1. キャッシュ用配列の初期化
    room._myCreeps = [];
    room._myCreepsTick = Game.time;
    room._roleCounts = {
        harvester: 0,
        upgrader: 0,
        builder: 0,
        repairer: 0,
        transporter: 0,
        scout: 0,
        medic: 0,
        explorer: 0,
    };
    room._injuredCreeps = [];
    room._injuredCreepsTick = Game.time;
    room._myConstructionSites = [];
    room._myConstructionSitesTick = Game.time;
    room._defenders = [];
    room._defendersTick = Game.time;
    room._criticalCreep = null;
    room._criticalStructure = null;

    // 2. 構造物、敵、ソースのスキャン（1ティックに1回）
    const allStructures = room.find(FIND_STRUCTURES);
    room._allStructures = allStructures;
    room._allStructuresTick = Game.time;

    const allCreeps = room.find(FIND_CREEPS);
    room._allCreeps = allCreeps;
    room._allCreepsTick = Game.time;
    room._hostileCreeps = allCreeps.filter((c) => !c.my);
    room._hostileCreepsTick = Game.time;
    room._activeSources = room.find(FIND_SOURCES_ACTIVE);
    room._activeSourcesTick = Game.time;
