#!/usr/bin/env python3
"""Build the offline speaking deck and speaker notes from deck.json."""
from pathlib import Path
import hashlib,html,json,re
ROOT=Path(__file__).resolve().parent
spec=json.loads((ROOT/'deck.json').read_text());slides=spec['slides'];main=sum(not s['appendix'] for s in slides)
def escape(s):return html.escape(s,quote=True)
def asset(name):return name+'?v='+hashlib.sha256((ROOT/name).read_bytes()).hexdigest()[:10]
sections=[];overview=[];notes=['# 講者備註 · 數位同事主動性',f'{main} 頁主線＋{len(slides)-main} 頁附錄，約 15–18 分鐘。主線服務現場講解；介面細節與證據留在附錄及備註。']
for i,s in enumerate(slides):
 title=re.sub('<[^>]+>',' ',s['title']).strip();n=i+1;number=f'{n:02}' if not s['appendix'] else f'A{n-main}'
 sections.append(f'<section id="{escape(s["id"])}" class="slide {escape(s["layout"])}'+(' appendix' if s['appendix'] else '')+f'" aria-label="{n}. {escape(title)}" aria-hidden="true" inert><div class="slide-canvas"><header><p class="chapter">{escape(s["chapter"])}</p><h2>{s["title"]}</h2></header><div class="content">{s["html"]}</div><footer><span>{escape(s["source"])}</span><span>{number}</span></footer></div></section>')
 overview.append(f'<button type="button" data-slide="{i}"><img src="assets/previews/slide-{n:02}.jpg" alt="" loading="lazy"><span>{number}　{escape(title)}</span></button>')
 notes.extend([f'\n<a id="slide-{n}"></a>\n\n## {n:02} · {title}',s['notes']])
controls=f'''<nav class="presenter-controls" aria-label="簡報操作"><button id="prev" aria-label="上一頁">←</button><span id="counter" aria-live="polite"></span><button id="next" aria-label="下一頁">→</button><button id="overview-button" aria-keyshortcuts="O">總覽 O</button><button id="fullscreen" aria-keyshortcuts="F">全螢幕 F</button><a id="notes-link" href="speaker-notes.html#slide-1" target="_blank">講稿 N</a><button id="appendix" aria-keyshortcuts="A">附錄 A</button><a href="digital-colleague-initiative.pdf">PDF</a></nav><dialog id="overview" aria-labelledby="overview-title"><div class="overview-header"><h2 id="overview-title">數位同事主動性</h2><button id="overview-close" aria-label="關閉總覽">關閉 Esc</button></div><div class="overview-grid">{''.join(overview)}</div></dialog>'''
doc=f'''<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="數位同事主動性：框架機制、架構實作與驗收的現場分享簡報。"><title>{escape(spec['title'])}</title><link rel="stylesheet" href="{asset('viewport-base.css')}"><link rel="stylesheet" href="{asset('presentation.css')}"></head><body><div class="deck-viewport"><main id="deck" class="deck-stage">{''.join(sections)}</main></div>{controls}<script src="{asset('slides.js')}"></script></body></html>'''
(ROOT/'index.html').write_text(doc)
(ROOT/'speaker-notes.md').write_text('\n\n'.join(notes)+'\n')
# Dependency-free notes rendering with escaped prose and linked citations.
def inline(t):
 t=escape(t);t=re.sub(r'\[([^\]]+)\]\(([^ )]+)\)',r'<a href="\2">\1</a>',t);t=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',t);t=re.sub(r'`([^`]+)`',r'<code>\1</code>',t);return t
articles=[]
for i,s in enumerate(slides):
 title=re.sub('<[^>]+>',' ',s['title']).strip();paras=''.join('<p>'+inline(p).replace('\n','<br>')+'</p>' for p in s['notes'].split('\n\n') if p.strip());articles.append(f'<section id="slide-{i+1}"><h2>{i+1:02} · {escape(title)}</h2><a href="index.html#{i+1}">開啟此頁投影片 ↗</a>{paras}</section>')
(ROOT/'speaker-notes.html').write_text('<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>數位同事 · 講者備註</title><style>body{max-width:980px;margin:40px auto;padding:0 24px;background:#f7f5f0;color:#223748;font:18px/1.9 "Avenir Next","PingFang TC",sans-serif}h2{font-size:28px;line-height:1.5;border-top:1px solid #ccd6df;padding-top:30px;margin-top:45px}a{color:#076fc9}p,code{overflow-wrap:anywhere}section{scroll-margin-top:20px}section:target h2{color:#076fc9}nav{position:sticky;top:0;background:#f7f5f0eF;padding:10px 0}</style><nav><a href="index.html">← 返回簡報</a></nav><h1>講者備註</h1><p>'+str(main)+' 頁主線，約 15–18 分鐘；附錄按提問使用。</p>'+''.join(articles)+'</html>')
print(f'Built {main} main + {len(slides)-main} appendix slides')
