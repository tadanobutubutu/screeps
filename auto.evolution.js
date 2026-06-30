/**
 * auto.evolution.js - AI進化システムの管理
 * システムの現状を分析し、改善案を生成・記録します。
 */

const logger = require('utils.logging')

const MAX_HISTORY = 50
const MAX_QUEUE = 10

const autoEvolution = {
  /**
     * 初期化
     */
  init: function () {
    if (!Memory.evolution) {
      Memory.evolution = {
        history: [],
        queue: [],
        lastTick: Game.time,
        version: '1.0.0'
      }
    }
  },

  /**
     * 実行
     */
  run: function () {
    this.init()
    const state = this.analyzeBasicState()
    this._recordHistory(state)

    const needs = this.needsEvolution(state)
    for (const need of needs) {
      this.addToQueue(need)
    }
  },

  /**
     * 基本状態の分析
     */
  analyzeBasicState: function () {
    const rooms = Object.values(Game.rooms)
    const rcl = rooms.reduce(
      (max, r) => Math.max(max, (r.controller && r.controller.level) || 0),
      0
    )
    const structures = {
      towers: rooms.reduce(
        (count, r) =>
          count +
                    r.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } })
                      .length,
        0
      )
    }

    return {
      tick: Game.time,
      rcl,
      roomCount: rooms.length,
      structures,
      cpu: Game.cpu.getUsed()
    }
  },

  /**
     * 進化の必要性を判断
     */
  needsEvolution: function (state) {
    const needs = []
    if (state.rcl >= 3 && state.structures.towers === 0) {
      needs.push({
        type: 'logic',
        action: 'create_tower_logic',
        priority: 10
      })
    }
    return needs
  },

  /**
     * キューに追加
     */
  addToQueue: function (need) {
    if (!Memory.evolution.queue) Memory.evolution.queue = []
    if (Memory.evolution.queue.length >= MAX_QUEUE) return

    const exists = Memory.evolution.queue.some((n) => n.action === need.action)
    if (!exists) {
      Memory.evolution.queue.push(need)
      Memory.evolution.queue.sort((a, b) => b.priority - a.priority)
    }
  },

  /**
     * 履歴の記録
     */
  _recordHistory: function (state) {
    Memory.evolution.history.push(state)
    if (Memory.evolution.history.length > MAX_HISTORY) {
      Memory.evolution.history.shift()
    }
  },

  /**
     * ファイル名の取得
     */
  getFilename: function (action) {
    if (action === 'create_tower_logic') return 'structure.tower.js'
    return 'evolution.code.js'
  },

  /**
     * RCL機能の生成
     */
  generateRCLFeatures: function (params) {
    return `// Generated RCL Features for RCL ${params.newRCL}\n// Includes: Tower, Storage, Terminal Logic`
  },

  /**
     * タワーロジックの生成
     */
  generateTowerLogic: function () {
    return 'module.exports = { run: function(tower) { /* Tower logic */ } };'
  },

  /**
     * リソースの軽量分析
     */
  analyzeResourcesLight: function (rooms) {
    let energy = 0
    let capacity = 0
    for (const r of rooms) {
      energy += r.energyAvailable || 0
      capacity += r.energyCapacityAvailable || 0
    }
    return { energy, capacity }
  },

  /**
     * リセット
     */
  reset: function () {
    delete Memory.evolution
  }
}

module.exports = autoEvolution
