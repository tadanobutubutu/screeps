// Existing code (preserve as is)

// New function
function runGitstream() {
  // Add the logic for running gitstream here, using the linear-bots/gitstream-github-action library
  // Replace <YOUR_GITHUB_TOKEN> with your actual GitHub token
  const options = {
    githubToken: '<YOUR_GITHUB_TOKEN>',
  };
  require('linear-bots/gitstream-github-action').run(options);
}

// Existing code (preserve as is)

module.exports = {
  // Existing exports (preserve as is)
};