// We need to apply the specific formatting fixes CodeFactor complained about.
// However, CodeFactor is failing because in my *previous* commit I introduced some formatting errors.
// Looking at the CodeFactor log from the previous run:
/*
  [WARNING] File: tests/utils.defense.test.js, Line: 84
    Message: Insert `;` (prettier/prettier)
  [WARNING] File: utils.defense.js, Line: 1
    Message: Insert `;` (prettier/prettier)
  [WARNING] File: tests/utils.defense.test.js, Line: 83
    Message: Replace `··})` with `····});` (prettier/prettier)
    ... etc
*/
// The commit da18e490762caa245e5b763b1ef474588ad259f8 actually introduced these.
// Wait! `npx prettier --write ...` just ran and said "(unchanged)".
// Ah, the repo has `.prettierrc.json` with 4-space indent, but `tests/utils.defense.test.js` may have had 2-space before?
