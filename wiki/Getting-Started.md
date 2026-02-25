# Getting Started

This guide will help you set up and run the Screeps AI automation system.

## Prerequisites

1. Screeps game purchased on Steam
2. GitHub account
3. Basic understanding of Git

## Setup Steps

### 1. GitHub Sync Configuration (Required)

1. Visit [Screeps.com](https://screeps.com) and login with your Steam account
2. Navigate to **Account Settings** > **Git**
3. Click **Connect to GitHub**
4. Authorize GitHub access
5. Select repository: `tadanobutubutu/screeps`
6. Set branch to: `main`
7. Click **Save**

That's it! No API token needed for basic functionality.

### 2. API Token Setup (Optional)

For real-time statistics and console logs on GitHub:

1. Go to Screeps.com > **Account Settings** > **API Access**
2. Click **Generate Token**
3. Copy the token
4. Add to GitHub repository:
   - Go to **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Name: `SCREEPS_PROD_TOKEN`
   - Value: [paste your token]
   - Click **Add secret**

### 3. First Spawn

1. Open Screeps game
2. Select a room on the World map
3. Click **Spawn**
4. The automation system will start automatically

## How It Works

### Deployment Flow

```
Push to main branch
  |
GitHub Actions
  - Code formatting
  - Security scan
  - Error check
  |
Screeps auto-syncs (5-10 minutes)
  |
Code runs in-game
```

### Monitoring Flow

```
Errors occur in-game
  |
Memory.logs recorded
  |
GitHub Actions detects (15 min)
  |
Auto-fix applied
  |
PR created and merged
  |
Deployed automatically
```

## Verify Setup

### Check GitHub Sync

```bash
# Make a small change
echo "# Test sync" >> README.md
git add README.md
git commit -m "Test sync"
git push origin main

# Wait 5-10 minutes and check Screeps console
```

### Check In-Game

Open Screeps console:

```javascript
// Check current tick
Game.time

// Check creeps
Object.keys(Game.creeps).length

// Check recent logs
Memory.logs.slice(-10)

// Check for errors
Memory.logs.filter(l => l.level === 'error')
```

## Next Steps

- Read [Architecture Overview](./Architecture-Overview) to understand the system
- Explore [Automation Systems](./Automation-Systems) to see what runs automatically
- Check [Role System](./Role-System) to understand creep behaviors
- Review [Error Handling](./Error-Handling) for error management

## Need Help?

- Check [Troubleshooting](./Troubleshooting)
- Read [FAQ](./FAQ)
- Create an [Issue](https://github.com/tadanobutubutu/screeps/issues)

---

[Home](./Home) | [Next: Architecture Overview](./Architecture-Overview)
