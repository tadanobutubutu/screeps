import sys


def fix_auto_evolution():
    with open("auto.evolution.js", "r") as f:
        lines = f.readlines()

    # Locate the broken log (approx line 348)
    # The snippet showed:
    #         if (need === undefined || need === null) {
    #             need.timestamp = Game.time;
    #             Memory.evolution.queue.push(need);
    #             ');
    #         }

    for i in range(len(lines)):
        if "if (need === undefined || need === null) {" in lines[i]:
            # This logic is also broken because it tries to set property on null
            lines[i] = "        if (need) {\n"
            if i + 3 < len(lines) and "');" in lines[i + 3]:
                lines[
                    i +
                    3] = "            console.log('Added to evolution queue');\n"

    with open("auto.evolution.js", "w") as f:
        f.writelines(lines)


def fix_daily_challenge():
    with open("daily-challenge.js", "r") as f:
        lines = f.readlines()

    # Locate broken template literal
    for i in range(len(lines)):
        if "`);" in lines[i]:
            lines[i] = "        console.log('Progress: ' + percent + '%');\n"

    with open("daily-challenge.js", "w") as f:
        f.writelines(lines)


fix_auto_evolution()
fix_daily_challenge()
