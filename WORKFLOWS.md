# 🤖 Automated Workflows for Screeps AI

This repository includes several GitHub Actions workflows that automatically enhance your Screeps gameplay with AI-powered features.

## 🎯 Active Workflows

### 1. 🧠 AI Strategy Analyzer
**Schedule**: Every 6 hours (00:00, 06:00, 12:00, 18:00 JST)  
**File**: `.github/workflows/ai-strategy-analyzer.yml`

**What it does**:
- Analyzes your colony's needs and generates strategic recommendations
- Randomly focuses on different areas: defense, expansion, harvesting, upgrading, or exploration
- Creates tactical orders for each creep role
- Saves strategy to `Memory.strategy` for in-game access
- Displays a strategic briefing board in the console

**In-game integration**:
```javascript
const strategyMemory = require('strategy-memory');

// Load strategy into Memory
strategyMemory.loadStrategy();

// Display briefing board
strategyMemory.displayBriefing();

// Access strategy in your code
if (Memory.strategy && Memory.strategy.focus === 'defense') {
  // Prioritize defensive actions
}
```

**Output example**:
```
============================================================
🎯 STRATEGIC BRIEFING BOARD
============================================================
🕒 Updated: 2026-02-25T00:00:00Z
🎯 Focus: harvesting
📌 Objective: Optimize harvesting operations for maximum efficiency

🛠️ TACTICAL ORDERS:
  • harvester: Prioritize harvesting-related energy collection
  • builder: Focus on structures supporting harvesting
  • upgrader: Maintain steady controller progress
  • repairer: Ensure infrastructure reliability for harvesting
  • scout: Identify opportunities for harvesting
  • explorer: Map resources for harvesting expansion

🎯 Priority: harvesting
📈 Expected: Enhanced harvesting efficiency by 20-30%
============================================================
```

---

### 2. 🏆 Daily Creep Leaderboard
**Schedule**: Every day at 18:45 JST  
**File**: `.github/workflows/daily-leaderboard.yml`

**What it does**:
- Generates a unique daily challenge for your creeps
- Rotates through different achievement types
- Tracks progress automatically when integrated
- Celebrates completion with special messages

**Challenge types**:
- 🚀 **Speed Demon**: Move 500 tiles in one day
- ⛏️ **Mining Master**: Harvest 5000 energy
- 🏭 **Architect**: Build 10 structures
- 🔧 **Repairman**: Repair 3000 hit points
- 🌟 **Controller King**: Upgrade controller 50 times
- 🔍 **Explorer**: Discover a new room
- 🛡️ **Defender**: Eliminate a hostile creep
- 💊 **Healer**: Heal 2000 hit points

**In-game integration**:
```javascript
const dailyChallenge = require('daily-challenge');

// Display today's challenge
dailyChallenge.displayChallenge();

// Update progress
dailyChallenge.updateProgress('harvested', 100);
dailyChallenge.updateProgress('built', 1);
```

---

### 3. 🎓 Daily AI Evolution (Enhanced)
**Schedule**: Every day at 09:45 JST  
**File**: `.github/workflows/daily-update.yml`

**What it does**:
- AI analyzes your entire codebase daily
- Suggests creative improvements and new features
- Higher creativity setting (temperature 0.5) for more interesting ideas
- Supports all creep roles including explorer
- Auto-commits improvements as markdown reports

**Features**:
- Code analysis and optimization suggestions
- New feature proposals
- Bug detection and fixes
- Performance improvements
- Creative gameplay enhancements

---

### 4. 🛡️ Defense Manager
**Type**: Manual module (not a workflow)  
**File**: `defense.manager.js`

**What it does**:
- Automatic tower control with priority targeting
- Threat level assessment system
- Auto-spawns defender creeps based on threat
- Patrol mode when no enemies present
- Visual path rendering

**Usage**:
```javascript
const defenseManager = require('defense.manager');

defenseManager.run(room);
defenseManager.showStats(room);
```

---

## 🚀 Quick Start

1. **Enable workflows**: All workflows are pre-configured and will run automatically
2. **Manual trigger**: Click "Run workflow" in the Actions tab for immediate execution
3. **Integrate in-game**:

```javascript
// In your main.js
const strategyMemory = require('strategy-memory');
const dailyChallenge = require('daily-challenge');
const defenseManager = require('defense.manager');

module.exports.loop = function() {
  // Load AI strategy every 100 ticks
  if (Game.time % 100 === 0) {
    strategyMemory.loadStrategy();
    strategyMemory.displayBriefing();
  }
  
  // Display daily challenge
  if (Game.time % 500 === 0) {
    dailyChallenge.displayChallenge();
  }
  
  // Run defense system
  for (let roomName in Game.rooms) {
    const room = Game.rooms[roomName];
    if (room.controller && room.controller.my) {
      defenseManager.run(room);
    }
  }
  
  // Your existing code...
};
```

---

## 📊 Benefits

- **Automated Strategy**: AI adapts your gameplay focus every 6 hours
- **Daily Goals**: Stay engaged with fresh daily challenges
- **Continuous Improvement**: Daily code analysis and suggestions
- **Defense Automation**: Never get caught off-guard by hostiles
- **Learning Tool**: See how AI approaches Screeps strategy

---

## 🔧 Customization

You can customize the workflows by editing the YAML files:

- Change schedules by modifying `cron` expressions
- Add more challenge types in `daily-leaderboard.yml`
- Adjust AI creativity in `daily-update.yml` (temperature parameter)
- Add custom focus areas in `ai-strategy-analyzer.yml`

---

## 📝 Notes

- All workflows use GitHub Actions and run in the cloud
- No local setup required
- Committed files are automatically pushed to your repository
- Check the Actions tab to see workflow execution history
- Workflows can be manually triggered for testing

---

**Enjoy your AI-enhanced Screeps experience!** 🎮🤖
