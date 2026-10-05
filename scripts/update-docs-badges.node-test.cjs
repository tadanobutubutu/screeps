const assert = require('node:assert/strict')
const { execFileSync, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const { writeFilesTransactionally } = require('./atomic-write')
const { createBadgeBlock, getGitHubRepositorySlug, hasVerifiedMitLicense, isValidMetric, metricBadge } = require('./readme-badges')

const createTempDirectory = () => fs.mkdtempSync(path.join(os.tmpdir(), 'screeps-badge-test-'))

test('accepts only non-negative safe integer metrics', () => {
  assert.equal(isValidMetric(0), true)
  assert.equal(isValidMetric(Number.MAX_SAFE_INTEGER), true)
  assert.equal(isValidMetric(-1), false)
  assert.equal(isValidMetric(1.5), false)
  assert.equal(isValidMetric(Number.NaN), false)
  assert.equal(isValidMetric(Number.POSITIVE_INFINITY), false)
  assert.equal(isValidMetric(Number.MAX_SAFE_INTEGER + 1), false)
  assert.equal(metricBadge('Rows', Number.NaN, 'green', '#stats'), null)
})

test('omits CI and license badges unless their local sources are verified', () => {
  const rootDir = createTempDirectory()
  try {
    const badges = createBadgeBlock({
      rootDir,
      workflowFiles: [{ file: 'deploy.yml' }],
      roleFiles: [],
      totalLines: 0,
    })

    assert.match(badges, /Workflow%20files-1-green/)
    assert.match(badges, /Role%20files-0-orange/)
    assert.match(badges, /Root%20JS%20lines-0-purple/)
    assert.doesNotMatch(badges, /\[!\[CI\]/)
    assert.doesNotMatch(badges, /License: MIT/)
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('creates CI badge only for an existing CI file and a validated GitHub origin', () => {
  const rootDir = createTempDirectory()
  try {
    execFileSync('git', ['init', '-q', rootDir])
    execFileSync('git', ['-C', rootDir, 'config', 'remote.origin.url', 'https://github.com/example/repository.git'])
    const githubSlug = getGitHubRepositorySlug(rootDir)
    assert.equal(githubSlug, 'example/repository')

    const badges = createBadgeBlock({
      rootDir,
      workflowFiles: [{ file: 'ci.yml' }],
      roleFiles: [],
      totalLines: 1,
    })

    assert.match(badges, /https:\/\/github\.com\/example\/repository\/actions\/workflows\/ci\.yml\/badge\.svg/)

    for (const invalidRemote of [
      'https://github.com.evil.example/example/repository.git',
      'https://evil.example/github.com/example/repository.git',
      'https://username:token@github.com/example/repository.git',
      'evilgithub.com:example/repository.git',
    ]) {
      execFileSync('git', ['-C', rootDir, 'config', 'remote.origin.url', invalidRemote])
      assert.equal(getGitHubRepositorySlug(rootDir), null, invalidRemote)
    }

    for (const validRemote of [
      'https://github.com/example/repository.git',
      'git@github.com:example/repository.git',
      'ssh://git@github.com/example/repository.git',
      'git://github.com/example/repository.git',
    ]) {
      execFileSync('git', ['-C', rootDir, 'config', 'remote.origin.url', validRemote])
      assert.equal(getGitHubRepositorySlug(rootDir), 'example/repository', validRemote)
    }
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('creates a CI badge for a verified ci.yaml workflow', () => {
  const rootDir = createTempDirectory()
  try {
    execFileSync('git', ['init', '-q', rootDir])
    execFileSync('git', ['-C', rootDir, 'config', 'remote.origin.url', 'https://github.com/example/repository.git'])
    const badges = createBadgeBlock({
      rootDir,
      workflowFiles: [{ file: 'ci.yaml' }],
      roleFiles: [],
      totalLines: 0,
    })

    assert.match(badges, /actions\/workflows\/ci\.yaml\/badge\.svg/)
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('requires both package metadata and the MIT license text for an MIT badge', () => {
  const mitPackage = JSON.stringify({ license: 'MIT' })
  const licenseText = 'MIT License\n\nTerms.\n'
  assert.equal(hasVerifiedMitLicense(mitPackage, licenseText), true)
  assert.equal(hasVerifiedMitLicense(mitPackage, '\n\r\nMIT License\n\nTerms.\n'), true)
  assert.equal(hasVerifiedMitLicense(mitPackage, '\uFEFF  MIT License\r\n\r\nTerms.\r\n'), true)
  assert.equal(hasVerifiedMitLicense(mitPackage, 'Apache License\n\nMIT License is mentioned here.\n'), false)
  assert.equal(hasVerifiedMitLicense(mitPackage, 'Some license text\nMIT License\n'), false)
  assert.equal(hasVerifiedMitLicense(JSON.stringify({ license: 'Apache-2.0' }), licenseText), false)
  assert.equal(hasVerifiedMitLicense(mitPackage, 'Apache License'), false)
})

test('replaces stale badges with current verified metrics and omits a missing CI workflow', () => {
  const rootDir = createTempDirectory()
  try {
    fs.mkdirSync(path.join(rootDir, '.github', 'workflows'), { recursive: true })
    fs.writeFileSync(
      path.join(rootDir, '.github', 'workflows', 'deploy.yml'),
      'name: Deploy\non:\n  push:\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps: []\n'
    )
    fs.writeFileSync(path.join(rootDir, 'role.scout.js'), 'module.exports = {};\n')
    fs.writeFileSync(path.join(rootDir, 'index.js'), '// source\nconst value = 1;\n')
    fs.writeFileSync(path.join(rootDir, 'crlf.js'), 'first\r\nsecond\r\n')
    fs.writeFileSync(path.join(rootDir, 'cr.js'), 'first\rsecond\r')
    fs.writeFileSync(path.join(rootDir, 'no-final-newline.js'), 'first\nsecond')
    fs.writeFileSync(path.join(rootDir, 'package.json'), JSON.stringify({ license: 'MIT' }))
    fs.writeFileSync(path.join(rootDir, 'LICENSE'), 'MIT License\n\nTerms.\n')
    fs.writeFileSync(
      path.join(rootDir, 'README.md'),
      '[![CI](https://github.com/example/old/actions/workflows/ci.yml/badge.svg)](old)\n' +
        '[![Workflows](https://img.shields.io/badge/Workflows-999-red)](old)\n'
    )
    fs.writeFileSync(path.join(rootDir, 'WORKFLOWS.md'), '# 🤖\n')

    const scriptPath = path.join(__dirname, 'update-docs.js')
    const result = spawnSync(process.execPath, [scriptPath], { cwd: rootDir, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr || result.stdout)

    const readme = fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8')
    const stats = JSON.parse(fs.readFileSync(path.join(rootDir, 'repo-stats.json'), 'utf8'))
    assert.match(readme, /Workflow%20files-1-green/)
    assert.match(readme, /Role%20files-1-orange/)
    assert.match(readme, /Root%20JS%20lines-9-purple/)
    assert.match(readme, /License: MIT/)
    assert.doesNotMatch(readme, /example\/old\/actions\/workflows\/ci\.yml/)
    assert.doesNotMatch(readme, /Workflows-999-red/)
    assert.doesNotMatch(readme, /\[!\[CI\]/)
    assert.match(readme, /ワークフローファイル \(1個\)/)
    assert.match(readme, /## 🐛 ロールファイル \(1個\)/)
    assert.match(readme, /\[!\[Role files\][^\n]+\]\(#-ロールファイル-1個\)/)
    assert.doesNotMatch(readme, /no API keys required|API不要|総コード行数/)
    assert.doesNotMatch(readme, /稼働中のワークフロー/)
    assert.match(stats.updated, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    assert.ok(readme.includes(`最終更新: ${stats.updated}`))
    assert.match(readme, /Enjoy your Screeps experience/)
    assert.doesNotMatch(readme, /fully automated/i)
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('does not change documentation when a workflow entry cannot be read', () => {
  const rootDir = createTempDirectory()
  try {
    const workflowDir = path.join(rootDir, '.github', 'workflows')
    fs.mkdirSync(workflowDir, { recursive: true })
    fs.mkdirSync(path.join(workflowDir, 'broken.yml'))
    fs.writeFileSync(path.join(rootDir, 'README.md'), 'keep prior README\n')
    fs.writeFileSync(path.join(rootDir, 'repo-stats.json'), '{"keep":true}\n')

    const scriptPath = path.join(__dirname, 'update-docs.js')
    const result = spawnSync(process.execPath, [scriptPath], { cwd: rootDir, encoding: 'utf8' })
    assert.notEqual(result.status, 0)
    assert.equal(fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8'), 'keep prior README\n')
    assert.equal(fs.readFileSync(path.join(rootDir, 'repo-stats.json'), 'utf8'), '{"keep":true}\n')
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('preserves all old outputs when staging a generated file fails', () => {
  const rootDir = createTempDirectory()
  try {
    fs.writeFileSync(path.join(rootDir, 'README.md'), 'old readme\n')
    fs.writeFileSync(path.join(rootDir, 'repo-stats.json'), 'old stats\n')
    let failed = false
    const failingFs = new Proxy(fs, {
      get(target, property) {
        if (property === 'writeFileSync') {
          return (...args) => {
            if (!failed && path.basename(args[0]) === 'new-1') {
              failed = true
              throw new Error('injected staging failure')
            }
            return fs.writeFileSync(...args)
          }
        }
        const value = target[property]
        return typeof value === 'function' ? value.bind(target) : value
      },
    })

    assert.throws(
      () =>
        writeFilesTransactionally(
          rootDir,
          { 'README.md': 'new readme\n', 'repo-stats.json': 'new stats\n' },
          failingFs
        ),
      /injected staging failure/
    )
    assert.equal(fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8'), 'old readme\n')
    assert.equal(fs.readFileSync(path.join(rootDir, 'repo-stats.json'), 'utf8'), 'old stats\n')
    assert.deepEqual(fs.readdirSync(rootDir).sort(), ['README.md', 'repo-stats.json'])
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})

test('restores the previous output set when a rename fails during replacement', () => {
  const rootDir = createTempDirectory()
  try {
    fs.writeFileSync(path.join(rootDir, 'README.md'), 'old readme\n')
    fs.writeFileSync(path.join(rootDir, 'repo-stats.json'), 'old stats\n')
    let failed = false
    const failingFs = new Proxy(fs, {
      get(target, property) {
        if (property === 'renameSync') {
          return (source, destination) => {
            if (!failed && path.basename(source) === 'new-1') {
              failed = true
              throw new Error('injected replacement failure')
            }
            return fs.renameSync(source, destination)
          }
        }
        const value = target[property]
        return typeof value === 'function' ? value.bind(target) : value
      },
    })

    assert.throws(
      () =>
        writeFilesTransactionally(
          rootDir,
          { 'README.md': 'new readme\n', 'repo-stats.json': 'new stats\n' },
          failingFs
        ),
      /injected replacement failure/
    )
    assert.equal(fs.readFileSync(path.join(rootDir, 'README.md'), 'utf8'), 'old readme\n')
    assert.equal(fs.readFileSync(path.join(rootDir, 'repo-stats.json'), 'utf8'), 'old stats\n')
    assert.deepEqual(fs.readdirSync(rootDir).sort(), ['README.md', 'repo-stats.json'])
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true })
  }
})
