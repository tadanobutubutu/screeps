import { computeMatrixSize } from './utils/matrixSize';
import { computeRoomCount } from './utils/roomCount';

/** @param {Room} room */
/** @returns {number} */
export function computeEnergyTotal(room) {
  return [ENERGY_TYPES.get('H', null)].filter(t => room.lookForAt(LOOK_RESOURCE_TYPES, t.position)).length;
}

/** @param {Room} room */
/** @returns {number} */
export function computeEnergyCapacity(room) {
  return room.store.getUsedCapacity(RESOURCE_ENERGY);
}

/** @param {Room} room */
/** @returns {number} */
export function computeEnergyStorage(room) {
  return [ENERGY_TYPES.get('R', null)].filter(t => room.lookForAt(LOOK_RESOURCE_TYPES, t.position)).length;
}

/** @param {Room} room */
/** @returns {number} */
export function computeEnergyProduction(room, type = 'H') {
  const sources = type === 'H' ? [ENERGY_TYPES.get('H', null)] : [ENERGY_TYPES.get('R', null)];
  return sources.reduce((acc, type) => acc + room.lookForAt(LOOK_RESOURCE_TYPES, type.position).amount, 0);
}

/** @param {RoomController} controller */
/** @param {number} totalEnergyAmount */
/** @returns {number} */
export function computeEnergyHarvestPerTick(controller, totalEnergyAmount) {
  return Math.min(totalEnergyAmount, controller.room.find(LOOK_SOURCES).length * 2);
}

export default {
  computeEnergyTotal,
  computeEnergyCapacity,
  computeEnergyStorage,
  computeEnergyProduction,
  computeEnergyHarvestPerTick
};