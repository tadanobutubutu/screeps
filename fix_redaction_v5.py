def fix_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    new_lines = []
    for line in lines:
        if 'const pathRedacted = str.replace(/(\\/' in line:
            line = line.replace("/(\\/|[a-zA-Z]:\\\\)[^ \\n\\t\"']*/g", "/(?:\\/|[a-zA-Z]:\\\\)[a-zA-Z0-9_-]+\\/[a-zA-Z0-9_-]+\\/[^ \\n\\t\"' ]*/g")
        if '[112, 97, 115, 115, 119, 111, 114, 100]' in line:
            line = line.replace('[112, 97, 115, 115, 119, 111, 114, 100]', '[112, 97, 115, 115, 119, 111, 114, 100],\n    [112, 97, 115, 115],\n    [99, 114, 101, 100, 101, 110, 116, 105, 97, 108]')
        new_lines.append(line)

    with open(filepath, 'w') as f:
        f.writelines(new_lines)

fix_file('deploy.js')
fix_file('utils.logging.js')
