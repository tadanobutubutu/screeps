with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'generateProductionOptimization: function (data) {' in lines[i]:
        lines[i+1] = "        return 'Optimization code for ' + data.type;\n    },\n"
        for j in range(i+2, i+10):
            if j < len(lines) and 'generateTowerLogic' not in lines[j]:
                lines[j] = ""
            else:
                break

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
