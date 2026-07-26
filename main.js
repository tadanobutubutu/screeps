import os
import sys
import subprocess
import os

# Define paths
SCRIPTS_DIR = os.path.join(os.path.dirname(__file__), 'scripts')
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def run_command(cmd):
    return os.system(f'cmd /c "{cmd}"')

# Define functions
def update_gitstream_action():
    task_id = create_async_update_task('update linear-bots/gitstream-github-action to latest')
    update_dependency('linear-bots/gitstream-github-action', 'latest')

def update_github_codeql_action() {
  try {
    const taskId = await createAsyncUpdateTask('update github/codeql-action to v4');
    await updateDependencyVersions('github/codeql-action', 'v4');
  } catch (error) {
    console.error(`Failed to update github/codeql-action: ${error.message}`);
  }
}

async function updateGitstreamAction() {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action');
    await updateDependencyVersions('linear-bots/gitstream-github-action', 'latest');
    console.log('Successfully updated linear-bots/gitstream-github-action');
  } catch (error) {
    console.error(`Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
}

async function handleGitstreamActionUpdateToLatest() {
  try {
    await updateGitstreamActionToLatest();
    console.log('Successfully updated linear-bots/gitstream-github-action to latest');
  } catch (error) {
    console.error(`Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
}

async function handleRecreateGithubCodeqlActionPR() {
  try {
    const taskId = await createAsyncUpdateTask('recreate github/codeql-action PR');
    await updateDependencyVersions('github/codeql-action', 'v4');
    logging.log('info', 'Successfully recreated github/codeql-action PR');
  } catch (error) {
    logging.log('error', `Failed to recreate github/codeql-action PR: ${error.message}`);
  }
}