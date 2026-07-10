console.info('info message');
if (currentLevel >= LEVELS.info) {
  console.info(format('info', 'info message'));
}

console.error('error message');
if (currentLevel >= LEVELS.error) {
  console.error(format('error', 'error message'));
}

console.warn('warn message');
if (currentLevel >= LEVELS.warn) {
  console.warn(format('warn', 'warn message'));
}