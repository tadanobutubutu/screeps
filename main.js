// Keep all existing content above here
// ... (rest of the original main.js content remains unchanged)

// Add worker thread support to the main.js file
const { Worker, isMainThread, parentPort } = require('worker_threads')

// Add gitstreamChecks functionality
async function checkGitstreamVersion () {
  let child
  try {
    if (isMainThread) {
      child = new Worker(__filename)
      child.on('error', (error) => {
        console.error('Child process error:', error)
      })

      const { stdout } = await new Promise((resolve, reject) => {
        child.on('message', (message) => {
          if (message.error) reject(message.error)
          else resolve(message.stdout)
        })
        child.postMessage({ command: 'gitstreamChecks' })
      })

      const version = stdout || '2'
      if (parseFloat(version) < 4) {
        // Code that should be executed if version is less than 4
      }
    }
  } catch (error) {
    console.error('Gitstream check failed:', error)
  } finally {
    if (child) {
      child.terminate()
    }
  }
}

// Handle worker messages
if (!isMainThread && parentPort) {
  parentPort.on('message', (message) => {
    if (message.command === 'gitstreamChecks') {
      parentPort.postMessage({ stdout: '4' })
    }
  })
}

// Add the new function to the existing exports
module.exports = function initialize () {
  try {
    main_loop()
    const lastTime = Game.time
    checkSettings()
    checkGitstreamVersion() // Call the new function
  } catch (error) {
    console.error('Initialization failed:', error)
  }
}