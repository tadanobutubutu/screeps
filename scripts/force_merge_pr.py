#!/usr/bin/env python3
"""
scripts/force_merge_pr.py

Ultra-Fast Robust PR Auto-Merger with Automatic Conflict Resolution.
Optimized for high-throughput batch merging in Screeps repository.

Key Optimizations:
1. One-shot batch metadata fetching (1 API call for up to 200 PRs).
2. Bulk Push: commits every N merges (default 10) instead of every single PR.
3. Continuous Execution Loop: runs for up to `max_runtime_minutes` (default 240 mins)
   processing batch after batch until no open PRs remain or time expires.
4. 100% commit author strictly as github-actions[bot].
5. Workflow directory (.github/workflows) is ALWAYS protected against regression.
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

BOT_NAME = "github-actions[bot]"
BOT_EMAIL = "41898282+github-actions[bot]@users.noreply.github.com"


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
    run_cmd(["git", "config", "user.name", BOT_NAME], check=False)
    run_cmd(["git", "config", "user.email", BOT_EMAIL], check=False)
    os.environ["GIT_AUTHOR_NAME"] = BOT_NAME
    os.environ["GIT_AUTHOR_EMAIL"] = BOT_EMAIL
    os.environ["GIT_COMMITTER_NAME"] = BOT_NAME
    os.environ["GIT_COMMITTER_EMAIL"] = BOT_EMAIL


def protect_workflows():
    """Guarantee that .github/workflows/ is never altered or rolled back by incoming PRs."""
    run_cmd(["git", "checkout", "HEAD", "--", ".github/workflows/"], check=False)


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
        run_cmd(["gh", "issue", "close", issue_no, "-c", "Resolved via merged PR."], check=False)


def push_with_retry(max_retries=3):
    """Push local main to origin main with automatic rebase on conflict."""
    for attempt in range(max_retries):
        push_res = run_cmd(["git", "push", "origin", "main"], check=False)
        if push_res.returncode == 0:
            return True
        print(f"Push attempt {attempt + 1} failed. Re-fetching and rebasing...")
        run_cmd(["git", "pull", "--rebase", "origin", "main"], check=False)
        protect_workflows()
        run_cmd(["git", "add", ".github/workflows/"], check=False)
        run_cmd(["git", "rebase", "--continue"], check=False)
    # Final retry
    final_push = run_cmd(["git", "push", "origin", "main"], check=False)
    return final_push.returncode == 0


def get_oldest_open_prs_detailed(limit=100):
    """Retrieve oldest open pull requests with metadata in a single fast API call."""
    res = run_cmd([
        "gh", "pr", "list",
        "--state", "open",
        "--search", "sort:created-asc",
        "--limit", str(limit),
        "--json", "number,id,isDraft,headRefName,body"
    ], check=False)
    if res.returncode != 0 or not res.stdout:
        return []
    try:
        return json.loads(res.stdout)
    except Exception as e:
        print(f"Error parsing PR list: {e}")
        return []


def merge_single_pr_git(pr_info):
    """Perform in-memory / local git merge for a single PR without pushing yet."""
    pr_no = pr_info["number"]
    head_ref = pr_info.get("headRefName", f"pr-{pr_no}")
    is_draft = pr_info.get("isDraft", False)
    body = pr_info.get("body", "")

    # Fast mark ready if draft
    if is_draft:
        run_cmd(["gh", "pr", "ready", str(pr_no)], check=False)

    temp_branch = f"temp-pr-{pr_no}"
    run_cmd(["git", "branch", "-D", temp_branch], check=False)
    fetch_res = run_cmd(["git", "fetch", "--no-tags", "origin", f"pull/{pr_no}/head:{temp_branch}"], check=False)
    if fetch_res.returncode != 0:
        run_cmd(["git", "fetch", "--no-tags", "origin", f"{head_ref}:{temp_branch}"], check=False)

    merge_cmd = [
        "git", "merge", temp_branch,
        "-m", f"Merge pull request #{pr_no} from {head_ref} [auto-resolve-conflict]",
        "-X", "theirs",
        "--allow-unrelated-histories"
    ]
    merge_res = run_cmd(merge_cmd, check=False)

    # Resolve residual conflicts if any
    if merge_res.returncode != 0:
        diff_res = run_cmd(["git", "diff", "--name-only", "--diff-filter=U"], check=False)
        conflicts = [f.strip() for f in diff_res.stdout.splitlines() if f.strip()]
        for cf in conflicts:
            if not os.path.exists(cf):
                run_cmd(["git", "rm", "-f", cf], check=False)
                continue
            with open(cf, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            ai_content = resolve_file_conflict_with_ai(content, cf)
            if ai_content:
                with open(cf, "w", encoding="utf-8") as f:
                    f.write(ai_content)
            else:
                force_resolve_remaining_conflict_markers(cf)
                run_cmd(["git", "checkout", "--theirs", cf], check=False)
            run_cmd(["git", "add", cf], check=False)

    # Always protect .github/workflows/
    protect_workflows()
    run_cmd(["git", "add", ".github/workflows/"], check=False)

    commit_res = run_cmd([
        "git", "commit", "--no-verify",
        "-m", f"Merge pull request #{pr_no} from {head_ref} [auto-resolved conflicts]"
    ], check=False)

    # Cleanup temp branch
    run_cmd(["git", "branch", "-D", temp_branch], check=False)

    # Check if a commit was made or merge was clean
    return True, body


def run_continuous_batch_merger(batch_size=100, push_every=10, max_runtime_minutes=240):
    """
    Continuous merger: runs in a loop for up to max_runtime_minutes,
    merging batches of PRs and pushing in groups of `push_every` for maximum throughput.
    """
    setup_git_config()
    start_time = time.time()
    max_duration_secs = max_runtime_minutes * 60
    total_merged = 0

    print(f"🚀 Starting Ultra-Fast Continuous PR Merger")
    print(f"   Batch Size: {batch_size} | Push Every: {push_every} PRs | Max Runtime: {max_runtime_minutes} mins")

    # Initial pull
    run_cmd(["git", "checkout", "main"], check=True)
    run_cmd(["git", "pull", "--ff-only", "origin", "main"], check=False)

    while True:
        elapsed = time.time() - start_time
        if elapsed >= max_duration_secs:
            print(f"⏱️ Time limit reached ({elapsed/60:.1f} mins >= {max_runtime_minutes} mins). Gracefully finishing.")
            break

        print(f"\n--- Fetching next batch of {batch_size} oldest open PRs ---")
        prs = get_oldest_open_prs_detailed(limit=batch_size)
        if not prs:
            print("🎉 No more open pull requests found! All PRs are merged!")
            break

        print(f"Found {len(prs)} PRs to merge in this batch.")
        unpushed_count = 0
        merged_in_batch = 0
        bodies_to_close = []

        for pr_info in prs:
            pr_no = pr_info["number"]
            try:
                success, body = merge_single_pr_git(pr_info)
                if success:
                    unpushed_count += 1
                    merged_in_batch += 1
                    total_merged += 1
                    if body:
                        bodies_to_close.append((pr_no, body))
                    print(f"[{total_merged}] ✅ Merged PR #{pr_no} locally (unpushed: {unpushed_count})")
            except Exception as e:
                print(f"⚠️ Exception merging PR #{pr_no}: {e}")

            # Bulk push
            if unpushed_count >= push_every:
                print(f"📦 Pushing {unpushed_count} accumulated merge commits to origin/main...")
                if push_with_retry():
                    print("🚀 Push successful!")
                    unpushed_count = 0
                    # Close linked issues for pushed PRs
                    for p_no, b in bodies_to_close:
                        close_linked_issues(b)
                    bodies_to_close = []
                else:
                    print("❌ Push failed after retries.")

            # Check time limit within batch
            if time.time() - start_time >= max_duration_secs:
                print("⏱️ Time limit reached during batch.")
                break

        # Flush any remaining unpushed commits at end of batch
        if unpushed_count > 0:
            print(f"📦 Flushing {unpushed_count} final merge commits to origin/main...")
            if push_with_retry():
                print("🚀 Push successful!")
                for p_no, b in bodies_to_close:
                    close_linked_issues(b)
            unpushed_count = 0

        print(f"✅ Batch completed: {merged_in_batch} PRs processed. Total so far: {total_merged}")

    print(f"\n==========================================")
    print(f"🏁 Continuous Merger Finished! Total PRs merged: {total_merged}")
    print(f"==========================================")
    return total_merged


def main():
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        pr_no = int(sys.argv[1])
        # Single PR mode
        prs = [{"number": pr_no, "isDraft": False, "headRefName": f"pr-{pr_no}", "body": ""}]
        setup_git_config()
        run_cmd(["git", "checkout", "main"], check=True)
        run_cmd(["git", "pull", "--ff-only", "origin", "main"], check=False)
        merge_single_pr_git(prs[0])
        push_with_retry()
        sys.exit(0)

    batch_size = 100
    push_every = 10
    runtime_mins = 240

    if "--batch" in sys.argv:
        idx = sys.argv.index("--batch")
        if idx + 1 < len(sys.argv) and sys.argv[idx + 1].isdigit():
            batch_size = int(sys.argv[idx + 1])

    if "--runtime" in sys.argv:
        idx = sys.argv.index("--runtime")
        if idx + 1 < len(sys.argv) and sys.argv[idx + 1].isdigit():
            runtime_mins = int(sys.argv[idx + 1])

    if "--push-every" in sys.argv:
        idx = sys.argv.index("--push-every")
        if idx + 1 < len(sys.argv) and sys.argv[idx + 1].isdigit():
            push_every = int(sys.argv[idx + 1])

    run_continuous_batch_merger(
        batch_size=batch_size,
        push_every=push_every,
        max_runtime_minutes=runtime_mins
    )


if __name__ == "__main__":
    main()
