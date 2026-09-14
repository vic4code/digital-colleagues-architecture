"""Build static research reading pages. Run from anywhere; no runtime dependencies."""
from pathlib import Path
import html,json,re,os
from urllib.parse import urlsplit,unquote
import markdown
from site_shell import site_header
from normalize_diagram_fonts import normalize_diagram_fonts
from markdown.extensions.toc import slugify_unicode
ROOT=Path(__file__).resolve().parents[2]
R=ROOT/'research'
OUT=R/'reading'
GROUPS=[('從人到 Agent',['source-notes/proactivity-architecture-guide.md','source-notes/human-to-agent.md','source-notes/design-philosophy.md','proactive-work.md','source-notes/proactive-trigger-mechanisms.md','source-notes/framework-terminology.md','source-notes/loop-graph-implementation.md']),('同事互動與責任',['colleague-interaction.md','source-notes/colleague-experience.md','source-notes/commitment-followup-design.md','source-notes/commitment-memory.md','channel-selection.md','source-notes/initiative-outreach.md']),('框架研究',['source-notes/openclaw.md','source-notes/openclaw-inferred-commitments.md','source-notes/hermes.md','source-notes/openbot.md','source-notes/grok-reconstructed.md','source-notes/voyager.md','source-notes/official-claims.md']),('觀察、主動與優先排序',['source-notes/environment-observation.md','source-notes/observation-openclaw.md','source-notes/observation-hermes.md','source-notes/initiative-openclaw.md','source-notes/initiative-hermes.md','source-notes/initiative-grok.md','source-notes/prioritization.md','source-notes/mechanism-inventory.md']),('架構與研究紀錄',['source-notes/phase-0.5-mapping.md','source-notes/colleague-prototype.md','source-notes/README.md','source-notes/design-audit.md','source-notes/taste-redesign-audit.md','source-notes/presentation-design-audit.md','README.md','proactive-research-summary.md'])]
DESCRIPTIONS=['先理解人的行為，再看工程抽象與工作循環。','接手、修正、跟進、交接，如何形成可持續的合作。','官方描述、固定版本程式碼與歷史變更，分開看證據。','何時觀察、選擇下一件事，以及如何決定要不要發話。','與既有架構的關係、採用順序及各次研究的驗證範圍。']
entries=[]
for gi,(group,files) in enumerate(GROUPS):
 for name in files:
  src=R/name
  if not src.exists():continue
  raw=src.read_text();title=next((line[2:] for line in raw.splitlines() if line.startswith('# ')),src.stem)
  entries.append({'path':name,'group':group,'gi':gi,'title':title,'raw':raw,'src':src,'dst':OUT/src.relative_to(ROOT).with_suffix('.html')})
# Every research note is readable, including future additions.
known={e['src'] for e in entries}
for src in R.rglob('*.md'):
 if src in known or OUT in src.parents or R/'tools' in src.parents:continue
 entries.append({'path':str(src.relative_to(R)),'group':GROUPS[-1][0],'gi':4,'title':next((l[2:] for l in src.read_text().splitlines() if l.startswith('# ')),src.stem),'raw':src.read_text(),'src':src,'dst':OUT/src.relative_to(ROOT).with_suffix('.html')});known.add(src)
# Architecture overview is linked directly from the detailed HTML report.
phase_source=ROOT/'phases/0.5/README.md'
if phase_source not in known:
 raw=phase_source.read_text();entries.append({'path':'phases/0.5/README.md','group':'延伸專案文件','gi':5,'title':next((l[2:] for l in raw.splitlines() if l.startswith('# ')),phase_source.stem),'raw':raw,'src':phase_source,'dst':OUT/'phases/0.5/README.html'});known.add(phase_source)
# Include project documents reached from research, avoiding raw Markdown exits.
for e in entries:
 for href in re.findall(r'\]\(([^\s)]+)',e['raw']):
  u=urlsplit(href.strip('<>'))
  if u.scheme or not u.path.endswith('.md'):continue
  target=(e['src'].parent/unquote(u.path)).resolve()
  if target in known or not target.is_relative_to(ROOT) or not target.is_file():continue
  known.add(target);raw=target.read_text();entries.append({'path':str(target.relative_to(ROOT)),'group':'延伸專案文件','gi':5,'title':next((l[2:] for l in raw.splitlines() if l.startswith('# ')),target.stem),'raw':raw,'src':target,'dst':OUT/target.relative_to(ROOT).with_suffix('.html')})
by_source={e['src']:e for e in entries}
def rel(a,b):return os.path.relpath(b,a.parent)
def esc(s):return html.escape(str(s),quote=True)
def rewrite(body,e):
 def fix(m):
  attr,url=m.group(1),html.unescape(m.group(2));u=urlsplit(url)
  if u.scheme or u.netloc or not u.path:return m.group(0)
  target=(e['src'].parent/unquote(u.path)).resolve()
  if target in by_source:target=by_source[target]['dst']
  dest=rel(e['dst'],target)+('?' + u.query if u.query else '')+('#'+u.fragment if u.fragment else '')
  return f'{attr}="{esc(dest)}"'
 return re.sub(r'(href|src)="([^"]+)"',fix,body)
for idx,e in enumerate(entries):
 dst=e['dst'];dst.parent.mkdir(parents=True,exist_ok=True)
 md=markdown.Markdown(extensions=['tables','fenced_code','toc','sane_lists'],extension_configs={'toc':{'toc_depth':'2-3','slugify':slugify_unicode}})
 body=rewrite(md.convert(e['raw']),e)
 body=re.sub(r'<table>(.*?)</table>',r'<div class="table-scroll" role="region" aria-label="研究比較表" tabindex="0"><table>\1</table></div>',body,flags=re.S)
 refs=[];seen=set()
 for url,label in re.findall(r'<a href="(https?://[^"]+)"[^>]*>(.*?)</a>',body,flags=re.S):
  if url in seen:continue
  seen.add(url);refs.append((url,re.sub('<[^>]+>','',label)))
 if refs:
  body+='<details class="article-references"><summary>本文參考來源 · '+str(len(refs))+'</summary><p>以下保留本文實際引用的來源；引用不等於實測，適用範圍以正文說明為準。</p><ol>'+''.join('<li><a href="'+url+'">'+label+'</a></li>' for url,label in refs)+'</ol></details>'

 nav=''
 for group in [g[0] for g in GROUPS]+['延伸專案文件']:
  subset=[a for a in entries if a['group']==group]
  if not subset:continue
  opened=' open' if group==e['group'] else ''
  nav+=f'<details{opened}><summary>{esc(group)}</summary>'+''.join(f'<a href="{esc(rel(dst,a["dst"]))}"'+(' aria-current="page"' if a is e else '')+f'>{esc(a["title"])}</a>' for a in subset)+'</details>'
 related=[a for a in entries if a['group']==e['group']];pos=related.index(e)
 nxt=related[pos+1] if pos+1<len(related) else None
 footer=f'<a href="{esc(rel(dst,R/"library.html"))}">← 回研究目錄</a>'+(f'<a href="{esc(rel(dst,nxt["dst"]))}">下一篇：{esc(nxt["title"])} →</a>' if nxt else '')
 dst.write_text(f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(e['title'])}｜數位同事研究</title><link rel="icon" href="data:,"><link rel="stylesheet" href="{rel(dst,R/'research-library.css')}"><link rel="stylesheet" href="{rel(dst,R/'cream-site.css')}"><link rel="stylesheet" href="{rel(dst,R/'cream-library.css')}"></head><body class="reader"><a class="skip" href="#article">跳到正文</a>{site_header(rel(dst,R/'index.html').removesuffix('index.html'), '研究書架')}<div class="reading-layout"><aside class="reading-nav" aria-label="研究章節"><p class="eyebrow">RESEARCH CHAPTERS</p>{nav}</aside><main id="article" tabindex="-1"><div class="article-kicker"><a href="{rel(dst,R/'library.html')}{('#group-'+str(e['gi'])) if e['gi']<5 else ''}">{esc(e['group'])}</a><span>研究正文</span></div><article>{body}</article><footer class="article-footer">{footer}</footer></main><aside class="page-toc" aria-label="本篇目錄"><p class="eyebrow">本篇內容</p>{md.toc}</aside></div><script src="{rel(dst,R/'research-library.js')}"></script></body></html>''')
# Frontend search indexes full text without showing implementation metadata to readers.
search=[];sections=''
for gi,(group,_) in enumerate(GROUPS):
 subset=[e for e in entries if e['gi']==gi];cards=''
 for e in subset:
  text=re.sub(r'<[^>]+>',' ',markdown.markdown(e['raw']));text=html.unescape(re.sub(r'\s+',' ',text))
  summary=next((l.strip() for l in e['raw'].splitlines() if l.strip() and not l.startswith(('#','|','-','[','!','```')) and len(l)>20),'完整研究、機制說明與來源。')
  summary=re.sub(r'\[([^]]+)\]\([^)]*\)',r'\1',summary).replace('**','')[:130]
  href=rel(R/'library.html',e['dst']);search.append({'title':e['title'],'group':group,'text':text,'href':href})
  cards+=f'<a class="research-entry" href="{esc(href)}"><h3>{esc(e["title"])}</h3><p>{esc(summary)}</p><span>展開閱讀 <b>↗</b></span></a>'
 sections+=f'<section class="library-group" id="group-{gi}"><div class="group-intro"><span class="group-number">0{gi+1}</span><h2>{esc(group)}</h2><p>{DESCRIPTIONS[gi]}</p><span class="group-count">{len(subset)} 篇研究</span></div><div class="entry-list">{cards}</div></section>'
(R/'library.html').write_text(f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>完整研究｜數位同事</title><link rel="icon" href="data:,"><link rel="stylesheet" href="research-library.css"><link rel="stylesheet" href="cream-site.css"><link rel="stylesheet" href="cream-library.css"></head><body>{site_header(active='研究書架')}<main class="library-main"><section class="library-hero"><div class="library-intro"><p class="eyebrow">THE RESEARCH SHELF</p><h1>每個「為什麼」，<br>都有地方<span>往下追。</span></h1><p>先看懂概念，再拆開機制。<br>研究全文、實作細節與原始來源，都在這裡。</p><a class="cream-link" href="index.html">先看圖解導覽 →</a></div><div class="books-illustration" aria-hidden="true"><div class="book b1"><span>01</span><strong>HUMAN<br>TO AGENT</strong><i>從人開始</i></div><div class="book b2"><span>02</span><strong>WORK<br>TOGETHER</strong><i>一起工作</i></div><div class="book b3"><span>03</span><strong>UNDER<br>THE HOOD</strong><i>拆開機制</i></div><div class="book-shelf"></div></div></section><div class="library-controls"><label for="research-search">搜尋完整研究</label><input id="research-search" type="search" placeholder="例如：承諾、Grok、steering、記憶"><nav aria-label="研究主題">{''.join(f'<a href="#group-{i}">{esc(g[0])}</a>' for i,g in enumerate(GROUPS))}</nav></div><section id="search-results" hidden aria-label="搜尋結果"><p id="search-count" role="status"></p><div id="search-list"></div></section><div id="library-chapters">{sections}</div></main><script src="research-library-data.js"></script><script src="research-library.js"></script></body></html>''')
(R/'research-library-data.js').write_text('window.RESEARCH_LIBRARY = '+json.dumps(search,ensure_ascii=False)+';\n')
# Convert local research destinations across existing frontends, including source drawers.
for p in [*R.glob('*.html'),*R.glob('*.js')]:
 if p.name in ['research-library-data.js','library.html']:continue
 text=p.read_text()
 def redirect(m):
  quote,url=m.group(1),m.group(2);u=urlsplit(url)
  if u.scheme or u.netloc:return m.group(0)
  target=(p.parent/unquote(u.path)).resolve()
  if target not in by_source:return m.group(0)
  return quote+rel(p,by_source[target]['dst'])+('#'+u.fragment if u.fragment else '')+quote
 text=re.sub(r'''(["'])([^"'<>\s]+\.md(?:#[^"'<>\s]*)?)\1''',redirect,text)
 p.write_text(text)
print(f'Built {len(entries)} full reading pages; {len(search)} research entries indexed.')

# Offline implementation reader: generated article HTML is bundled for file:// viewing.
from html.parser import HTMLParser
class ArticleBody(HTMLParser):
 def __init__(self): super().__init__(convert_charrefs=False);self.level=0;self.parts=[]
 def handle_starttag(self,tag,attrs):
  if tag=='article' and self.level==0:self.level=1;return
  if self.level:self.parts.append(self.get_starttag_text());self.level+=tag not in ['img','br','hr','input','meta','link','source','wbr']
 def handle_startendtag(self,tag,attrs):
  if self.level:self.parts.append(self.get_starttag_text())
 def handle_endtag(self,tag):
  if self.level:
   self.level-=1
   if self.level:self.parts.append('</'+tag+'>')
 def handle_data(self,data):
  if self.level:self.parts.append(data)
 def handle_entityref(self,name):
  if self.level:self.parts.append('&'+name+';')
 def handle_charref(self,name):
  if self.level:self.parts.append('&#'+name+';')
bundle={}
for name in ['openclaw','hermes','openbot','grok-reconstructed','voyager','proactive-trigger-mechanisms']:
 path=R/'reading/research/source-notes'/f'{name}.html';parser=ArticleBody();parser.feed(path.read_text());bundle[str(path.relative_to(R))]=''.join(parser.parts)
(R/'implementation-documents.js').write_text('window.IMPLEMENTATION_DOCUMENTS = '+json.dumps(bundle,ensure_ascii=False)+';\n')

# Standalone images cannot inherit a parent page font.
normalize_diagram_fonts()

# Refresh local-file and HTTP CSS/JS caches after rebuilding.
from version_static_assets import version_static_assets
version_static_assets()
