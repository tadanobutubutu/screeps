# Tzylo Documentation

> Auto-generated engineering memory.
> Maintained by Tzylo Synapse.

---

## 🔌 API Changes

<!-- TZYLO:API_START -->
<!-- TZYLO:API_END -->

---

## 🗄️ Database Changes

<!-- TZYLO:DB_START -->
<!-- TZYLO:DB_END -->

---

## 🧱 Architecture

<!-- TZYLO:ARCH_START -->
<!-- TZYLO:ARCH_END -->

---

## ⚠️ Breaking Changes

<!-- TZYLO:BREAK_START -->
<!-- TZYLO:BREAK_END -->

---

## 📦 Dependencies

<!-- TZYLO:DEP_START -->

### actions/setup-node Version Update

- Updated actions/setup-node action from v4 to v6 in all workflows.
- Updated associated node-version to 20 in workflows using setup-node.
- Upgraded Node.js version from 20 to 24 in various workflows.
- Updated node-version in .github/workflows/auto-create-roles.yml.
- Updated node-version in .github/workflows/auto-update-docs.yml.
- Updated node-version in .github/workflows/deploy-ptr.yml.
- Updated node-version in .github/workflows/random-experiment.yml.
- Updated node-version in .github/workflows/sentinel-tests.yml.
- Updated actions/labeler action from v5 to v6 in the CI workflow.
- The labeler configuration file path remains .github/labeler.yml.
- Updated base image in .gitlab-ci.yml from node:20 to node:24.
- Updated Gitleaks action from v2 to v3 in secret-scanning workflow.
- Upgraded gitleaks/gitleaks-action from v2 to v3 in ai-guardian.yml workflow.
- Gitleaks v3 requires Node 24 runtime.
- Gitleaks scan behavior may change due to version upgrade.
- No changes to inputs, outputs, or behavior with the Gitleaks action.

### actions/checkout Version Update

- Updated actions/checkout from v4 to v7 across multiple workflow files.
- Ensures workflows use the latest features and fixes provided in v7.

### Supabase Packages Update

- Updated @supabase/supabase-js from version 2.107.0 to 2.108.2.
- Indirectly updated dependencies: @supabase/auth-js, @supabase/functions-js, @supabase/postgrest-js, @supabase/realtime-js, and @supabase/storage-js all to version 2.108.2.
- Updated package integrity hashes for all affected packages.

### Sentry SDK Update

- @sentry/browser updated from 10.59.0 to 10.62.0 in package.json, package-lock.json, and pnpm-lock.yaml.
- Related Sentry dependencies updated to version 10.62.0: @sentry/browser-utils, @sentry/core, @sentry/feedback, @sentry/replay, @sentry/replay-canvas.

### Dependency Updates

- Updated undici to version 8.5.0 for security reasons.
- Bumped eslint from 10.5.0 to 10.6.0; updated eslint-config-prettier and eslint-plugin-prettier to align with eslint 10.6.0.
- Added acorn package at version 8.17.0.
- Updated brace-expansion package to versions 1.1.15 and 2.1.1.
- Upgraded prettier from version 3.8.4 to 3.9.1 in package.json, package-lock.json, and pnpm-lock.yaml.
- Updated integrity hash for prettier in package-lock.json and pnpm-lock.yaml.
- Ensured compatibility with eslint-plugin-prettier by adjusting its dependency to prettier 3.9.1.
- Updated eslint-plugin-jest version from 29.15.2 to 29.15.3 in package.json, package-lock.json, and pnpm-lock.yaml.

### pnpm Update

- Updated pnpm dependency from version 10 to 11 in GitHub workflows.
- Changes applied in both 'ai-guardian.yml' and 'weekly-quality-report.yml' files.

<!-- TZYLO:DEP_END -->

---

## ⚙️ Configuration

<!-- TZYLO:CONF_START -->
<!-- TZYLO:CONF_END -->

---

## 🐛 Bug Fixes

<!-- TZYLO:FIX_START -->

### Authentication and Session Management

- Preserve valid session on refresh failure and cooldown repeat failures.

### Realtime Communication

- Clarified httpSend() 404 error handling and server migration notes.

### JSR Publishing

- Pinned Deno version and bound JSR publish to prevent stranded-task hangs.
- Restored JSR publish flags and enabled for beta.

<!-- TZYLO:FIX_END -->

---

## 📝 General Notes

<!-- TZYLO:GEN_START -->
<!-- TZYLO:GEN_END -->
