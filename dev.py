"""Local preview server; no production backend is required."""
import argparse
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
parser=argparse.ArgumentParser()
parser.add_argument('--port',type=int,default=8000)
parser.add_argument('--host',default='127.0.0.1')
args,_=parser.parse_known_args()
print(f'GYMLOG preview: http://{args.host}:{args.port}',flush=True)
ThreadingHTTPServer((args.host,args.port),SimpleHTTPRequestHandler).serve_forever()
