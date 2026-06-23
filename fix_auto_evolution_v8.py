with open("auto.evolution.js", "r") as f:
    lines = f.readlines()

for i in range(len(lines)):
    if "generateRCLFeatures: function (data) {" in lines[i]:
        # Clear everything between Suggestions and RCL features
        j = i - 1
        while j >= 0 and "Memory.evolution.suggestions.shift()" not in lines[j]:
            lines[j] = ""
            j -= 1
        lines[i - 1] = "    },\n"

with open("auto.evolution.js", "w") as f:
    f.writelines(lines)
