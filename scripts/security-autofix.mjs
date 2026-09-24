#!/usr/bin/env node
/**
 * Security autofix helper: audit, apply safe fixes, summarize remaining alerts.
 * Used by .github/workflows/security-autofix.yml (free npm audit only).
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

function run (cmd, args = [], opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts })
}

function safeRun (cmd, args = []) {
  try {
    return { ok: true, out: run(cmd, args) }
  } catch (err) {
    return {
      ok: false,
      out: err.stdout?.toString() ?? '',
      err: err.stderr?.toString() ?? String(err)
    }
  }
}

function parseAudit () {
  const res = safeRun('npm', ['audit', '--json'])
  if (!res.ok) {
    return { error: res.err, vulnerabilities: {} }
  }
  try {
    return JSON.parse(res.out)
  } catch {
    return { error: 'invalid audit json', vulnerabilities: {} }
  }
}

function countSeverities (audit) {
  const vulns = audit.vulnerabilities ?? {}
  const counts = { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: 0 }
  for (const entry of Object.values(vulns)) {
    const sev = entry.severity ?? 'info'
    if (counts[sev] !== undefined) counts[sev]++
    counts.total++
  }
  return counts
}

function listActionable (audit) {
  const vulns = audit.vulnerabilities ?? {}
  return Object.entries(vulns)
    .filter(([, v]) => v.fixAvailable === true || v.isDirect === true)
    .map(([name, v]) => ({
      name,
      severity: v.severity,
      fixAvailable: Boolean(v.fixAvailable),
      via: (v.via ?? []).slice(0, 3)
    }))
    .slice(0, 50)
}

const before = parseAudit()
const beforeCounts = countSeverities(before)

const fix = safeRun('npm', ['audit', 'fix'])
const fixForce = safeRun('npm', ['audit', 'fix', '--force'])

const after = parseAudit()
const afterCounts = countSeverities(after)

const lockRegen = safeRun('npm', ['install', '--package-lock-only'])

const report = {
  generatedAt: new Date().toISOString(),
  before: beforeCounts,
  after: afterCounts,
  fixed: {
    critical: Math.max(0, beforeCounts.critical - afterCounts.critical),
    high: Math.max(0, beforeCounts.high - afterCounts.high),
    moderate: Math.max(0, beforeCounts.moderate - afterCounts.moderate),
    low: Math.max(0, beforeCounts.low - afterCounts.low)
  },
  actionable: listActionable(after),
  steps: {
    auditFix: fix.ok,
    auditFixForce: fixForce.ok,
    lockfileRegenerated: lockRegen.ok
  },
  needsIssue: afterCounts.critical > 0 || afterCounts.high > 0 || afterCounts.moderate > 0
}

writeFileSync('security-autofix-report.json', JSON.stringify(report, null, 2))

console.log('=== Security Autofix Report ===')
console.log(JSON.stringify(report, null, 2))

if (report.needsIssue) {
  process.exitCode = 2
}
