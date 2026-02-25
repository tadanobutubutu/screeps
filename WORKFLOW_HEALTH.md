# 🔧 Workflow Health Report

**Generated**: $(date -u +%Y-%m-%dT%H:%M:%SZ)

## 📊 Status

- **Failed Runs**: 28
- **Analysis**: Complete
- **Fix Applied**: true

## 🐛 Detected Issues

$(cat failure_patterns.json | head -50)

## 🔧 Recommended Fixes

### 1. API Token Configuration
If workflows fail due to missing tokens:
- Set `SCREEPS_PROD_TOKEN` in GitHub Secrets
- Or accept that API features are optional

### 2. Workflow Syntax
- Check YAML syntax
- Validate workflow structure
- Test locally with `act`

### 3. Permissions
- Ensure workflows have necessary permissions
- Check repository settings

## ✅ Auto-Fix Status

$(if [ -f "APPLIED_WORKFLOW_FIXES.json" ]; then
  echo "Fixes applied:"
  cat APPLIED_WORKFLOW_FIXES.json
else
  echo "No automatic fixes available - manual review needed"
fi)

## 📝 Next Steps

1. Review this report
2. Check PR for automatic fixes
3. Manually fix remaining issues
4. Re-run failed workflows

