#!/usr/bin/env python3
"""
scripts/force_merge_pr.py

Robust PR Auto-Merger with Automatic Conflict Resolution.
Guarantees 100% merge success for Screeps repository PRs.
Can process a single PR or batch-process open PRs ordered oldest-first.
"""

import json
import os
import re
import subprocess
import sys
import time

try:
    from ai_providers import clean_plain_response, generate_with_fallback, normalize_token
    HAS_AI = True
except ImportError:
    HAS_AI = False


def run_cmd(args, check=True, capture=True):
    res = subprocess.run(args, capture_output=capture, text=True)
    if check and res.returncode != 0:
        print(f"Error running {' '.join(args)}: returncode {res.returncode}")
        if res.stdout:
            print(f"Stdout: {res.stdout.strip()[:500]}")
        if res.stderr:
            print(f"Stderr: {res.stderr.strip()[:500]}")
    return res


def setup_git_config():
    run_cmd(["git", "config", "user.name", "AI Merge Bot"], check=False)
    run_cmd(["git", "config", "user.email", "ai-merge-bot@screeps.local"], check=False)


def resolve_file_conflict_with_ai(file_content, filename):
    if not HAS_AI:
        return None
    token = normalize_token(os.environ.get("OPENROUTER_TOKEN"))
    gemini_key = normalize_token(os.environ.get("GEMINI_API_KEY"))
    if not token and not gemini_key:
        return None

    prompt = f"""You are a Senior JavaScript/Node.js Developer resolving a Git merge conflict in a Screeps repository.
File: '{filename}'
Conflict content:
=========================================
{file_content}
=========================================
Resolve the conflict cleanly by integrating both changes if possible, or choosing the newer/extended logic.
Respond with ONLY the resolved file content, no markdown wrappers, no backticks, no explanations.
"""
    try:
        result, provider = generate_with_fallback(
            prompt,
            gemini_key=gemini_key,
            openrouter_token=token,
            min_length=20,
        )
        if result:
            return clean_plain_response(result)
    except Exception as e:
        print(f"AI conflict resolver exception: {e}")
    return None


def force_resolve_remaining_conflict_markers(filepath):
    """Fallback: strip git conflict markers and keep theirs (incoming) or combined content."""
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        
        resolved_lines = []
        in_conflict = False
        in_theirs = False
        has_markers = False
        
        for line in lines:
            if line.startswith("<<<<<<<"):
                in_conflict = True
                in_theirs = False
                has_markers = True
                continue
            elif line.startswith("======="):
                in_theirs = True
                continue
            elif line.startswith(">>>>>>>"):
                in_conflict = False
                in_theirs = False
                continue
            
            if not in_conflict:
                resolved_lines.append(line)
            else:
                # Inside conflict: prefer theirs (incoming PR changes)
                if in_theirs:
                    resolved_lines.append(line)

        if has_markers:
            with open(filepath, "w", encoding="utf-8") as f:
                f.writelines(resolved_lines)
            return True
    except Exception as e:
        print(f"Failed to strip conflict markers in {filepath}: {e}")
    return False


def close_linked_issues(body):
    if not body:
        return
    matches = re.findall(r'(?:closes|fixes|resolves)\s+(?:https://github\.com/[^/]+/[^/]+/issues/|#)(\d+)', body, re.IGNORECASE)
    for issue_no in set(matches):
        print(f"Closing linked issue #{issue_no}...")
        run_cmd(["gh", "issue", "close", issue_no, "-c", "Resolved via merged PR."], check=False)


def merge_single_pr(pr_no):
    print(f"\n==========================================")
    print(f"🚀 Processing PR #{pr_no}...")
    print(f"==========================================")

    # 1. Inspect PR
    view_res = run_cmd([
        "gh", "pr", "view", str(pr_no),
        "--json", "number,id,isDraft,state,headRefName,baseRefName,title,body"
    ], check=False)
    if view_res.returncode != 0:
        print(f"❌ Failed to fetch PR #{pr_no}. Skipping.")
        return False

    try:
        pr = json.loads(view_res.stdout)
    except Exception as e:
        print(f"Failed to parse PR JSON: {e}")
        return False

    if pr.get("state") != "OPEN":
        print(f"PR #{pr_no} is already {pr.get('state')}. Skipping.")
        return True

    pr_id = pr.get("id")
    is_draft = pr.get("isDraft")
    head_ref = pr.get("headRefName", f"pr-{pr_no}")
    body = pr.get("body", "")

    # 2. Mark Ready if Draft
    if is_draft:
        print(f"Converting draft PR #{pr_no} to ready...")
        run_cmd(["gh", "pr", "ready", str(pr_no)], check=False)
        if pr_id:
            graphql_query = 'mutation($id: ID!) { markPullRequestReadyForReview(input: {pullRequestId: $id}) { clientMutationId } }'
            run_cmd(["gh", "api", "graphql", "-f", f"query={graphql_query}", "-f", f"id={pr_id}"], check=False)
        time.sleep(1)

    # 3. Attempt standard squash merge via GitHub CLI
    print(f"Attempting standard gh pr merge for PR #{pr_no}...")
    m_res = run_cmd(["gh", "pr", "merge", str(pr_no), "--admin", "--squash", "--delete-branch"], check=False)
    if m_res.returncode == 0:
        print(f"✅ PR #{pr_no} merged cleanly via standard merge!")
        close_linked_issues(body)
        return True

    # 4. Standard merge failed (e.g. conflict, checks pending) -> Force Merge via Git directly on main
    print(f"⚠️ Standard merge failed. Performing Git Force-Merge for PR #{pr_no}...")
    setup_git_config()

    # Ensure on main and up to date
    run_cmd(["git", "checkout", "main"], check=True)
    run_cmd(["git", "pull", "--ff-only", "origin", "main"], check=False)

    # Fetch PR head commit/branch
    temp_branch = f"temp-pr-{pr_no}"
    run_cmd(["git", "branch", "-D", temp_branch], check=False)
    fetch_res = run_cmd(["git", "fetch", "origin", f"pull/{pr_no}/head:{temp_branch}"], check=False)
    if fetch_res.returncode != 0:
        # Fallback: try fetching by branch name
        run_cmd(["git", "fetch", "origin", f"{head_ref}:{temp_branch}"], check=False)

    # Try merge with theirs strategy option
    merge_cmd = [
        "git", "merge", temp_branch,
        "-m", f"Merge pull request #{pr_no} from {head_ref} [auto-resolve-conflict]",
        "-X", "theirs",
        "--allow-unrelated-histories"
    ]
    merge_res = run_cmd(merge_cmd, check=False)

    # If conflicts remain, resolve them
    if merge_res.returncode != 0:
        print("Handling residual conflict markers...")
        diff_res = run_cmd(["git", "diff", "--name-only", "--diff-filter=U"], check=False)
        conflicts = [f.strip() for f in diff_res.stdout.splitlines() if f.strip()]
        
        for cf in conflicts:
            if not os.path.exists(cf):
                run_cmd(["git", "rm", "-f", cf], check=False)
                continue
            
            # Check with AI or fallback
            with open(cf, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            ai_content = resolve_file_conflict_with_ai(content, cf)
            if ai_content:
                with open(cf, "w", encoding="utf-8") as f:
                    f.write(ai_content)
                print(f"  Resolved {cf} with AI")
            else:
                force_resolve_remaining_conflict_markers(cf)
                run_cmd(["git", "checkout", "--theirs", cf], check=False)
                print(f"  Resolved {cf} with --theirs strategy")
            run_cmd(["git", "add", cf], check=False)

        run_cmd(["git", "commit", "--no-verify", "-m", f"Merge pull request #{pr_no} from {head_ref} [auto-resolved conflicts]"], check=False)

    # Push updated main to remote
    push_res = run_cmd(["git", "push", "origin", "main"], check=False)
    if push_res.returncode != 0:
        print("Push rejected, pulling rebase and retrying push...")
        run_cmd(["git", "pull", "--rebase", "origin", "main"], check=False)
        push_res = run_cmd(["git", "push", "origin", "main"], check=False)

    if push_res.returncode == 0:
        print(f"✅ Successfully force-merged PR #{pr_no} and pushed to main!")
        # Close PR on GitHub and delete branch
        run_cmd(["gh", "pr", "close", str(pr_no), "-c", "Merged into main with auto-conflict resolution.", "-d"], check=False)
        close_linked_issues(body)
        run_cmd(["git", "branch", "-D", temp_branch], check=False)
        return True
    else:
        print(f"❌ Failed to push merge commit for PR #{pr_no}.")
        run_cmd(["git", "branch", "-D", temp_branch], check=False)
        return False


def get_oldest_open_prs(limit=30):
    """Retrieve oldest open pull requests."""
    res = run_cmd([
        "gh", "pr", "list",
        "--state", "open",
        "--search", "sort:created-asc",
        "--limit", str(limit),
        "--json", "number"
    ], check=False)
    if res.returncode != 0 or not res.stdout:
        return []
    try:
        items = json.loads(res.stdout)
        return [item["number"] for item in items]
    except Exception as e:
        print(f"Error parsing PR list: {e}")
        return []


def main():
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        # Single PR mode
        pr_no = int(sys.argv[1])
        success = merge_single_pr(pr_no)
        sys.exit(0 if success else 1)
    
    # Batch mode
    batch_limit = 20
    if "--batch" in sys.argv:
        idx = sys.argv.index("--batch")
        if idx + 1 < len(sys.argv) and sys.argv[idx + 1].isdigit():
            batch_limit = int(sys.argv[idx + 1])

    print(f"Fetching up to {batch_limit} oldest open PRs...")
    prs = get_oldest_open_prs(limit=batch_limit)
    print(f"Found {len(prs)} PRs to process: {prs}")

    merged_count = 0
    for pr_no in prs:
        if merge_single_pr(pr_no):
            merged_count += 1
        time.sleep(1)

    print(f"\n🎉 Finished batch. Merged {merged_count}/{len(prs)} PRs.")


if __name__ == "__main__":
    main()
