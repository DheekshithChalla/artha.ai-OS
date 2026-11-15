#!/usr/bin/env python3
"""
ArthaOS - Python 3 Local Server Alternative
Usage: python3 server.py [PORT]
"""

import http.server
import socketserver
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run():
    port = PORT
    while port < PORT + 10:
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print("\n" + "=" * 63)
                print(f"✨ ArthaOS Python Server Running: http://localhost:{port}")
                print("🏆 Arthathon 2026 Submission • AI for Finance")
                print("=" * 63 + "\n")
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e):
                port += 1
            else:
                raise e

if __name__ == '__main__':
    run()
