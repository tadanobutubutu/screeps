@echo off
echo ===================================================
echo GabinoTech OS - Submit Bounty PR for Issue #21
echo Destination Payout: gabinotech22@gmail.com
echo ===================================================
git push origin fix/bounty-issue-5
gh pr create --title "Dependency Dashboard" --body-file PR_CLAIM_BUNDLE.md
echo [OK] Pull Request submitted. Check https://github.com/tadanobutubutu/screeps/issues/5
pause
