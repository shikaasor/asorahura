import base64
import json
import os
import sys
import time
import requests
import websocket

URL = sys.argv[1]
OUT_DIR = sys.argv[2]
POSITIONS = [int(x) for x in sys.argv[3:]] or [0]
os.makedirs(OUT_DIR, exist_ok=True)

# Attach to the first page exposed by the local headless Chromium instance.
for _ in range(60):
    try:
        tabs = requests.get('http://127.0.0.1:9222/json', timeout=2).json()
        pages = [t for t in tabs if t.get('type') == 'page']
        if pages:
            break
    except Exception:
        pass
    time.sleep(0.25)
else:
    raise RuntimeError('No CDP page available')

ws = websocket.create_connection(pages[0]['webSocketDebuggerUrl'], timeout=20, suppress_origin=True)
seq = 0

def cdp(method, params=None, wait=False):
    global seq
    seq += 1
    ident = seq
    ws.send(json.dumps({'id': ident, 'method': method, 'params': params or {}}))
    while True:
        msg = json.loads(ws.recv())
        if msg.get('id') == ident:
            if 'error' in msg:
                raise RuntimeError(msg['error'])
            return msg.get('result', {})
        if wait and msg.get('method') == 'Page.loadEventFired':
            return {}

def eval_js(expr, await_promise=False):
    return cdp('Runtime.evaluate', {'expression': expr, 'returnByValue': True, 'awaitPromise': await_promise}).get('result', {}).get('value')

cdp('Page.enable')
cdp('Runtime.enable')
cdp('Emulation.setDeviceMetricsOverride', {'width': 1280, 'height': 800, 'deviceScaleFactor': 1, 'mobile': False})
cdp('Page.navigate', {'url': URL})
for _ in range(120):
    try:
        state = eval_js('document.readyState')
        if state == 'complete':
            break
    except Exception:
        pass
    time.sleep(0.25)
# Give lazy assets and motion time to settle.
time.sleep(4)
# Hide only fixed overlays locally; do not persist site preferences.
eval_js("""(() => { document.querySelectorAll('*').forEach(el => { const s=getComputedStyle(el); if ((s.position==='fixed' || s.position==='sticky') && el.id==='consent-banner') el.style.display='none'; }); })()""")

for idx, pos in enumerate(POSITIONS):
    # Disable smooth scrolling only for deterministic capture; preserve visual motion.
    eval_js(f"window.scrollTo(0,{pos}); document.documentElement.scrollTop={pos}; document.body.scrollTop={pos};")
    time.sleep(1.2)
    # Force a paint after scroll.
    eval_js('document.body.getBoundingClientRect().top')
    time.sleep(0.4)
    png = cdp('Page.captureScreenshot', {'format':'png', 'captureBeyondViewport': False}).get('data')
    out = os.path.join(OUT_DIR, f'section_{idx:02d}_y{pos}.png')
    with open(out, 'wb') as f:
        f.write(base64.b64decode(png))
    print(out)

ws.close()
સાર = ''
