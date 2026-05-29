## [6400433] - 2026-05-30
### ⬆️(deps): Bump pnpm/action-setup from 4 to 6 (#642)

Bumps [pnpm/action-setup](https://github.com/pnpm/action-setup) from 4
to 6.
<details>
<summary>Release notes</summary>
<p><em>Sourced from <a
href="https://github.com/pnpm/action-setup/releases">pnpm/action-setup's
releases</a>.</em></p>
<blockquote>
<h2>v6.0.0</h2>
<p>Added support for pnpm <a
href="https://github.com/pnpm/pnpm/releases/tag/v11.0.0-rc.0">v11</a>.</p>
<h2>v5.0.0</h2>
<p>Updated the action to use Node.js 24.</p>
<h2>v4.4.0</h2>
<p>Updated the action to use Node.js 24.</p>
<h2>v4.3.0</h2>
<h2>What's Changed</h2>
<ul>
<li>docs: fix the run_install example in the Readme by <a
href="https://github.com/dreyks"><code>@​dreyks</code></a> in <a
href="https://redirect.github.com/pnpm/action-setup/pull/175">pnpm/action-setup#175</a></li>
<li>chore: remove unused <code>@types/node-fetch</code> dependency by <a
href="https://github.com/silverwind"><code>@​silverwind</code></a> in <a
href="https://redirect.github.com/pnpm/action-setup/pull/186">pnpm/action-setup#186</a></li>
<li>Clarify that package_json_file is relative to GITHUB_WORKSPACE by <a
href="https://github.com/chris-martin"><code>@​chris-martin</code></a>
in <a
href="https://redirect.github.com/pnpm/action-setup/pull/184">pnpm/action-setup#184</a></li>
<li>feat: store caching by <a
href="https://github.com/jrmajor"><code>@​jrmajor</code></a> in <a
href="https://redirect.github.com/pnpm/action-setup/pull/188">pnpm/action-setup#188</a></li>
<li>refactor: remove star imports by <a
href="https://github.com/KSXGitHub"><code>@​KSXGitHub</code></a> in <a
href="https://redirect.github.com/pnpm/action-setup/pull/196">pnpm/action-setup#196</a></li>
<li>fix(ci): exclude macos by <a
href="https://github.com/KSXGitHub"><code>@​KSXGitHub</code></a> in <a
href="https://redirect.github.com/pnpm/action-setup/pull/197">pnpm/action-setup#197</a></li>
</ul>
<h2>New Contributors</h2>
<ul>
<li><a href="https://github.com/dreyks"><code>@​dreyks</code></a> made
their first contribution in <a
href="https://redirect.github.com/pnpm/action-setup/pull/175">pnpm/action-setup#175</a></li>
<li><a
href="https://github.com/silverwind"><code>@​silverwind</code></a> made
their first contribution in <a
href="https://redirect.github.com/pnpm/action-setup/pull/186">pnpm/action-setup#186</a></li>
<li><a
href="https://github.com/chris-martin"><code>@​chris-martin</code></a>
made their first contribution in <a
href="https://redirect.github.com/pnpm/action-setup/pull/184">pnpm/action-setup#184</a></li>
<li><a href="https://github.com/jrmajor"><code>@​jrmajor</code></a> made
their first contribution in <a
href="https://redirect.github.com/pnpm/action-setup/pull/188">pnpm/action-setup#188</a></li>
<li><a
href="https://github.com/Boosted-Bonobo"><code>@​Boosted-Bonobo</code></a>
made their first contribution in <a
href="https://redirect.github.com/pnpm/action-setup/pull/199">pnpm/action-setup#199</a></li>
</ul>
<p><strong>Full Changelog</strong>: <a
href="https://github.com/pnpm/action-setup/compare/v4.2.0...v4.3.0">https://github.com/pnpm/action-setup/compare/v4.2.0...v4.3.0</a></p>
<h2>v4.2.0</h2>
<p>When there's a <code>.npmrc</code> file at the root of the
repository, pnpm will be fetched from the registry that is specified in
that <code>.npmrc</code> file <a
href="https://redirect.github.com/pnpm/action-setup/pull/179">#179</a></p>
<h2>v4.1.0</h2>
<p>Add support for <code>package.yaml</code> <a
href="https://redirect.github.com/pnpm/action-setup/pull/156">#156</a>.</p>
</blockquote>
</details>
<details>
<summary>Commits</summary>
<ul>
<li><a
href="https://github.com/pnpm/action-setup/commit/0e279bb959325dab635dd2c09392533439d90093"><code>0e279bb</code></a>
fix: update pnpm to 11.1.1 (<a
href="https://redirect.github.com/pnpm/action-setup/issues/248">#248</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/3e835812ef01165f4f8ae08ade56da44427ed4e0"><code>3e83581</code></a>
fix: drop patchPnpmEnv so standalone+self-update works on Windows (<a
href="https://redirect.github.com/pnpm/action-setup/issues/258">#258</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/551b42e879e37e74d986effdd2a1647d2b02d464"><code>551b42e</code></a>
docs(README): fix <code>cache_dependency_path</code> type (<a
href="https://redirect.github.com/pnpm/action-setup/issues/257">#257</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/739bfe42ca9233c5e6aca07c1a25a9d34aca49b0"><code>739bfe4</code></a>
fix: self-update bootstrap to packageManager-pinned version (<a
href="https://redirect.github.com/pnpm/action-setup/issues/233">#233</a>)
(<a
href="https://redirect.github.com/pnpm/action-setup/issues/256">#256</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/f61705d907761b3b5209e83910fafd1fea50c5a1"><code>f61705d</code></a>
chore: add CODEOWNERS</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/7a5507b117647ab83e96e9db317ba2234056ebf3"><code>7a5507b</code></a>
fix: restore inputs from state in post (<a
href="https://redirect.github.com/pnpm/action-setup/issues/255">#255</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/1155470f3e5fb872accd4d104b8dfcda41f676ce"><code>1155470</code></a>
fix: honor devEngines.packageManager.onFail=error (<a
href="https://redirect.github.com/pnpm/action-setup/issues/252">#252</a>)
(<a
href="https://redirect.github.com/pnpm/action-setup/issues/254">#254</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/91ab88e2619ed1f46221f0ba42d1492c02baf788"><code>91ab88e</code></a>
fix: bin_dest output points to self-updated pnpm, not bootstrap (<a
href="https://redirect.github.com/pnpm/action-setup/issues/249">#249</a>)</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/e578e19d19d31b011b841ba2aca34731a5f706a5"><code>e578e19</code></a>
fix: update pnpm to 11.0.4</li>
<li><a
href="https://github.com/pnpm/action-setup/commit/8912a9102ac27614460f54aedde9e1e7f9aec20d"><code>8912a91</code></a>
fix: append (not prepend) action node dir to PATH for npm bootstrap (<a
href="https://redirect.github.com/pnpm/action-setup/issues/241">#241</a>)</li>
<li>Additional commits viewable in <a
href="https://github.com/pnpm/action-setup/compare/v4...v6">compare
view</a></li>
</ul>
</details>
<br />


[![Dependabot compatibility
score](https://dependabot-badges.githubapp.com/badges/compatibility_score?dependency-name=pnpm/action-setup&package-manager=github_actions&previous-version=4&new-version=6)](https://docs.github.com/en/github/managing-security-vulnerabilities/about-dependabot-security-updates#about-compatibility-scores)

Dependabot will resolve any conflicts with this PR as long as you don't
alter it yourself. You can also trigger a rebase manually by commenting
`@dependabot rebase`.

[//]: # (dependabot-automerge-start)
[//]: # (dependabot-automerge-end)

---

<details>
<summary>Dependabot commands and options</summary>
<br />

You can trigger Dependabot actions by commenting on this PR:
- `@dependabot rebase` will rebase this PR
- `@dependabot recreate` will recreate this PR, overwriting any edits
that have been made to it
- `@dependabot show <dependency name> ignore conditions` will show all
of the ignore conditions of the specified dependency
- `@dependabot ignore this major version` will close this PR and stop
Dependabot creating any more for this major version (unless you reopen
the PR or upgrade to it yourself)
- `@dependabot ignore this minor version` will close this PR and stop
Dependabot creating any more for this minor version (unless you reopen
the PR or upgrade to it yourself)
- `@dependabot ignore this dependency` will close this PR and stop
Dependabot creating any more for this dependency (unless you reopen the
PR or upgrade to it yourself)


</details>

<!-- This is an auto-generated description by cubic. -->
---
## Summary by cubic
Upgrade `pnpm/action-setup` from v4 to v6 in CI and weekly quality
report workflows. Aligns the action with Node 24 and `pnpm` v11 used in
our builds.

<sup>Written for commit 1f481d85d2cfacee9e76c28c1486decc72d818be.
Summary will update on new commits.</sup>

<a
href="https://cubic.dev/pr/tadanobutubutu/screeps/pull/642?utm_source=github">Review
in cubic</a>

<!-- End of auto-generated description by cubic. -->
Bumped pnpm/action-setup from v4 to v6 in GitHub Actions workflows (ci.yml and weekly-quality-report.yml). This is a dependency update for CI infrastructure that adds support for pnpm v11 and Node.js 24, with no changes to production code.

# 📝 Changelog

**Maintained by**: Changelog Bot
**Last Updated**: 2026-03-27T19:22:52Z

## Recent Changes

- 🔧 Workflow health report: 18 issues
- 📊 Statistics update by Stats Bot
- 🧠 Update AI strategy briefing [2026-03-27 18:51 UTC]
- feat: integrate PostHog with Sentry using env secret
- 🎮 Update game stats [skip ci]
- feat: add Sentry error monitoring with source maps
- 🎨 Auto-format: ESLint + Prettier applied
- 📊 Statistics update by Stats Bot
- 📝 Changelog update by Changelog Bot
- 📊 Statistics update by Stats Bot

## Bot Activity

All bots are actively maintaining the codebase.

---

_Auto-generated changelog_
