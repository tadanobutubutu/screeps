with open("scripts/ai_issue_solver.py", "r") as f:
    content = f.read()

new_content = content.replace(
'''def main():
    issue_no = os.environ.get("ISSUE_NUMBER")''',
'''def main():
    """Main entry point for the AI issue solver."""
    issue_no = os.environ.get("ISSUE_NUMBER")'''
)

with open("scripts/ai_issue_solver.py", "w") as f:
    f.write(new_content)
