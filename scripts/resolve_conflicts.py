import json
import os
import subprocess
import sys

from ai_providers import clean_plain_response, generate_with_fallback, normalize_token


def run_cmd(args, check=True):
    print(f"Executing: {' '.join(args)}")
    res = subprocess.run(args, capture_output=True, text=True)
    if check and res.returncode != 0:
        print(f"Error executing command: {' '.join(args)}")
        print(f"Stdout: {res.stdout}")
        print(f"Stderr: {res.stderr}")
        raise subprocess.CalledProcessError(
            res.returncode, args, res.stdout, res.stderr
        )
    return res


def call_conflict_resolver_ai(file_content, filename):
    token = normalize_token(os.environ.get("OPENROUTER_TOKEN"))
    gemini_key = normalize_token(os.environ.get("GEMINI_API_KEY"))

    prompt = f"""You are a Senior JavaScript/Node.js Developer resolving a Git merge conflict in a Screeps bot repository.
Below is the content of the file '{filename}' with Git conflict markers.
Please resolve the conflict in a meaningful, logical manner. Make sure to keep and integrate both changes if they both add features, or choose the correct logic that compiles and satisfies both needs. Do not discard functionality unless they are clearly redundant.
Do not introduce syntax errors, and preserve comments and style as much as possible.

Respond with ONLY the complete resolved file content. Do NOT wrap in markdown code blocks (such as ```javascript) and do NOT add any conversational explanation before or after the code.

Here is the conflicting file:
=========================================
{file_content}
=========================================
"""

    result, provider = generate_with_fallback(
        prompt,
        gemini_key=gemini_key,
        openrouter_token=token,
        min_length=50,
    )
    if result:
        print(f"Conflict resolution succeeded via {provider}")
        return clean_plain_response(result)
    return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python resolve_conflicts.py <PR_NUMBER>")
        sys.exit(1)

    pr_no = sys.argv[1]
    if not pr_no.isdigit():
        print("Error: PR number must be a numeric integer.")
        sys.exit(1)
    print(f"Resolving conflicts for PR #{pr_no}...")

    # Configure Git
    run_cmd(["git", "config", "--global", "user.name", "AI Merge Bot"])
    run_cmd(["git", "config", "--global", "user.email", "ai-merge-bot@screeps.local"])

    # Checkout PR branch
    run_cmd(["gh", "pr", "checkout", pr_no])

    # Get branch information
    pr_info_res = run_cmd(
        [
            "gh",
            "pr",
            "view",
            pr_no,
            "--json",
            "headRefName,headRepositoryOwner,baseRefName",
        ],
        check=True,
    )
    pr_info = json.loads(pr_info_res.stdout)
    head_branch = pr_info.get("headRefName")
    base_branch = pr_info.get("baseRefName", "main")
    head_owner = pr_info.get("headRepositoryOwner", {}).get("login")

    print(
        f"Head branch: {head_branch}, Base branch: {base_branch}, Head owner: {head_owner}"
    )

    # Fetch main/base branch
    run_cmd(["git", "fetch", "origin", base_branch])

    # Try to merge base branch into the head branch
    merge_res = subprocess.run(
        ["git", "merge", f"origin/{base_branch}"], capture_output=True, text=True
    )
    if merge_res.returncode == 0:
        print("Merge completed cleanly without conflicts. Pushing updates...")
        run_cmd(["git", "push", "origin", f"HEAD:{head_branch}"])
        print("Push completed successfully.")
        return

    # Check for conflicts
    conflicts_res = run_cmd(
        ["git", "diff", "--name-only", "--diff-filter=U"], check=True
    )
    conflicting_files = [
        f.strip() for f in conflicts_res.stdout.splitlines() if f.strip()
    ]

    if not conflicting_files:
        print("No conflicting files found despite non-zero merge return code.")
        sys.exit(1)

    print(f"Found conflicting files: {conflicting_files}")

    for filename in conflicting_files:
        if not os.path.exists(filename):
            print(f"File {filename} does not exist. Skipping.")
            continue

        with open(filename, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        resolved_content = call_conflict_resolver_ai(content, filename)
        if resolved_content:
            with open(filename, "w", encoding="utf-8") as f:
                f.write(resolved_content)
            run_cmd(["git", "add", filename])
            print(f"Successfully resolved conflicts in '{filename}' using AI.")
        else:
            print(
                f"Failed to resolve conflicts in '{filename}' using AI. Falling back to basic resolution (using HEAD content)."
            )
            # Fallback to keeping HEAD changes
            run_cmd(["git", "checkout", "--ours", filename])
            run_cmd(["git", "add", filename])

    # Commit the merge resolution
    run_cmd(
        [
            "git",
            "commit",
            "-m",
            f"chore: AI resolved merge conflicts from {base_branch}",
        ]
    )

    # Push to origin
    run_cmd(["git", "push", "origin", "--", f"HEAD:{head_branch}"])
    print(f"Successfully resolved conflicts and pushed to {head_branch}.")


if __name__ == "__main__":
    main()
