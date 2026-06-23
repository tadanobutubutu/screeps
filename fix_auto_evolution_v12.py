with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "ticks ago');" in lines[i]:
        lines[i] = (
            "        console.log('Last action: ' + (Game.time - evo.lastActionTick) + ' ticks ago');\n"
        )

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
