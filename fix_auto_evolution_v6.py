with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'generateRCLFeatures: function (data) {' in lines[i]:
        if '},' in lines[i-1] and '},' in lines[i-2]:
             lines[i-1] = ""

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
