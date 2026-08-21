python
import requests
from textwrap import dedent

# Try to fetch main.js
url_main = "https://raw.githubusercontent.com/tadanobutubutu/screeps/main/main.js"
resp_main = requests.get(url_main)
if resp_main.status_code == 200:
    main_content = resp_main.text
else:
    main_content = None

# Try to fetch docs/dependency-graph.html
url_dep = "https://raw.githubusercontent.com/tadanobutubutu/screeps/main/docs/dependency-graph.html"
resp_dep = requests.get(url_dep)
if resp_dep.status_code == 200:
    dep_content = resp_dep.text
else:
    dep_content = None

print("=== main.js ===")
print(main_content if main_content else "(not found)")
print("\n=== docs/dependency-graph.html ===")
print(dep_content if dep_content else "(not found)")