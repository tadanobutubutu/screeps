import subprocess

def run_command(command):
    try:
        result = subprocess.run(command, check=True, shell=True, capture_output=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {command}")
        print(f"Stdout: {e.stdout}")
        print(f"Stderr: {e.stderr}")
        return None

# The original branch is exactly what we need, the previous commands failed to push due to MCP constraints, so I'll just submit from here.
