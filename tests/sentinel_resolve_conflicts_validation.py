import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scripts")))
from resolve_conflicts import is_safe_branch_name


class TestResolveConflictsValidation(unittest.TestCase):
    def test_is_safe_branch_name(self):
        valid_branches = [
            "main",
            "feature/login-fix",
            "fix_123",
            "v1.0.0",
            "dependabot/npm_and_yarn/lodash-4.17.21",
        ]
        invalid_branches = [
            "--upload-pack=evil",
            "-b",
            "--help",
            ";rm -rf /",
            "branch with spaces",
            "head;calc",
            "",
            None,
        ]

        for b in valid_branches:
            self.assertTrue(is_safe_branch_name(b), f"Expected valid branch: {b}")

        for b in invalid_branches:
            self.assertFalse(is_safe_branch_name(b), f"Expected invalid branch: {b}")


if __name__ == "__main__":
    unittest.main()
