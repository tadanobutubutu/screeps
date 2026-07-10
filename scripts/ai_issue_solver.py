import json
import os
import re
import subprocess
import sys
import threading
import time

from ai_providers import (
    call_gemini,
    call_kilo_gateway,
    call_openrouter,
    call_ovh_anonymous,
    call_pollinations_get,
    call_pollinations_post,
    clean_plain_response,
    extract