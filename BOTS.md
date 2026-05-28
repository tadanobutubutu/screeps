# 🤖 GitHub Bots Configuration

This repository uses multiple GitHub Bots and automation tools to enhance development workflow and maintain code quality.

## 📊 Active Bots

### 1. ⬆️ Dependabot

**Status**: ✅ Active  
**Configuration**: `.github/dependabot.yml`

Automatically creates pull requests to update dependencies.

**Features**:

- npm package updates (weekly on Mondays)
- GitHub Actions updates (weekly on Mondays)
- Security vulnerability alerts
- Automatic PR creation with changelogs

**How to use**:

- Dependabot runs automatically on schedule
- Review and merge PRs labeled with `dependencies`

---

### 2. 🔄 Renovate Bot

**Status**: 🟡 Requires GitHub App Installation  
**Configuration**: `.github/renovate.json`

Advanced dependency management with auto-merge capabilities.

**Features**:

- Smart dependency grouping
- Auto-merge for minor/patch updates
- Dependency dashboard
- Vulnerability alerts

**Installation**:

1. Visit [Renovate GitHub App](https://github.com/apps/renovate)
2. Click "Install" or "Configure"
3. Select this repository
4. Renovate will start creating PRs automatically

---

### 3. 🗑️ Stale Bot

**Status**: ✅ Active  
**Configuration**: `.github/workflows/stale.yml`

Manages inactive issues and pull requests.

**Features**:

- Marks issues stale after 60 days of inactivity
- Marks PRs stale after 45 days of inactivity
- Auto-closes after warning period
- Respects exemption labels (pinned, security, etc.)

**Exemptions**:

- Issues: `pinned`, `security`, `in-progress`, `bug`
- PRs: `pinned`, `security`, `in-progress`, `wip`

---

### 4. 👋 Welcome Bot

**Status**: ✅ Active  
**Configuration**: `.github/workflows/welcome.yml`

Welcomes first-time contributors.

**Features**:

- Welcomes first issue creators
- Welcomes first PR contributors
- Provides helpful links and guidance

---

### 5. 🔀 Mergify

**Status**: 🟡 Requires GitHub App Installation  
**Configuration**: `.github/mergify.yml`

Intelligent pull request management and auto-merging.

**Features**:

- Auto-merge Dependabot PRs (minor/patch)
- Auto-merge approved automated PRs
- Auto-merge documentation updates
- Auto-labeling based on file changes
- Auto-request reviews for large PRs
- Delete head branch after merge

**Installation**:

1. Visit [Mergify GitHub App](https://github.com/apps/mergify)
2. Click "Install"
3. Select this repository
4. Mergify rules will activate automatically

---

### 6. 📦 Release Drafter

**Status**: ✅ Active  
**Configuration**: `.github/workflows/release-drafter.yml`, `.github/release-drafter.yml`

Automatically drafts release notes based on pull requests.

**Features**:

- Categorizes changes (Features, Bug Fixes, Security, etc.)
- Auto-labels PRs based on content
- Semantic versioning suggestions
- Contributors list

**Categories**:

- 🚀 Features
- 🐛 Bug Fixes
- 🔒 Security
- 📝 Documentation
- ⬆️ Dependencies
- 🤖 Automation
- 🛠️ Maintenance
- ⚡️ Performance

---

### 7. 📝 Semantic PR

**Status**: ✅ Active  
**Configuration**: `.github/workflows/semantic-pr.yml`

Enforces semantic commit message format for PR titles.

**Required Format**:

```
type(scope): subject
```

**Allowed Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Tests
- `build`: Build system
- `ci`: CI/CD
- `chore`: Maintenance
- `revert`: Revert changes

**Example PR Titles**:

- ✅ `feat(api): add new endpoint for user data`
- ✅ `fix(workflow): resolve dependency issue`
- ✅ `docs: update README with new features`
- ❌ `Add new feature` (missing type)
- ❌ `FIX: bug` (uppercase not allowed)

---

### 8. 👤 Auto Assign

**Status**: ✅ Active  
**Configuration**: `.github/workflows/auto-assign.yml`, `.github/auto-assign.yml`

Automatically assigns issues and PRs to maintainers.

**Features**:

- Auto-assigns new issues to `tadanobutubutu`
- Auto-assigns reviewers to new PRs
- Skips WIP and draft PRs

---

### 9. 🏷️ Label Sync

**Status**: ✅ Active  
**Configuration**: `.github/workflows/label-sync.yml`, `.github/labels.yml`

Synchronizes repository labels from configuration.

**Features**:

- Maintains consistent label set
- Auto-creates missing labels
- Updates label colors and descriptions
- Removes unlisted labels (pruning)

**Trigger**: Runs automatically when `.github/labels.yml` is updated

---

### 10. 🏷️ PR Labeler

**Status**: ✅ Active  
**Configuration**: `.github/workflows/pr-labeler.yml`, `.github/labeler.yml`

Automatically labels PRs based on changed files.

**Auto-Applied Labels**:

- `documentation`: `*.md`, `docs/**`, `wiki/**`
- `github-actions`: `.github/workflows/**`
- `dependencies`: `package.json`, `*lock*`
- `javascript`: `**/*.js`
- `test`: `**/*.test.js`, `test/**`
- `security`: `SECURITY.md`, security workflows
- `bot`: Bot configuration files

---

### 11. 🎖️ All Contributors

**Status**: 🟡 Manual Activation Required  
**Configuration**: `.all-contributorsrc`

Recognizes all contributors to the project.

**Features**:

- Tracks all types of contributions
- Updates README with contributor list
- Supports various contribution types (code, docs, design, etc.)

**Usage**:
Comment on an issue or PR:

```
@all-contributors please add @username for code, doc, and infra
```

**Installation**:

1. Install [All Contributors Bot](https://github.com/apps/allcontributors)
2. The bot will respond to comments in issues/PRs

---

## 🔒 Security Bots

### GitHub Advanced Security

**Status**: ✅ Active (if enabled on repository)

Includes:

- **CodeQL Analysis**: Automatic code security scanning
- **Dependabot Security Alerts**: Vulnerability notifications
- **Secret Scanning**: Detects leaked credentials

**Active Workflows**:

- `.github/workflows/codeql.yml`
- `.github/workflows/dependency-review.yml`

---

## 🛠️ Manual Installation Required

Some bots require GitHub App installation:

1. **Renovate Bot**: [Install](https://github.com/apps/renovate)
2. **Mergify**: [Install](https://github.com/apps/mergify)
3. **All Contributors**: [Install](https://github.com/apps/allcontributors)

## 📊 Bot Activity Dashboard

View bot activity:

- **Actions Tab**: See all workflow runs
- **Pull Requests**: Filter by `bot` or `automated` labels
- **Insights > Contributors**: See bot contributions

## 🐛 Troubleshooting

### Bot not working?

1. **Check Permissions**: Ensure workflows have correct permissions
2. **Check GitHub App**: Verify app is installed (for Renovate, Mergify, etc.)
3. **Check Workflow Status**: Visit Actions tab for error logs
4. **Check Configuration**: Validate YAML syntax

### Common Issues

- **Dependabot not creating PRs**: Check `dependabot.yml` syntax
- **Stale bot not running**: Ensure workflow has `issues: write` permission
- **Mergify not working**: Install Mergify GitHub App
- **Welcome bot not commenting**: Check `pull-requests: write` permission

## 🔗 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [Renovate Documentation](https://docs.renovatebot.com/)
- [Mergify Documentation](https://docs.mergify.com/)
- [All Contributors Specification](https://allcontributors.org/)

---

**Last Updated**: 2026-02-28  
**Maintainer**: @tadanobutubutu
