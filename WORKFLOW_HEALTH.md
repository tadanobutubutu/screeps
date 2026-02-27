# 🔧 Workflow Health Report

**Generated**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## 📊 Status

- **Failed Runs**: 39
- **Analysis**: Complete

## 🐛 Detected Issues

$(cat failed_workflows.json | head -50)

## 🔧 Recommended Actions

### 1. Missing Labels
Some workflows may fail because required labels don't exist.
- Run "Setup Labels" workflow to create them
- Or manually create labels in repository settings

### 2. API Token Configuration
If workflows fail due to missing tokens:
- Set `SCREEPS_PROD_TOKEN` in GitHub Secrets (optional)
- Workflows will gracefully skip API features if not set

### 3. Workflow Syntax
- Check YAML syntax
- Validate workflow structure

### 4. Permissions
- Ensure workflows have necessary permissions
- Check repository settings

## 📝 Next Steps

1. Review this report
2. Run "Setup Labels" workflow
3. Re-run failed workflows
4. Monitor for 24 hours

