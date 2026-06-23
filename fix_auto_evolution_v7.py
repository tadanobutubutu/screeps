with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if "generateRCLFeatures: function (data) {" in line:
        # Check if we have too many closing braces before this
        while new_lines and (new_lines[-1].strip() == "},"
                             or new_lines[-1].strip() == "}"):
            new_lines.pop()
        new_lines.append("    },\n")
    new_lines.append(line)

with open("auto.evolution.js", "w") as f:
    f.writelines(new_lines)
