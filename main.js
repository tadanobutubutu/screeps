// [Your existing main.js content with all exports preserved]

// New function to handle GitStream workflow updates
function updateGitStreamWorkflow() {
  const gitstreamYmlPath = '.github/workflows/gitstream.yml';

  try {
    // Read the existing workflow file
    let content = fs.readFileSync(gitstreamYmlPath, 'utf8');

    // Check if the workflow uses the problematic action
    if (content.includes('linear-bots/gitstream-github-action')) {
      // Update to a more stable version or alternative
      content = content.replace(
        /linear-bots\/gitstream-github-action@v\d+/,
        'linear-bots/gitstream-github-action@v2' // Using v2 as a stable alternative
      );

      // Write the updated content back to the file
      fs.writeFileSync(gitstreamYmlPath, content);
      console.log('Updated gitstream.yml to use a stable version of the GitStream action');
    }
  } catch (error) {
    console.error(`Error updating gitstream.yml: ${error.message}`);
  }
}

// Call the update function during initialization
updateGitStreamWorkflow();

// [Rest of your existing main.js content with all other exports preserved]