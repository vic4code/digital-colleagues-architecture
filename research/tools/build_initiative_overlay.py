"""Annotate the existing Phase 0.5 reference SVG without moving its components."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[2]
source = (ROOT / 'phases/0.5/reference-architecture.svg').read_text()
# These marks describe proposed responsibilities on existing components.
regions = [
 ('context',296,226,504,44,'Context assembly / Role / Checkpoint / Proposal history','state'),
 ('controller',40,278,760,38,'Runtime Controller / Durable dispatch / Goal continuation','runtime'),
 ('admission',40,322,760,38,'Triage / Admission / Completion validator / Proposal gate','application'),
 ('discovery',40,366,760,38,'Codex app-server / Goal execution / Task proposal','runtime'),
 ('observe',40,484,184,48,'Event Ingress / Event envelope / Deduplication','ingress'),
 ('scheduler',232,484,184,48,'Scheduler / Monitor / next_due / Adaptive pacing','ingress'),
 ('tools',616,484,184,48,'MCP Tools / Evidence retrieval / Verification','runtime'),
]
marks=[]
for key,x,y,w,h,label,level in regions:
 marks.append(f'<a href="../proactivity.html#architecture/after/{level}" data-arch-node="{key}" aria-label="{label}"><title>{label}</title><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="transparent" stroke="#076fc9" stroke-width="2" stroke-dasharray="6 4"/></a>')
source=source.replace('</svg>','<g class="initiative-overlay">'+''.join(marks)+'</g></svg>')
source=re.sub(r'<title>.*?</title>','<title>Phase 0.5 reference architecture: initiative integration proposal</title>',source,count=1)
source=source.replace('Digital colleague — reference architecture (one colleague)','Digital colleague · initiative integration proposal')
(ROOT/'research/architecture-diagrams/initiative-on-original.svg').write_text(source)
