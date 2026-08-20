// Assuming conflict markers are not present in the following template

// ... [existing code before conflict] ...

// >>>>>>>>>> your-repo-branch
// New function or changes requested in the issue
// >>>>>>>>>> your-repo-branch
function newFunction() {
    // ... code for the new function or changes ...
}

// ... [existing code after conflict] ...

// <<<<<<< your-remote-branch
// Any changes made by someone else that conflict with your changes
// <<<<<<< your-remote-branch

// ... [existing code that is common and should be preserved] ...

// ... [existing code after common code] ...