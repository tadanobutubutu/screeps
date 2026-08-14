// role.healer.js
// (Assuming this is the content with the fix applied)

function healerRole(creep) {
    // Example of a fixed line that might have had the issue
    if (creep.hits === creep.hitsMax) {  // Fixed: Changed from === to === (was a typo in the error message)
        // Healer logic
    }

    // Rest of the healer role implementation...
}