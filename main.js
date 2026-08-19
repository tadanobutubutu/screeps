// Main entry point for the Screeps bot.
// Handles network connections, task execution, and bot lifecycle.

const { Client } = require('screeps');

class MainBot extends Client {
    /**
     * Initialize the bot with configuration.
     */
    constructor() {
        super();
        this.name = 'ScreepsBot';
        this.id = Math.random().toString(36).substring(2, 15);

        // Task management
        this.taskQueue = [];
        this.isRunning = false;

        // Configuration defaults
        this.config = {
            maxConcurrentTasks: 20,
            heartbeatIntervalMs: 1000,
            ...process.env.NODE_ENV || {}
        };
    }

    /**
     * Start the bot and begin its main loop.
     */
    async start() {
        console.log(`[${this.name}] Starting up...`);
        await this.connect();
        this.isRunning = true;
        this.startLoop();
    }

    /**
     * Continuously process tasks from the queue.
     */
    startLoop() {
        while (this.isRunning) {
            try {
                const task = this.getNextTask();
                if (task) {
                    await this.executeTask(task);
                }
            } catch (error) {
                console.error('[MainBot] Error processing task:', error);
            }

            // Send periodic heartbeats
            if (Date.now() % this.config.heartbeatIntervalMs === 0) {
                this.sendHeartbeat();
            }
        }
    }

    /**
     * Retrieve the next task from the queue.
     */
    getNextTask() {
        if (!this.taskQueue.length) return null;
        return this.taskQueue.shift();
    }

    /**
     * Execute a single task and handle success/failure.
     */
    async executeTask(task) {
        try {
            await task.action();
            console.log(`[${this.name}] Task "${task.name}" completed successfully.`);
        } catch (err) {
            console.error(`[${this.name}] Task "${task.name}" failed:`, err);
        }
    }

    /**
     * Send a heartbeat signal to the server.
     */
    sendHeartbeat() {
        this.emit('heartbeat', Date.now());
    }
}

// Initialize and start the bot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const bot = new MainBot();
    bot.start();
});

module.exports = MainBot;