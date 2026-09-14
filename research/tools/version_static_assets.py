"""Content-version CSS/JS so long-open local and HTTP pages pick up edits."""
from pathlib import Path
from urllib.parse import urlsplit
import hashlib,re

def version_static_assets():
 root=Path(__file__).resolve().parents[1]
 for page in root.rglob('*.html'):
  def replace(m):
   prefix,url,suffix=m.groups();u=urlsplit(url)
   if u.scheme or u.netloc:return m[0]
   asset=page.parent/u.path
   if asset.suffix not in ('.css','.js') or not asset.is_file():return m[0]
   digest=hashlib.sha256(asset.read_bytes()).hexdigest()[:10]
   return prefix+u.path+'?v='+digest+suffix
  s=page.read_text();s=re.sub(r'((?:src|href)=")([^"<>]+)(")',replace,s)
  page.write_text(s)
if __name__=='__main__':version_static_assets()
