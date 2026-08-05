// Keep all existing content above here
// ... (rest of the original main.js content remains unchanged)

// Add. mjs extension to the main. js file
const { Worker, MessageChannel } = require('worker_threads')

// Detect message channel

// Add gitstreamChecks functionality
async function checkGitstreamVersion () {
  let child
  try {
    child = new Worker(__filename, { type: 'module' })
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
  } catch (error) {
    console.error('Gitstream check failed:', error)
  } finally {
    if (child) {
      child.terminate()
    }
  }
}

// Add the new function to the existing exports
module.exports = function initialize () {
  try {
    main_loop()
    const lastTime = Game. time
    checkSettings()
    checkGitstreamVersion() // Call the new function
  } catch (error) {
    console.error('Initialization failed:', error)
  }
}