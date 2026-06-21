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
- Gitleaks v3 requires Node 24 runtime.
- No changes to inputs, outputs, or behavior with the Gitleaks action.

### actions/checkout Version Update

- Updated actions/checkout from v4 to v7 across multiple workflow files.
- Ensures workflows use the latest features and fixes provided in v7.

### Supabase Packages Update

- Updated @supabase/supabase-js from version 2.107.0 to 2.108.2.
- Indirectly updated dependencies: @supabase/auth-js, @supabase/functions-js, @supabase/postgrest-js, @supabase/realtime-js, and @supabase/storage-js all to version 2.108.2.
- Updated package integrity hashes for all affected packages.

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
