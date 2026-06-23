with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "// Removed broken call" in lines[i]:
        lines[i] = "        );\n    },\n"

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
