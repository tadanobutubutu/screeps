// Main entry point for the GitHub Action
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  try {
    // Get action inputs
    const token = core.getInput('github_token', { required: true });
    const owner = core.getInput('owner', { required: false });
    const repo = core.getInput('repo', { required: false });

    // Initialize GitHub client
    const octokit = github.getOctokit(token);
    const context = github.context;

    const ownerName = owner || context.repo.owner;
    const repoName = repo || context.repo.repo;

    // Get repository information
    const { data: repoData } = await octokit.rest.repos.get({
      owner: ownerName,
      repo: repoName,
    });

    // Set outputs for use in subsequent steps
    core.setOutput('repo_name', repoData.name);
    core.setOutput('repo_full_name', repoData.full_name);
    core.setOutput('repo_description', repoData.description || '');

    console.log(`Processed repository: ${repoData.full_name}`);
    console.log(`Description: ${repoData.description || 'No description provided'}`);

    // Add your custom logic here

  } catch (error) {
    core.setFailed(error.message);
    console.error('Error:', error);
  }
}

// Run the action
run();

module.exports = { run };