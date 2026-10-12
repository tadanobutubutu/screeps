import json

def load_jsonl(path):
    """Robust loader: handles concatenated JSON objects and newline-separated ones."""
    dec = json.JSONDecoder()
    data = open(path, encoding='utf-8').read()
    idx = 0
    out = []
    n = len(data)
    while idx < n:
        while idx < n and data[idx] in ' \t\r\n':
            idx += 1
        if idx >= n:
            break
        obj, end = dec.raw_decode(data, idx)
        out.append(obj)
        idx = end
    return out
