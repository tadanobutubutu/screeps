import re


def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Path redaction: escape forward slash and ensure it requires a full path to avoid 1.5/10.0
    # Current: /(\/|[a-zA-Z]:\)[^ \n\t"']*/g
    # Fix: Require at least two path segments and a slash
    content = content.replace(
        r'/(\/|[a-zA-Z]:\)[^ \n\t"\' ]*/g',
        r'/(?:\/[a-zA-Z0-9_-]+){2,}\/[^ \n\t"\' ]*/g',
    )

    # 2. Keywords: Ensure 'pass' and 'credential' are in the list
    # Use the obfuscated char codes for pass [112, 97, 115, 115] and credential [99, 114, 101, 100, 101, 110, 116, 105, 97, 108]
    # 'credential' is [99, 114, 101, 100, 101, 110, 116, 105, 97, 108]
    # 'credentials' is [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115]
    # We want to match 'credential' which will also match 'credentials' due to the regex

    if "[112, 97, 115, 115]" not in content:
        content = content.replace(
            "[112, 97, 115, 115, 119, 111, 114, 100]",
            "[112, 97, 115, 115, 119, 111, 114, 100],\n    [112, 97, 115, 115]",
        )

    with open(filepath, "w") as f:
        f.write(content)


fix_file("deploy.js")
fix_file("utils.logging.js")
