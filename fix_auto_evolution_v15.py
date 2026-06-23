with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'if (need) {' in lines[i]:
        lines[i] = "        if (need && !exists) {\n"

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
