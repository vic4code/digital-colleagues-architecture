"""Read-only, pinned source extracts for the browser. Never read credentials."""
from pathlib import Path
import json, subprocess, hashlib

R = Path(__file__).resolve().parents[1]
P = R.parent.parent / 'prjt-digital-colleague-prototype'
PIN = 'bb7101c3cfca32ea2982268de47958bea648df98'
specs = {
 'dispatch': ('src/runtime/local-service.ts',849,858),
 'admission': ('src/runtime/local-service.ts',861,877),
 'gateway': ('src/gateway/standalone.ts',535,568),
 'adapter': ('src/runtime/openclaw-gateway.ts',184,214),
 'inbound': ('src/m365/inbound-runtime.ts',109,143),
 'receipts': ('src/m365/inbound-receipts.ts',45,68),
 'events': ('src/events/events.ts',15,33),
}
extracts={}
for key,(file,start,end) in specs.items():
    # Read the immutable Git blob, not a potentially edited working tree.
    raw=subprocess.check_output(['git','-C',str(P),'show',PIN+':'+file],text=True)
    code='\n'.join(raw.splitlines()[start-1:end])
    extracts[key]={'path':file,'start':start,'end':end,'commit':PIN,'text':code,'sha256':hashlib.sha256(code.encode()).hexdigest()}
framework=json.loads((R/'source-notes/code-excerpt-index.json').read_text())
payload={'prototype':extracts,'framework':framework['entries'],'scope':'Pinned source excerpts; reading code is not runtime or production verification.'}
(R/'implementation-excerpts.js').write_text('window.IMPLEMENTATION_EXCERPTS='+json.dumps(payload,ensure_ascii=False)+';\n')
