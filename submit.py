import subprocess
import sys

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python submit.py <title> <description_file>")
        sys.exit(1)

    title = sys.argv[1]
    with open(sys.argv[2], "r") as f:
        desc = f.read()

    print(f"Executing: submit '{title}' '{desc}'")
