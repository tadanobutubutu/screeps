const fs = require('fs')
const path = require('path')

const writeFilesTransactionally = (rootDir, outputs, fileSystem = fs) => {
  const names = Object.keys(outputs)
  if (names.length === 0) return
  if (new Set(names).size !== names.length || names.some((name) => path.basename(name) !== name)) {
    throw new Error('Generated output names must be unique file names.')
  }

  const temporaryDir = fileSystem.mkdtempSync(path.join(rootDir, '.docs-update-'))
  const entries = []
  let rollbackFailed = false
  try {
    for (const [index, name] of names.entries()) {
      const target = path.join(rootDir, name)
      let existingMode
      try {
        const stat = fileSystem.lstatSync(target)
        if (!stat.isFile()) throw new Error(`Generated output is not a regular file: ${name}`)
        existingMode = stat.mode & 0o777
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
      const staged = path.join(temporaryDir, `new-${index}`)
      const backup = path.join(temporaryDir, `old-${index}`)
      const entry = {
        name,
        target,
        staged,
        backup,
        hadOriginal: existingMode !== undefined,
        backedUp: false,
        installed: false,
      }
      entries.push(entry)
      fileSystem.writeFileSync(staged, outputs[name], {
        encoding: 'utf8',
        mode: existingMode ?? 0o666,
        flag: 'wx',
      })
    }

    for (const entry of entries) {
      if (entry.hadOriginal) {
        fileSystem.renameSync(entry.target, entry.backup)
        entry.backedUp = true
      }
      fileSystem.renameSync(entry.staged, entry.target)
      entry.installed = true
    }
  } catch (error) {
    const rollbackErrors = []
    for (const entry of [...entries].reverse()) {
      try {
        if (entry.installed) fileSystem.unlinkSync(entry.target)
        if (entry.backedUp) fileSystem.renameSync(entry.backup, entry.target)
      } catch (rollbackError) {
        rollbackErrors.push(`${entry.name}: ${rollbackError.message}`)
      }
    }
    if (rollbackErrors.length > 0) {
      rollbackFailed = true
      throw new Error(
        `Generated files could not be fully restored. Recovery files remain in ${temporaryDir}. ` +
          `Original error: ${error.message}. Rollback errors: ${rollbackErrors.join('; ')}`
      )
    }
    throw error
  } finally {
    if (!rollbackFailed) fileSystem.rmSync(temporaryDir, { recursive: true, force: true })
  }
}

module.exports = { writeFilesTransactionally }
