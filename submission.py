import sys
import subprocess

def submit():
    try:
        subprocess.check_call(['git', 'add', '-A'])
        subprocess.check_call(['git', 'commit', '--amend', '--no-edit'])
        print("Submitted.")
    except Exception as e:
        print(e)
