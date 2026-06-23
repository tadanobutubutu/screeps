import sys


def fix():
    with open("main.js", "r") as f:
        lines = f.readlines()

    # Fix _displayCoreStats (approx lines 516-525)
    new_display_core_stats = [
        "function _displayCoreStats(creeps) {\n",
        "    console.log('--- CORE STATS ---');\n",
        "    console.log('Mode: ' + adaptiveSystem.getModeName(Memory.adaptive?.currentMode ?? 2).toUpperCase());\n",
        "    console.log('Creeps: ' + creeps.length);\n",
        "    console.log('CPU: ' + Game.cpu.getUsed().toFixed(2) + '/' + Game.cpu.limit + ' (Bucket: ' + Game.cpu.bucket + ')');\n",
        "    console.log('Memory: ' + (RawMemory.get().length / 1024).toFixed(1) + ' KB');\n",
        "}\n",
    ]

    # Fix global.help (approx lines 806-815)
    new_help = [
        "global.help = function () {\n",
        "    console.log('--- COMMANDS ---');\n",
        "    console.log('adaptive() - system dashboard');\n",
        "    console.log('mode(val) - force mode');\n",
        "    console.log('e() - emotion stats');\n",
        "    console.log('ec(name) - check creep');\n",
        "    console.log('m() - memory stats');\n",
        "}\n",
    ]

    # Identify indices
    start_stats = -1
    end_stats = -1
    start_help = -1
    end_help = -1

    for i, line in enumerate(lines):
        if "function _displayCoreStats(creeps) {" in line:
            start_stats = i
        if start_stats != -1 and i > start_stats and line.strip() == "}":
            end_stats = i
            break

    for i, line in enumerate(lines):
        if "global.help = function () {" in line:
            start_help = i
        if start_help != -1 and i > start_help and line.strip() == "};":
            end_help = i
            break

    if start_stats != -1 and end_stats != -1 and start_help != -1 and end_help != -1:
        # Splice in reverse to not break indices
        lines[start_help:end_help + 1] = new_help
        lines[start_stats:end_stats + 1] = new_display_core_stats

        with open("main.js", "w") as f:
            f.writelines(lines)
        print("Successfully fixed main.js")
    else:
        print(
            f"Failed to find markers: {start_stats} {end_stats} {start_help} {end_help}"
        )


if __name__ == "__main__":
    fix()
