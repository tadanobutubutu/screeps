// Import managers
const spawnManager = require('./managers/spawnManager');
const towerManager = require('./managers/towerManager');
const linkManager = require('./managers/linkManager');
const marketManager = require('./managers/marketManager');
const intelManager = require('./managers/intelManager');
const visualManager = require('./managers/visualManager');

// Import utilities
const utils = require('./utils/utils');
const constants = require('./utils/constants');
const profiler = require('./utils/profiler');

// Global error handler
global._handleError = function(error, context = '') {
    console.log(`[ERROR] ${context}: ${error.message}`);
    console.log(error.stack);
    Game.notify(`[ERROR] ${context}: ${error.message}`);
};

// Main loop - executed every tick
module.exports.loop = function() {
    const startCpu = Game.cpu.getUsed();
    
    try {
        // Run profiler if enabled
        if (global.PROFILER_ENABLED) {
            profiler.enable();
        }
        
        // Clean up memory
        utils.cleanMemory();
        
        // Run managers
        spawnManager.run();
        towerManager.run();
        linkManager.run();
        marketManager.run();
        intelManager.run();
        
        // Run creeps by role
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            
            try {
                switch (creep.memory.role) {
                    case 'harvester':
                        roleHarvester.run(creep);
                        break;
                    case 'upgrader':
                        roleUpgrader.run(creep);
                        break;
                    case 'builder':
                        roleBuilder.run(creep);
                        break;
                    case 'repairer':
                        roleRepairer.run(creep);
                        break;
                    case 'hauler':
                        roleHauler.run(creep);
                        break;
                    case 'miner':
                        roleMiner.run(creep);
                        break;
                    case 'claimer':
                        roleClaimer.run(creep);
                        break;
                    case 'defender':
                        roleDefender.run(creep);
                        break;
                    case 'scout':
                        roleScout.run(creep);
                        break;
                    default:
                        console.log(`Unknown role: ${creep.memory.role} for creep ${name}`);
                }
            } catch (creepError) {
                global._handleError(creepError, `Creep ${name} (${creep.memory.role})`);
            }
        }
        
        // Visuals (only if not in simulation and CPU allows)
        if (!Game.simulation && Game.cpu.getUsed() < Game.cpu.limit * 0.8) {
            visualManager.run();
        }
        
        // CPU monitoring
        const cpuUsed = Game.cpu.getUsed() - startCpu;
        if (Game.cpu.getUsed() > Game.cpu.limit * 0.95) {
            console.log(`[CPU WARNING] High CPU usage: ${Game.cpu.getUsed().toFixed(2)}/${Game.cpu.limit}`);
        }
        
        // Profiler output
        if (global.PROFILER_ENABLED) {
            profiler.output();
        }
        
    } catch (error) {
        global._handleError(error, 'Main loop');
    }
};

// Initialize global prototypes on global scope
global.utils = utils;
global.constants = constants;

// Console log startup
console.log(`[${new Date().toISOString()}] Bot started - CPU Limit: ${Game.cpu.limit}, Bucket: ${Game.gcl.level}, GPL: ${Game.gpl.level}, Credits: ${Game.market.credits}`);

/**
 * Validates SVG accessibility compliance
 * @param {Object} svgProps - Props from an SVG element
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateSvgAccessibility(svgProps) {
  const issues = [];

  const hasAriaHidden = svgProps?.ariaHidden === true;
  const hasAriaLabel = svgProps?.ariaLabel !== undefined;
  const hasRole = svgProps?.role === 'img';
  const hasTitleChild =
    svgProps?.children &&
    svgProps.children.some(c => c.type === 'title') ||
    svgProps?.type === 'title';

  const isCompliant = hasAriaHidden || hasAriaLabel || hasRole || hasTitleChild;

  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }

  return { compliant: isCompliant, issues };
}