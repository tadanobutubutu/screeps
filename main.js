// utils.tasks.js
// ... (previous code remains unchanged)

// The problematic line (line 47) should be fixed by ensuring all comments are properly terminated
// For example, if it was:
/*
 * Some comment
 * <<<<<<< HEAD
 * This is a conflict marker that wasn't properly closed
 * =======
 * This is the resolved version
 * >>>>>>> branch-name
 */

// Should be fixed to:
/*
 * Some comment
 * This is a conflict marker that was properly closed
 */

// ... (rest of the file remains unchanged)