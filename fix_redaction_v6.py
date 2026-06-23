def fix_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # Improved path regex: match /a/b (Unix) or C:\a\b (Windows)
    # The [a-zA-Z0-9_-] set might be too restrictive for all systems, but let's try to match segments
    # Current regex: /(?:\/|[a-zA-Z]:\\)[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[^ \n\t"' ]*/g
    # Windows paths use backslashes, so we need to account for those.

    better_regex = r"/(?:\/|[a-zA-Z]:\\)(?:[a-zA-Z0-9._-]|[^\x00-\x7F])+(?:[\/\\](?:[a-zA-Z0-9._-]|[^\x00-\x7F])+)+[\/\\]?[^ \n\t\"' ]*/g"

    content = content.replace(
        "/(?:\\/|[a-zA-Z]:\\\\)[a-zA-Z0-9_-]+\\/[a-zA-Z0-9_-]+\\/[^ \\n\\t\"' ]*/g",
        better_regex,
    )

    with open(filepath, "w") as f:
        f.write(content)


fix_file("deploy.js")
fix_file("utils.logging.js")
