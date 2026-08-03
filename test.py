import urllib.request
import json
import os

repo = os.environ.get('GITHUB_REPOSITORY', 'tadanobutubutu/screeps')
url = f"https://api.github.com/repos/{repo}/check-runs/91674621794"
print(url)
