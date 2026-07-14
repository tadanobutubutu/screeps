import subprocess
print(subprocess.run(["node", "-e", "console.log('hi')"], capture_output=True, text=True))
