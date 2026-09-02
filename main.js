We need to resolve the merge conflict. The conflict appears between two versions of file: HEAD (original) and origin/main (new). Need to integrate changes logically.

We see many sections: at top, there is a conflict between the top part: HEAD defines const express = require('express'); etc., then Book-related functions addBook, etc. Then origin/main defines a completely different structure: a IIFE, etc. The conflict seems to be about the whole file content.

We need to produce a resolved file that keeps both changes if they add features, or choose correct logic.

Let's examine the two halves:

HEAD part:
```
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const accessiblyHelper = require('./accessibly-helper');

const books = [];
const safetyCategory = "User Safety: safe";

// Book-related functions
function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);
  announceBookAdded(title, author);
  return bookObject;
}
```

Then there is a large block of code (function3, createInPageButton, scanAccessibility, etc.) that seems from origin/main. Then later there is more code (validateInput, processData, formatResponse, etc.) and many functions.

The HEAD part seems to be a module exporting many functions. The origin/main part is an IIFE that defines many functions and also sets up DOM manipulation, etc. It also includes require('fs') and require('path') later.

The conflict markers: 
- At top: <<<<<<< HEAD ... const express = ... addBook ... <<<<<<< HEAD
- Then ============================= (the file header)
- Then <<<<<<< HEAD again? Actually after the header, there is <<<<<<< HEAD and then the code for addBook and other functions (the HEAD version). Then ============================= and then <<<<<<< origin/main ... and then code for function3, createInPageButton, etc. Then >>>>>>> origin/main and then more code (the rest of origin/main). Then after that there is a final block with module.exports.

So the HEAD version seems to be a module with exports, while origin/main is an IIFE that defines functions and initializes on DOM ready. The HEAD version also includes module.exports at the end.

The goal: resolve conflict meaningfully. We need to keep both functionalities: perhaps the HEAD version provides Node.js module with functions (including book management, accessibility utilities, report generation). The origin/main version seems to be a browser environment (DOM) with IIFE, handling UI elements, adding buttons, forms, etc. It also uses fs and path which are Node modules, but inside a browser context doesn't make sense. However the origin/main code includes require('fs') and require('path') after the IIFE? Wait, at the bottom of origin/main there is:

```
const fs = require('fs');
const path = require('path');
```

But those are placed after the IIFE? Actually the code shows:

```
    // Initialize on DOM ready
    ...
} // end IIFE

// Import any required modules
const fs = require('fs');
const path = require('path');
```

So after the IIFE, there are require statements outside of it, maybe for Node usage later. So the file likely is meant to be run in Node (Screeps bot) but also manipulates DOM (maybe using some environment like jsdom). The HEAD version also uses require('express'), which is a web framework, maybe not needed.

We need to merge: keep book functions (addBook) from HEAD, also keep accessibility functions, report generation, etc. Also keep the IIFE that sets up DOM manipulation and initializes.

Potential approach: Keep the module exports at bottom (module.exports) but also have the IIFE that runs on DOM ready. However module.exports expects the file to be CommonJS; the IIFE will run and then we can export functions.

But the HEAD version already defines module.exports with many functions, including addBook, etc. The origin/main version defines many functions (including addBookWithAccessibility) and also sets up DOM.

We need to combine them: maybe we keep the module.exports structure but incorporate the IIFE logic inside the module, perhaps at the bottom after exports? Or we can restructure: keep the top-level require statements (express, axe, fs, path, utils, accessiblyHelper). Then define the book array and safetyCategory. Then define addBook (as in HEAD). Then incorporate the rest of functions (createInPageButton, scanAccessibility, etc.) from origin/main, but adapt them to be usable in Node (maybe they rely on DOM). Since Screeps environment may have a simulated DOM (maybe using jsdom). We'll assume it's okay.

We need to avoid duplicate definitions. For example, there are two definitions of addBook: HEAD defines addBook(title,author) but origin/main also defines addBookWithAccessibility (different signature). We need to keep both? The instruction says "keep and integrate both changes if they both add features". addBook is simple; addBookWithAccessibility adds UI form creation. They serve different purposes; we can keep both functions with distinct names. So we keep addBook (original) and addBookWithAccessibility (new). Ensure no naming conflict.

Also there are duplicate function definitions: function3 appears in both. HEAD has function3 defined as:

```
function function3() {
  console.log('Function3 is running.');
}
```

origin/main also defines function3 (maybe same). It appears twice. We need to keep one definition.

Also there are duplicate exports: module.exports includes many functions; origin/main also defines exports via Object.assign. We need to consolidate.

Simplify: We'll produce a resolved file that:

- Starts with require statements (express, axe, fs, path, utils, accessiblyHelper).
- Defines books array and safetyCategory.
- Defines addBook (original).
- Defines addBookWithAccessibility (new) with proper form creation and event handling (including validation and success messages).
- Define other utility functions (createInPageButton, checkLinkAccessibility, etc.) but ensure no duplicate definitions; maybe keep those that are needed.

- Keep the IIFE that initializes on DOM ready, but maybe we need to wrap it as a function that can be called, and also export it.

But module.exports expects to be at top-level; we can have the IIFE inside the module but not immediately invoked? Actually we can have the IIFE run at the end of the file (after definitions) to set up the UI.

Simplify: We'll keep the top-level code (require, variables, addBook) and then define all functions (including those from origin/main) and at the end we call initialize() if in browser environment (i.e., if typeof window !== 'undefined' or document). However Screeps may not have document; but we can check typeof window.

But to avoid confusion, we can just keep the IIFE as is, but ensure that the functions it uses (like document) are defined; that code will run when the file is loaded in a browser (or jsdom). Since the file may be executed in Node, but the IIFE checks for document existence, it's safe.

Potential conflict: There's a duplicate definition of function3. In HEAD, function3 is defined early; in origin/main, function3 is defined again later. We'll keep one definition; maybe keep the one from HEAD (simple console.log). Ensure not duplicate.

Also there is duplicate createInPageButton: HEAD defines function createInPageButton (in earlier part). origin/main also defines createInPageButton (same). We'll keep one definition.

Also there are duplicate scanAccessibility functions: HEAD defines async function scanAccessibility() that reads directory and uses axe. origin/main also defines async function scanAccessibility that returns a dummy object. We need to reconcile: maybe keep the more complete version (the one that reads files and uses axe) because it adds functionality. However the HEAD version also defines generateAccessibilityReport etc. Let's examine.

HEAD's scanAccessibility:

```
async function scanAccessibility() {
  const filePaths = await fs.promises.readdir(pagesDir);
  const issues = [];

  for (const filePath of filePaths) {
    const fileEmitted = path.join(pagesDir, filePath);
    const { violations } = await axe.analyze(fileEmitted);

    return issues;
  }
}
```

But that code seems truncated; maybe the HEAD version ended prematurely. The origin/main version defines scanAccessibility that returns a dummy object, and generateAccessibilityReport that writes a JSON file.

We need to decide which version to keep. Since the instruction says "keep and integrate both changes if they both add features". The HEAD version includes more robust scanAccessibility (reading files, analyzing with axe). The origin/main version includes generateAccessibilityReport that writes JSON file. Both are<unk><unk><unk><unk><unk><unk><unk><unk><unk>Rip><:<:>ard "<<><<<-F "<<<<<s><>P "<<*F:port,   Open links:  "a(,,-fa:: hipip,1'ngs''''<<' to ,: is,, whereake Rout::... to in