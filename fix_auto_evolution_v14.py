with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "[0]);" in lines[i]:
        lines[i] = (
            "                console.log(' - ' + s.type + ' (' + s.filename + ')');\n"
        )

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
