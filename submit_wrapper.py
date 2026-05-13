import sys

def print_usage():
    print("Usage: python submit_wrapper.py submit <branch> <message>")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)

    command = sys.argv[1]

    if command == "pre_commit_instructions":
        print("Run the pre_commit_instructions tool")
    elif command == "submit":
        if len(sys.argv) < 4:
            print_usage()
            sys.exit(1)
        branch = sys.argv[2]
        message = sys.argv[3]

        print(f"Submitting PR with branch: {branch}")
        print(f"Message:\n{message}")
