const utils = require('./utils');
const express = require('express');
const axe = require('axe-core');
const fastMap = require('fast-map');
const path = require('path');
const { a11y, calculateSum, UserSafety, getSafetyCategory, getSafetyCategoryDetailed, getUserSafetyInfo, isUserSafetyUnsafe, hasSafetyCategory, loadUserSafetyInfo } = require('./userSafety');

// Accessibility utilities from the new commit
const a11y = {