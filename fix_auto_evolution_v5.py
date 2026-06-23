with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if (lines[i].strip() == ");"
            and "Memory.evolution.suggestions.shift()" in lines[i - 3]):
        lines[i] = "        // Fixed stray parenthesis\n"

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
