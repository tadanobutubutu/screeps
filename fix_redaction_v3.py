import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Path regex: must have at least one directory AND a delimiter to avoid 1.5/10.0
    # We'll use a pattern that matches /dir/file or /dir/dir/
    content = re.sub(r'str\.replace\(/\(\\[\^ \n\t"\'\]\*/g, \'\[REDACTED\]\'\)',
                     r"str.replace(/(?:\/|[a-zA-Z]:\)[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/[^ \n\t\"' ]*/g, '[REDACTED]')", content)
    # Also handle the version I might have already replaced
    content = re.sub(r'str\.replace\(/\(\?:\/\^ \n\t"\' \] \*/g, \'\[REDACTED\]\'\)',
                     r"str.replace(/(?:\/|[a-zA-Z]:\)[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+\/[^ \n\t\"' ]*/g, '[REDACTED]')", content)

    # Keywords: add pass and credential if not there
    if '112, 97, 115, 115' not in content:
        content = content.replace('[112, 97, 115, 115, 119, 111, 114, 100]', '[112, 97, 115, 115, 119, 111, 114, 100],\n    [112, 97, 115, 115],\n    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108]')

    with open(filepath, 'w') as f:
        f.write(content)

fix_file('deploy.js')
fix_file('utils.logging.js')
