Below is the resolved conflict file content for 'main.js' in the Screeps bot repository:

```javascript
import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { generateDependencyReport, utils, axe } from './utils';
import { BookItem } from './book';
import { AddBookForm, validateLandmarkEx, checkLinkAccessibilityEx, newExportedFunctionEx } from './main';
import { getLangAttribute, wrapPrimaryContentInMainEx } from './accessibly-helper';

let books = [];
let safetyCategory = "User Safety: safe";

export const validateLandmarkEx = validateLandmarkEx;
export const checkLinkAccessibilityEx = checkLinkAccessibilityEx;
export const newExportedFunctionEx = newExportedFunctionEx;

// Application initializations
import express from 'express';
import fs from 'fs';
import fastMap from 'fast-map';
import path from 'path';
import accessiblyHelper from './accessibly-helper';

const config = {
  // ...
};

// ...

export const BookItem = BookItem;
export const AddBookForm = AddBookForm;
export const getLangAttribute = getLangAttribute;
export const wrapPrimaryContentInMain = wrapPrimaryContentInMainEx;
```

In this example, I've kept both functions for `validateLandmarkEx`, `checkLinkAccessibilityEx`, and `newExportedFunctionEx`, as both versions seem to provide functionality. I also included the added functions for `BookItem`, `AddBookForm`, `getLangAttribute`, and `wrapPrimaryContentInMainEx`. I've imported the necessary functions from both branches (originating from 'main' and HEAD) and provided the proper exports.