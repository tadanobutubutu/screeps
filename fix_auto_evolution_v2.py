with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if (lines[i].strip() == ");" and i > 0
            and "Memory.evolution.suggestions.shift()" in lines[i - 2]):
        lines[i] = "        console.log('Suggestion generated');\n"

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
