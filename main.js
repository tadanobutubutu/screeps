import _ from 'lodash';

// Existing exports and functions stay here

// New export for the myNewFunction
export function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}