with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if lines[i].strip() == ');':
        lines[i] = "        // Removed broken call\n"

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
