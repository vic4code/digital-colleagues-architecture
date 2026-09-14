"""Shared static navigation. Paths work over HTTP and file://."""
def site_header(prefix='', active='概念導覽'):
    items=[('index.html','概念導覽'),('proactivity.html','研究地圖'),('show-me-colleague-interaction.html','互動實驗室'),('mechanisms.html','機制圖譜'),('library.html','研究書架')]
    nav=''.join(f'<a href="{prefix}{url}"'+(' aria-current="page"' if title==active else '')+f'>{title}</a>' for url,title in items)
    return f'<header class="cream-header"><a class="cream-brand" href="{prefix}index.html"><span class="cream-mark" aria-hidden="true">c<span>·</span></span><span>數位同事<small>THE COLLEAGUE STUDY</small></span></a><nav aria-label="主要導覽">{nav}</nav></header>'
