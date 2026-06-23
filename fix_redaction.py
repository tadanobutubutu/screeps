import re


def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Fix path redaction regex to be more specific
    # Current: /(\/|[a-zA-Z]:\)[^ \n\t"']*/g
    # New: Requires at least one directory and a delimiter to avoid 1.5/10.0 false positive
    content = content.replace(
        r'/(\/|[a-zA-Z]:\)[^ \n\t"\' ]*/g',
        r'/(?:\/|[a-zA-Z]:\)[a-zA-Z0-9._-]+\/(?:[a-zA-Z0-9._-]+\/)*[^ \n\t"\' ]*/g',
    )

    # 2. Add 'pass' to keys if missing
    if "[112, 97, 115, 115]," not in content:
        content = content.replace(
            "[112, 97, 115, 115, 119, 111, 114, 100],",
            "[112, 97, 115, 115, 119, 111, 114, 100],\n    [112, 97, 115, 115],",
        )

    with open(filepath, "w") as f:
        f.write(content)


fix_file("deploy.js")
fix_file("utils.logging.js")
