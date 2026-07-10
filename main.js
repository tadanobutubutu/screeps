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

const TARGET_CREEPS_EXPENSIVE = {
    healer: 1,
    medic: 1,
    explorer: 1,
    transporter: 1,
};