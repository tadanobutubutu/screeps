import sys


def fix():
    with open("main.js", "r") as f:
        lines = f.readlines()

    new_emotion_stats = [
        "function _displayEmotionStats() {\n",
        "    const stats = EmotionSystem.getStats();\n",
        "    console.log('Emotions - Happy: ' + stats.happy + ', Neutral: ' + stats.neutral + ', Sad: ' + stats.sad);\n",
        "}\n",
    ]

    new_gamification_stats = [
        "function _displayGamificationStats() {\n",
        "    const gm = Memory.gamification;\n",
        "    if (gm) console.log('Gamification - Level: ' + (gm.level || 1) + ', XP: ' + (gm.xp || 0));\n",
        "}\n",
    ]

    start_emo = -1
    end_emo = -1
    start_gami = -1
    end_gami = -1

    for i, line in enumerate(lines):
        if "function _displayEmotionStats() {" in line:
            start_emo = i
        if start_emo != -1 and i > start_emo and line.strip() == "}":
            end_emo = i
            break

    for i, line in enumerate(lines):
        if "function _displayGamificationStats() {" in line:
            start_gami = i
        if start_gami != -1 and i > start_gami and line.strip() == "}":
            end_gami = i
            break

    if start_emo != -1 and end_emo != -1 and start_gami != -1 and end_gami != -1:
        # Splice in reverse
        lines[start_gami:end_gami + 1] = new_gamification_stats
        lines[start_emo:end_emo + 1] = new_emotion_stats

        with open("main.js", "w") as f:
            f.writelines(lines)
        print("Successfully fixed main.js stats functions")
    else:
        print(
            f"Failed to find markers: {start_emo} {end_emo} {start_gami} {end_gami}"
        )


if __name__ == "__main__":
    fix()
