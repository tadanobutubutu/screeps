import subprocess
print(subprocess.run(["docker", "run", "--rm", "node:20-alpine", "node", "-v"], capture_output=True, text=True))
