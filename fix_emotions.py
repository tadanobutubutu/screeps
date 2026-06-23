import sys


def fix():
    with open("utils.emotions.js", "r") as f:
        lines = f.readlines()

    new_check_creep = [
        "    static checkCreep(creepName) {\n",
        "        if (!utilsMemory.isSafeKey(creepName)) return;\n",
        "        const creep = Game.creeps[creepName];\n",
        "        if (!creep) return;\n",
        "        this.initialize(creep);\n",
        "        const emotions = creep.memory.emotions;\n",
        "        console.log('--- EMOTION CHECK: ' + creepName + ' ---');\n",
        "        console.log('Mood: ' + this.getMoodDescription(creep));\n",
        "        console.log('Experience: ' + emotions.experiencePoints);\n",
        "        console.log('Personality: ' + emotions.personalityTraits);\n",
        "        if (emotions.achievements.length > 0) {\n",
        "            console.log('Achievements:');\n",
        "            emotions.achievements.forEach(a => console.log(' - ' + a.name + ' (Tick: ' + a.tick + ')'));\n",
        "        }\n",
        "    }\n",
    ]

    start = -1
    end = -1
    for i, line in enumerate(lines):
        if "static checkCreep(creepName) {" in line:
            start = i
            for j in range(i + 1, len(lines)):
                if lines[j].strip() == "}":
                    if j + 1 < len(lines) and lines[j + 1].strip() == "}":
                        end = j
                        break
            break

    if start != -1 and end != -1:
        lines[start:end + 1] = new_check_creep
        with open("utils.emotions.js", "w") as f:
            f.writelines(lines)
        print("Successfully fixed utils.emotions.js")
    else:
        print(f"Failed to find markers: {start} {end}")


if __name__ == "__main__":
    fix()
