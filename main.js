/**
 * Main application entry point
 */

function main () {
  console.log('Application started')
}

// Export for testing/compatibility
module.exports = {
  main
}

// Run if executed directly
if (require.main === module) {
  main()
}
