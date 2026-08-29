const child_process = require('child_process');

// ... existing code and exports

function spawnSomeCommand(callback) {
  child_process.spawn('someCommand', {}, {
    stdio: 'inherit',
  }).on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error(`someCommand failed with code ${code}`));
    }
  });
}

exports.spawnSomeCommand = spawnSomeCommand;