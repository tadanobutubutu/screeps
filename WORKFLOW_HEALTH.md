# 🔧 Workflow Health Report

**Generated**: 2026-03-19T19:03:21Z

## 📊 Status

- **Failed Runs**: 10
- **Analysis**: Complete

## 🐛 Detected Issues

[
  {
    "workflow": "Gitleaks",
    "name": "Gitleaks",
    "id": 23310861227,
    "created": "2026-03-19T18:35:00Z"
  },
  {
    "workflow": ".github/workflows/random-experiment.yml",
    "name": ".github/workflows/random-experiment.yml",
    "id": 23310860645,
    "created": "2026-03-19T18:34:59Z"
  },
  {
    "workflow": ".github/workflows/update-wiki.yml",
    "name": ".github/workflows/update-wiki.yml",
    "id": 23310860331,
    "created": "2026-03-19T18:34:59Z"
  },
  {
    "workflow": ".github/workflows/auto-create-roles.yml",
    "name": ".github/workflows/auto-create-roles.yml",
    "id": 23310859916,
    "created": "2026-03-19T18:34:58Z"
  },
  {
    "workflow": ".github/workflows/rule-based-improve.yml",
    "name": ".github/workflows/rule-based-improve.yml",
    "id": 23310859620,
    "created": "2026-03-19T18:34:58Z"
  },
  {
    "workflow": ".github/workflows/discussion-bot.yml",
    "name": ".github/workflows/discussion-bot.yml",
    "id": 23310859205,
    "created": "2026-03-19T18:34:57Z"
  },
  {
    "workflow": ".github/workflows/validate-action-versions.yml",
    "name": ".github/workflows/validate-action-versions.yml",
    "id": 23310858737,
    "created": "2026-03-19T18:34:57Z"
  },
  {
    "workflow": ".github/workflows/auto-update-docs.yml",
    "name": ".github/workflows/auto-update-docs.yml",
    "id": 23310858177,
    "created": "2026-03-19T18:34:56Z"
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

