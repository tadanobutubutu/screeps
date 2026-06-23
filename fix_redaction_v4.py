import re


def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Simple replacement of the problematic regexes
    # 1. Path redaction
    content = re.sub(
        r'const pathRedacted = str\.replace\(/\(\\[\^ \n\t"\'\]\*/g, \'\[REDACTED\]\'\)',
        r"const pathRedacted = str.replace(/(?:\/|[a-zA-Z]:\)[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[^ \n\t\"' ]*/g, '[REDACTED]')",
        content,
    )

    # For _redactPaths in utils.logging.js
    content = re.sub(
        r'const pathRedacted = str\.replace\(/\(\\[\^ \n\t"\'\]\*/g, \'\[REDACTED\]\'\)',
        r"const pathRedacted = str.replace(/(?:\/|[a-zA-Z]:\)[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[^ \n\t\"' ]*/g, '[REDACTED]')",
        content,
    )

    # 2. Keywords
    if "[112, 97, 115, 115]" not in content:
        content = content.replace(
            "[112, 97, 115, 115, 119, 111, 114, 100]",
            "[112, 97, 115, 115, 119, 111, 114, 100],\n    [112, 97, 115, 115],\n    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108]",
        )

    with open(filepath, "w") as f:
        f.write(content)


fix_file("deploy.js")
fix_file("utils.logging.js")
