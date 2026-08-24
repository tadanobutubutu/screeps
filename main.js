// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// Import polyfills for fetch, etc.
import { polyfill } from './polyfills';

// Define the main entry point for the library.
export { default as NumberFormat } from './NumberFormat';
export { default as NumberFormatContext } from './NumberFormatContext';
export { default as useNumberFormat } from './useNumberFormat';

// TODO: Add back any required exports that might have been removed

export default NumberFormat;