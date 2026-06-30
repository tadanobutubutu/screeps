/**
 * auto.evolution.js - AI進化システムの管理
 * システムの現状を分析し、改善案を生成・記録します。
 */

const logger = require('utils.logging')

const autoEvolution = {
  /**
     * システム分析の実行
     */
  analyze: function () {
    if (!Memory.evolution) {
      Memory.evolution = {
        history: [],
        suggestions: [],
        lastAnalysis: 0
      }
    }

    const now = Game.time
    if (now - Memory.evolution.lastAnalysis < 100) return

    const stats = {
      tick: now,
      gcl: Game.gcl.level,
      rooms: Object.keys(Game.rooms).length,
      creeps: Object.keys(Game.creeps).length,
      cpu: Game.cpu.getUsed(),
      bucket: Game.cpu.bucket
    }

    Memory.evolution.history.push(stats)
    if (Memory.evolution.history.length > 50) {
      Memory.evolution.history.shift()
    }

    this._generateSuggestions(stats)
    Memory.evolution.lastAnalysis = now
  },

  /**
     * 改善案の生成
     */
  _generateSuggestions: function (stats) {
    const suggestions = []

    // CPU制限のチェック
    if (stats.bucket < 5000) {
      suggestions.push({
        type: 'CPU',
        priority: 'HIGH',
        message: 'CPU bucket is low. Consider optimizing role logic.'
      })
    }

    // 拡張性のチェック
    if (stats.creeps < stats.rooms * 5) {
      suggestions.push({
        type: 'EXPANSION',
        priority: 'MEDIUM',
        message: 'Creep count is low relative to room count.'
      })
    }

    if (suggestions.length > 0) {
      Memory.evolution.suggestions.push(...suggestions)
      if (Memory.evolution.suggestions.length > 20) {
        Memory.evolution.suggestions = Memory.evolution.suggestions.slice(-20)
      }
    }
  },

  /**
     * 進化ステータスの表示
     */
  displayStatus: function () {
    const evo = Memory.evolution
    if (!evo) return

    console.log('--- AI Evolution Status ---')
    console.log(`Last Analysis: ${evo.lastAnalysis}`)
    console.log(`Suggestions: ${evo.suggestions.length}`)

    if (evo.suggestions.length > 0) {
      const recentSuggestions = evo.suggestions.slice(-3)
      for (let i = 0; i < recentSuggestions.length; i++) {
        const s = recentSuggestions[i]
        console.log(`[${s.priority}] ${s.type}: ${s.message}`)
      }
    }
  },

  /**
     * リセット
     */
  reset: function () {
    delete Memory.evolution
  }
}

module.exports = autoEvolution
