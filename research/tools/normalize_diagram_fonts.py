"""Keep standalone SVG diagrams consistent with the research web typography."""
from pathlib import Path
import re
FONT='-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang TC","Noto Sans TC",sans-serif'
def normalize_diagram_fonts():
 root=Path(__file__).resolve().parents[1]
 paths=[*root.glob('*.svg'),*(root/'mechanism-flows').glob('*.svg'),*(root/'sequence-diagrams').glob('*.svg')]
 count=0
 for path in paths:
  text=path.read_text()
  if '<text' not in text:continue
  text=re.sub(r'<style id="research-diagram-font">.*?</style>','',text,flags=re.S)
  style='<style id="research-diagram-font">text,tspan{font-family:'+FONT+'!important;font-kerning:normal}</style>'
  text=re.sub(r'(<svg\b[^>]*>)',lambda m:m[1]+style,text,count=1)
  path.write_text(text);count+=1
 return count
if __name__=='__main__':print(f'Normalized typography in {normalize_diagram_fonts()} diagrams.')
