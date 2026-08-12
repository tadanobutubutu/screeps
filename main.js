// role.healer.js
function heal(health) {
  if (health < 0) {
    health = 0; // Fix: Add semicolon here
  }
  console.log(`Health: ${health}`);
}