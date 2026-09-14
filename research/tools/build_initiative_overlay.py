"""Annotate the existing Phase 0.5 reference SVG without moving its components."""
from pathlib import Path
import re
ROOT = Path(__file__).resolve().parents[2]
source = (ROOT / 'phases/0.5/reference-architecture.svg').read_text()
# These marks describe proposed responsibilities on existing components.
regions = [
 ('context', 296,226,504,44,'1', '職責與記憶：AGENTS.md、skills/、Memory'),
 ('discovery',40,366,760,38,'2','在既有 Agent turn 內依職責與證據提出工作'),
 ('admission',40,278,760,82,'3','Controller 與 Triage：喚起、授權與派送'),
 ('observe',40,484,376,48,'4','Event Ingress 與 Scheduler：觀察入口'),
 ('tools',616,484,184,48,'5','MCP 工具：讀來源、核對證據、執行獲准動作'),
]
marks=[]
for key,x,y,w,h,num,label in regions:
 marks.append(f'<a href="../proactivity.html#architecture/after/'+('runtime' if key=='discovery' else 'ingress' if key=='observe' else 'application' if key=='admission' else 'state' if key=='context' else 'runtime')+f'" data-arch-node="{key}" aria-label="{label}"><title>{label}</title><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="transparent" stroke="#076fc9" stroke-width="2" stroke-dasharray="6 4"/></a>')
source=source.replace('</svg>','<g class="initiative-overlay">'+''.join(marks)+'</g></svg>')
source=re.sub(r'<title>.*?</title>','<title>Phase 0.5 reference architecture: initiative integration proposal</title>',source,count=1)
source=source.replace('Digital colleague — reference architecture (one colleague)','Digital colleague · initiative integration proposal')
(ROOT/'research/architecture-diagrams/initiative-on-original.svg').write_text(source)
