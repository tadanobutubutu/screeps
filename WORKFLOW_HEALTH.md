# 🔧 Workflow Health Report

**Generated**: 2026-03-21T02:21:23Z

## 📊 Status

- **Failed Runs**: 4
- **Analysis**: Complete

## 🐛 Detected Issues

[
  {
    "workflow": "💰 Usage Monitor & Auto-Optimize",
    "name": "💰 Usage Monitor & Auto-Optimize",
    "id": 23369467584,
    "created": "2026-03-21T01:50:37Z"
  },
  {
    "workflow": "✨ AI Code Improvement",
    "name": "✨ AI Code Improvement",
    "id": 23369447789,
    "created": "2026-03-21T01:49:27Z"
  },
  {
    "workflow": "CodeQL",
    "name": "Push on main",
    "id": 23351356468,
    "created": "2026-03-20T16:03:52Z"
  },
  {
    "workflow": "CodeQL",
    "name": "Push on main",
    "id": 23347924690,
    "created": "2026-03-20T14:40:58Z"
  }
]

## 🔧 Recommended Actions

### 1. Missing Labels
Some workflows may fail because required labels don't exist.
- Run "Setup Labels" workflow to create them

### 2. API Token Configuration
If workflows fail due to missing tokens:
- Set SCREEPS_PROD_TOKEN in GitHub Secrets (optional)

### 3. Workflow Syntax
- Check YAML syntax
- Validate workflow structure

### 4. Permissions
- Ensure workflows have necessary permissions

