"""Render source-traced framework sequence diagrams; update matching homepage flow data."""
from pathlib import Path
import json
from xml.sax.saxutils import escape
p=Path(__file__).resolve().parents[2]/'research/framework-mechanisms.js';data=json.loads(p.read_text().split(' = ',1)[1].rstrip(';\n'))
flows={
'openclaw':('Scheduled heartbeat',['Heartbeat config','Managed job','Scheduler due','Wake admission','Agent turn'],['Automations','Wake runner','Agent turn','State'],[(0,1,'Time: heartbeat job due'),(1,1,'Check enabled / hours / busy'),(1,2,'If admitted: dispatch turn'),(2,1,'Return outcome'),(1,0,'Report run status'),(0,3,'Persist schedule outcome')],'Wake admission 先檢查 enabled、active hours 與 busy 狀態；被擋則 Skip，通過才開 Agent turn。'),
'hermes':('Cron monitor',['Cron tick','Read source','Compare hash','Changed → Agent','Delivery policy'],['Scheduler','Monitor','Agent','State'],[(0,1,'Time: run monitor_script / URL'),(1,3,'Read previous hash'),(1,1,'Same → Skip; changed → continue'),(1,3,'Save new baseline'),(0,2,'Run with changed content'),(2,0,'Output / SILENT')],'Hash baseline 先於 Agent 存入；代表看過，不代表已處理或投遞。'),
'claude':('Goal continuation',['Turn ends','Goal evaluator','Condition unmet','Next turn','Re-evaluate'],['Agent turn','Goal evaluator','Session','Tools'],[(0,1,'Internal Event: turn finished'),(1,1,'Evaluate transcript evidence'),(1,2,'Unmet → continuation'),(2,0,'Start next turn'),(0,3,'Run tools; results enter transcript'),(0,1,'Next evaluation')],'Met / impossible / actionable error → Stop；條件未達成則啟動下一輪。'),
'codex':('Active goal + idle',['Session idle','Read active_goal','Lock + recheck','Start turn','Persist status'],['Session','Goal controller','State','Agent turn'],[(0,1,'Internal condition: idle'),(1,2,'Lock and read active goal'),(1,1,'Check goal status / deferral'),(1,3,'start_turn_if_idle'),(3,2,'Update goal / accounting'),(0,1,'When idle: evaluate again')],'這是既定 Goal 的 continuation，不是 Agent 自行建立新工作。'),
'grok':('Evidence boundary',['Relative timer clue','Continuation clue','Public API unverified'],['Original research','Public interface','Runtime'],[(0,1,'Timer / continuation recorded'),(1,2,'Creation and dispatch NOT verified')],'Grok Build 證據不足：這是查核邊界圖，不是已證實 execution sequence。'),
'voyager':('Automatic curriculum',['learn()','Curriculum','Rollout + critic','Update progress','Next task'],['learn loop','Curriculum','Environment','Skill library'],[(0,1,'propose_next_task(state, history)'),(1,0,'Return new task'),(0,2,'rollout(code) + feedback / critic'),(2,0,'Return result'),(0,3,'On success: store skill'),(0,1,'Direct next iteration')],'rollout 回傳後由 while 直接接續；沒有固定選題 timer，也不需要 event bus。'),
'openbot':('Durable routine',['Routine due','Occurrence queue','Claim / lease','Worker turn','Result / next due'],['Scheduler','Work queue','Worker','State'],[(0,1,'Time: offer due occurrence'),(2,1,'Claim work + lease'),(2,3,'Check owner / access'),(2,2,'Run assigned routine'),(2,1,'Complete work item'),(0,3,'Track next occurrence')],'Lease heartbeat 只維持此工作的執行權；Worker 完成後更新工作結果。')}
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'research/sequence-diagrams';out.mkdir(exist_ok=True)
for key,(title,steps,actors,messages,note) in flows.items():
 if key=='grok':
  data[key]['flow']={'title':title,'steps':steps,'sequence':None,'note':note}
  continue
 width=960;height=120+len(messages)*62;xs=[70+i*(820/(len(actors)-1)) for i in range(len(actors))]
 svg=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title"><title id="title">{escape(data[key]["name"]+": "+title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#076fc9"/></marker></defs><rect width="100%" height="100%" fill="#fff"/><g font-family="system-ui,sans-serif" font-size="15" fill="#202823">']
 for x,actor in zip(xs,actors):svg.append(f'<rect x="{x-65}" y="14" width="130" height="44" rx="5" fill="#e5f1fd"/><text x="{x}" y="41" text-anchor="middle">{escape(actor)}</text><path d="M{x} 62V{height-16}" stroke="#b8c5ce" stroke-dasharray="5 5"/>')
 for i,(a,b,label) in enumerate(messages):
  y=90+i*62;x1=xs[a];x2=xs[b]
  if a==b:
   direction=-1 if a==len(actors)-1 else 1;svg.append(f'<path d="M{x1} {y}h{40*direction}v22H{x1}" fill="none" stroke="#076fc9" marker-end="url(#arrow)"/><text x="{x1+48*direction}" y="{y+5}" text-anchor="{ "end" if direction<0 else "start" }" font-size="14">{escape(label)}</text>')
  else:svg.append(f'<path d="M{x1} {y+14}H{x2}" stroke="#076fc9" marker-end="url(#arrow)"/><text x="{(x1+x2)/2}" y="{y+3}" text-anchor="middle" font-size="14">{escape(label)}</text>')
 svg.append('</g></svg>');path=out/f'framework-{key}.svg';path.write_text(''.join(svg))
 data[key]['flow']={'title':title,'steps':steps,'sequence':str(path.relative_to(ROOT/'research')),'note':note}
 # English mechanism names first; avoid treating the old layer labels as trigger taxonomy.
 for item in data[key]['items']:
  item[0]={'條件、串流、程序結束':'Condition / Stream / On-exit','目標續行／內部排程線索':'Continuation / Timer evidence'}.get(item[0],item[0])
p.write_text('window.FRAMEWORK_MECHANISMS = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
