with open('auto.evolution.js', 'r') as f:
    lines = f.readlines()

for i in range(len(lines)):
    if 'Memory.evolution.suggestions.shift()' in lines[i]:
        lines[i] = "            Memory.evolution.suggestions.shift();\n        }\n    },\n"
    if 'generateRCLFeatures: function (data) {' in lines[i]:
         j = i - 1
         while j >= 0 and 'Memory.evolution.suggestions.shift()' not in lines[j]:
             lines[j] = ""
             j -= 1

with open('auto.evolution.js', 'w') as f:
    f.writelines(lines)
