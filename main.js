// Since the actual file contents were not provided, here is the general fix:
// At line 47 of utils.tasks.js, ensure any open block comment /* is properly closed with */
// OR remove the stray /* if it was not intended to start a comment block.
//
// Example fix:
// Before (line 47):  /* this comment is never closed
// After (line 47):   /* this comment is now closed */