/*! Screeps+AI: Main Module | Version 1.0.0 */
(function () {
    'use strict';

    const config = {
        console: {
            enabled: true,
            prefix: '[Screeps+AI] ',
            error: true,
            warn: false,
            info: true,
            trace: false,
            debug: false
        },
        visuals: {
            enabled: true,
            colorizeRooms: true,
            defaultColor: '#ffff00',
            showStats: true
        },
        market: {
            enabled: true,
            showOrders: true,
            showHistory: true
        },
        sandbox: {
            enabled: false,
            allowCodeExecution: false
        },
        cpu: {
            limit: 50,
            optimize: true,
            profile: false
        },
        memory: {
            cacheTime: 100,
            compress: false
        },
        notifications: {
            enabled: true,
            types: ['info', 'warning', 'error'],
            cooldown: 1000
        }
    };

    const version = '1.0.0';
    const apiUrl = 'https://api.screepspl.us/v1';

    class ScreepsAI {
        constructor() {
            this.memory = {};
            this.cpu = {};
            this.market = {};
            this.lastUpdate = 0;
        }

        init() {
            if (!Memory.screepsAI) {
                Memory.screepsAI = {
                    version: version,
                    config: config,
                    data: {},
                    stats: {},
                    history: []
                };
            }
            this.memory = Memory.screepsAI;
            this.cpu = this.memory.cpu || {};
            this.market = this.memory.market || {};
            this.update();
        }

        update() {
            const now = Date.now();
            if (now - this.lastUpdate < this.memory.config.cpu.limit) {
                return;
            }
            this.lastUpdate = now;
            this.updateStats();
            this.updateMarket();
            this.updateNotifications();
            this.cleanup();
        }

        updateStats() {
            const cpu = Game.cpu;
            this.memory.stats = {
                tick: Game.time,
                cpu: {
                    used: cpu.getUsed(),
                    limit: cpu.limit,
                    bucket: cpu.bucket
                },
                rooms: Object.keys(Game.rooms).length,
                creeps: Object.keys(Game.creeps).length,
                structures: Object.keys(Game.structures).length
            };
        }

        updateMarket() {
            if (!this.memory.config.market.enabled) return;
            const orders = Game.market.getAllOrders();
            this.memory.market.orders = orders.slice(0, 100);
            this.memory.market.history = Game.market.getHistory();
        }

        updateNotifications() {
            if (!this.memory.config.notifications.enabled) return;
            if (!this.memory.notifications) {
                this.memory.notifications = [];
            }
        }

        cleanup() {
            const maxHistory = 100;
            if (this.memory.history.length > maxHistory) {
                this.memory.history = this.memory.history.slice(-maxHistory);
            }
        }

        log(type, message, data) {
            if (!this.memory.config.console.enabled) return;
            const types = ['error', 'warn', 'info', 'trace', 'debug'];
            if (!types.includes(type)) return;
            if (!this.memory.config.console[type]) return;

            const prefix = this.memory.config.console.prefix;
            const logMessage = `${prefix}${message}`;
            
            if (data) {
                console[type](logMessage, data);
            } else {
                console[type](logMessage);
            }
        }

        error(message, error) {
            this.log('error', message, error);
        }

        warn(message) {
            this.log('warn', message);
        }

        info(message) {
            this.log('info', message);
        }

        getStats() {
            return this.memory.stats;
        }

        getMarketOrders() {
            return this.memory.market.orders || [];
        }

        getMarketHistory() {
            return this.memory.market.history || [];
        }
    }

    if (!global.ScreepsAI) {
        global.ScreepsAI = new ScreepsAI();
        global.ScreepsAI.init();
    }

    module.exports = global.ScreepsAI;
})();