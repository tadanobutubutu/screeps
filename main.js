// Main entry point for Screeps bot
const { Client } = require('screeps');

class MyBot extends Client {
  constructor() {
    super();
    this.name = 'MyBot';
    this.id = 'my-bot-id';
  }

  async start() {
    console.log(`Starting ${this.name}...`);
    
    // Connect to the Screeps server
    await this.connect();

    // Register event handlers
    this.onMessage('start', () => {
      console.log('Start command received');
    });

    this.onMessage('stop', () => {
      console.log('Stop command received');
      this.disconnect();
    });

    this.onMessage('ping', (msg) => {
      console.log('Ping received:', msg);
    });
  }
}

// Initialize and run the bot
async function main() {
  const bot = new MyBot();
  await bot.start();
}

main().catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});