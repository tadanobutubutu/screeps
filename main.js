// TODO: This is the existing code that needs to be preserved

/**
 * Harvest resources from the game
 * @param {Object} state - The current game state
 * @param {number} amount - Amount to harvest
 * @returns {Object} Updated state with harvested resources
 */
function harvest(state, amount = 1) {
  const harvestAmount = typeof state.harvestRate === 'number' ? state.harvestRate * amount : amount;
  return {
    ...state,
    resources: (state.resources || 0) + harvestAmount,
    lastHarvest: Date.now()
  };
}

/**
 * Upgrade game elements
 * @param {Object} state - The current game state
 * @param {string} upgradeType - Type of upgrade to apply
 * @param {number} cost - Cost of the upgrade
 * @returns {Object} Updated state after upgrade attempt
 */
function upgrade(state, upgradeType, cost) {
  if ((state.resources || 0) < cost) {
    return {
      ...state,
      upgradeSuccess: false,
      error: 'Insufficient resources for upgrade'
    };
  }

  const upgradeEffects = {
    harvestRate: (state.harvestRate || 1) + 1,
    capacity: (state.capacity || 100) + 50
  };

  const effect = upgradeEffects[upgradeType] || state[upgradeType];

  return {
    ...state,
    resources: state.resources - cost,
    [upgradeType]: effect,
    upgradeSuccess: true,
    lastUpgrade: Date.now()
  };
}

module.exports = {
  harvest,
  upgrade
};