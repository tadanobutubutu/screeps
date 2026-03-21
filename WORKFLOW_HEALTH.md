# 🔧 Workflow Health Report

**Generated**: 2026-03-21T06:50:53Z

## 📊 Status

- **Failed Runs**: 13
- **Analysis**: Complete

## 🐛 Detected Issues

[
  {
    "workflow": "Gitleaks",
    "name": "Gitleaks",
    "id": 23374177628,
    "created": "2026-03-21T06:46:59Z"
  },
  {
    "workflow": ".github/workflows/emergency-api-restore.yml",
    "name": ".github/workflows/emergency-api-restore.yml",
    "id": 23374177198,
    "created": "2026-03-21T06:46:57Z"
  },
  {
    "workflow": ".github/workflows/discussion-bot.yml",
    "name": ".github/workflows/discussion-bot.yml",
    "id": 23374177101,
    "created": "2026-03-21T06:46:57Z"
  },
  {
    "workflow": ".github/workflows/random-experiment.yml",
    "name": ".github/workflows/random-experiment.yml",
    "id": 23374177026,
    "created": "2026-03-21T06:46:56Z"
  },
  {
    "workflow": ".github/workflows/update-wiki.yml",
    "name": ".github/workflows/update-wiki.yml",
    "id": 23374176959,
    "created": "2026-03-21T06:46:56Z"
  },
  {
    "workflow": ".github/workflows/auto-update-docs.yml",
    "name": ".github/workflows/auto-update-docs.yml",
    "id": 23374176877,
    "created": "2026-03-21T06:46:56Z"
  },
  {
    "workflow": ".github/workflows/rule-based-improve.yml",
    "name": ".github/workflows/rule-based-improve.yml",
    "id": 23374176813,
    "created": "2026-03-21T06:46:56Z"
  },
  {
    "workflow": ".github/workflows/validate-action-versions.yml",
    "name": ".github/workflows/validate-action-versions.yml",
    "id": 23374176769,
    "created": "2026-03-21T06:46:55Z"
  },
  {

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

