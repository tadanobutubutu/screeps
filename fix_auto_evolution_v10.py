with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'generateTowerLogic: function () {' in lines[i]:
        j = i - 1
        while j >= 0 and 'Needed:' not in lines[j]:
            lines[j] = ""
            j -= 1
        lines[i-1] = "        );\n    },\n"

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
