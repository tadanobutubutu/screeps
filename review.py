import urllib.request
import json
import os
import sys

def submit_for_review():
    url = "http://127.0.0.1:8000/review"
    try:
        req = urllib.request.Request(url, method="POST")
        req.add_header("Content-Type", "application/json")
        data = json.dumps({}).encode("utf-8")

        with urllib.request.urlopen(req, data=data) as response:
            result = json.loads(response.read().decode("utf-8"))
            print(result)
            return result
    except Exception as e:
        print(f"Code review service not available or failed: {e}")
        return None

if __name__ == "__main__":
    submit_for_review()
