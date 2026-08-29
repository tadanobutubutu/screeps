// TODO: Implement spawning logic

/**
 * Spawning utilities for managing entity creation and lifecycle
 */
const Spawner = {
  /**
   * Configuration for spawning behavior
   */
  config: {
    maxEntities: 100,
    defaultSpawnRate: 1000,
    activeSpawners: new Map(),
  },

  /**
   * Spawns an entity at the specified position
   * @param {string} entityType - The type of entity to spawn
   * @param {Object} position - The position {x, y} where to spawn
   * @param {Object} options - Additional spawn options (id, data, etc.)
   * @returns {Object|null} - The spawned entity or null if max entities reached
   */
  spawn(entityType, position = { x: 0, y: 0 }, options = {}) {
    const entityId = options.id || `spawned-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const entity = {
      id: entityId,
      type: entityType,
      position: { ...position },
      spawnedAt: Date.now(),
      active: true,
      metadata: options.metadata || {},
      ...options
    };

    return entity;
  },

  /**
   * Spawns multiple entities at once
   * @param {string} entityType - The type of entity to spawn
   * @param {number} count - Number of entities to spawn
   * @param {Function} positionGenerator - Function to generate positions for each entity
   * @param {Object} options - Additional spawn options
   * @returns {Array} - Array of spawned entities
   */
  spawnMultiple(entityType, count, positionGenerator, options = {}) {
    const entities = [];
    const maxSpawn = Math.min(count, this.config.maxEntities);

    for (let i = 0; i < maxSpawn; i++) {
      const position = typeof positionGenerator === 'function' 
        ? positionGenerator(i) 
        : { x: 0, y: 0 };
      entities.push(this.spawn(entityType, position, options));
    }

    return entities;
  },

  /**
   * Creates an automatic spawning interval
   * @param {string} spawnerId - Unique identifier for this spawner
   * @param {string} entityType - The type of entity to spawn
   * @param {Object} position - Base position or position generator function
   * @param {number} intervalMs - Milliseconds between spawns
   * @param {Object} options - Additional spawn options
   * @returns {Object} - Spawner control object with start, stop, and isActive methods
   */
  createAutoSpawner(spawnerId, entityType, position, intervalMs = 1000, options = {}) {
    let intervalId = null;
    let spawnedCount = 0;

    const start = () => {
      if (this.config.activeSpawners.has(spawnerId)) {
        return; // Already active
      }

      intervalId = setInterval(() => {
        const pos = typeof position === 'function' ? position(spawnedCount) : position;
        this.spawn(entityType, pos, options);
        spawnedCount++;
      }, intervalMs);

      this.config.activeSpawners.set(spawnerId, { intervalId, spawnedCount });
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      this.config.activeSpawners.delete(spawnerId);
    };

    const isActive = () => {
      return this.config.activeSpawners.has(spawnerId);
    };

    return { start, stop, isActive, getSpawnedCount: () => spawnedCount };
  },

  /**
   * Despawns an entity (marks it as inactive)
   * @param {Object} entity - The entity to despawn
   */
  despawn(entity) {
    if (entity && typeof entity === 'object') {
      entity.active = false;
      entity.despawnedAt = Date.now();
    }
  },

  /**
   * Stops all active spawners
   */
  stopAllSpawners() {
    this.config.activeSpawners.forEach((_, spawnerId) => {
      const spawner = this.config.activeSpawners.get(spawnerId);
      if (spawner && spawner.intervalId) {
        clearInterval(spawner.intervalId);
      }
    });
    this.config.activeSpawners.clear();
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityUtils, Spawner };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  });
}