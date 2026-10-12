"""Parsing / verification helpers for automaintainer-bot TODO issues."""
import hashlib
import re

def parse_issue_body(body):
    """Return dict(file, line, todo_text, commit, todo_hash)."""
    body = body or ''
    m_file = re.search(r'of `([^`]+)`', body)
    f = m_file.group(1) if m_file else None
    line = None
    m_line = re.search(r'\*\*Line (\d+)\*\*', body)
    if m_line:
        line = int(m_line.group(1))
    rest = body[m_file.end():] if m_file else body
    todo = None
    m = re.search(r'```\n(.*?)\n```', rest, re.S)
    if m:
        todo = m.group(1)
    else:
        m = re.search(r'`([^`\n]+)`', rest)
        if m:
            todo = m.group(1)
    hits = re.findall(r'todo-hash: ([0-9a-f]+)', body)
    th = hits[-1] if hits else None
    hits = re.findall(r'_Commit: ([0-9a-f]+)_', body)
    commit = hits[-1] if hits else None
    return {'file': f, 'line': line, 'todo_text': todo, 'commit': commit, 'todo_hash': th}


def verify_hash(parsed):
    """sha1(file + ':' + todo_text) should equal todo-hash."""
    if not parsed['file'] or parsed['todo_text'] is None or not parsed['todo_hash']:
        return False
    return hashlib.sha1((parsed['file'] + ':' + parsed['todo_text']).encode()).hexdigest() == parsed['todo_hash']


FIX_MARKERS = ('— FIXED', '– FIXED', '✓ FIXED', '✅ FIXED', 'FIXED:', 'DONE:')


def has_fix_marker(text):
    if not text:
        return False
    return any(mk in text for mk in FIX_MARKERS)
