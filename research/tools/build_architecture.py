"""Clickable architecture, generated with mingrammer/diagrams 0.25.1.

Run with the diagrams skill renderer. Output is relative to its --out-dir.
Generic nodes deliberately describe software responsibilities, not cloud services.
"""
from pathlib import Path
import json
import xml.etree.ElementTree as ET
from diagrams import Diagram, Cluster, Node, Edge

ROOT = Path(__file__).resolve().parents[2]
OUT = Path.cwd()
FONT = "Helvetica"
BLUE, INK, LINE = "#076fc9", "#202823", "#becbc7"

# id, native name, short description, proposed
SYSTEM = [
    ("client", "Interaction Client", "User request", False),
    ("ingress", "M365InboundRuntime", "Verified provider events", False),
    ("application", "LocalColleagueService", "Admission + dispatch", False),
    ("runtime", "OpenClaw", "External Runtime Controller", False),
    ("state", "Task state + receipts", "Application-owned metadata", False),
]
ADDITIONS = [
    ("duties", "Cron / Heartbeat", "Scenario configuration", True),
    ("followup", "Follow-up records", "Proposed business state", True),
    ("validation", "Scenario verification", "Proposed acceptance gate", True),
]
DETAILS = {
    "application": [
        ("dispatch", "dispatch / dispatchAutomation", "LocalColleagueService", False),
        ("admission", "assertAutomationAdmission", "Fresh readiness check", False),
        ("gateway", "StandaloneGateway", "Per-thread queue", False),
        ("adapter", "OpenClawGatewayRuntime", "POST /v1/responses", False),
    ],
    "ingress": [
        ("provider", "Graph webhook / delta poll", "Outlook + Teams", False),
        ("inbound", "M365InboundRuntime.process", "Validate + in-flight dedup", False),
        ("receipts", "M365InboundReceiptStore", "Durable processed receipt", False),
        ("dispatch", "dispatchAutomation", "Admitted agent work", False),
    ],
    "runtime": [
        ("adapter", "OpenClawGatewayRuntime", "Application adapter", False),
        ("controller", "OpenClaw /v1/responses", "External controller", False),
        ("harness", "Codex App Server", "Configured harness", False),
        ("tools", "Tool execution", "Runtime-owned execution", False),
    ],
    "state": [
        ("events", "ProactiveTaskPhase", "Guarded task transitions", False),
        ("receipts", "M365InboundReceiptStore", "Metadata-only receipts", False),
        ("artifacts", "Artifact store", "Draft / materialized output", False),
    ],
}

def render(mode, level):
    specs = SYSTEM + (ADDITIONS if mode == "after" else []) if level == "system" else DETAILS[level]
    if mode == "after" and level == "state":
        specs = specs + [ADDITIONS[1]]
    name = f"{mode}-{level}"
    graph = {"bgcolor":"#fdfcf9", "pad":"0.3", "nodesep":"0.45", "ranksep":"0.65", "fontname":FONT, "splines":"spline"}
    node_style = {"fontname":FONT, "fontsize":"14", "fontcolor":INK, "shape":"box", "labelloc":"c", "style":"rounded,filled", "fillcolor":"#eef4f1", "color":LINE, "penwidth":"1.3", "width":"2.35", "height":"0.85", "fixedsize":"false", "margin":"0.18,0.13"}
    with Diagram("", filename=name, outformat=["svg", "png"], show=False, direction="TB", graph_attr=graph, node_attr=node_style, edge_attr={"color":"#7b918a", "fontname":FONT, "fontsize":"11", "fontcolor":"#52665d"}):
        nodes={}
        for key, label, sub, proposed in specs:
            style={"style":"rounded,dashed,filled", "color":BLUE, "fillcolor":"#e5f1fd"} if proposed else {"color":"#7b849c", "fillcolor":"#f2f2f8", "penwidth":"2"} if key in ("runtime","controller","harness","tools") else {}
            nodes[key]=Node(label+"\n"+sub, nodeid=key, URL="#node-"+key, tooltip=label+": open implementation details", **style)
        def connect(a,b,label="",proposed=False):
            nodes[a] >> Edge(label=label, **({"style":"dashed", "color":BLUE} if proposed else {})) >> nodes[b]
        if level=="system":
            connect("client","application","Turn")
            connect("ingress","application","dispatchAutomation")
            connect("application","runtime","/v1/responses")
            connect("ingress","state","receipt / projection")
            if mode=="after":
                connect("duties","runtime","native wake¹",True)
                connect("runtime","followup","proposed integration",True)
                connect("followup","duties","next check¹",True)
                connect("followup","validation","evidence",True)
        elif level=="application":
            connect("admission","dispatch","admission boundary²")
            connect("dispatch","gateway","dispatch(turn)")
            connect("gateway","adapter","respond(...)")
        elif level=="ingress":
            connect("provider","inbound")
            connect("inbound","receipts","has / record")
            connect("inbound","dispatch","accepted work")
        elif level=="runtime":
            connect("adapter","controller");connect("controller","harness");connect("controller","tools")
        elif level=="state":
            # Store relationships, not a claim that stores call each other.
            connect("receipts","events","restore projection")
            connect("events","artifacts","task association")
            if mode=="after":connect("followup","events","proposed task reference",True)
    p=OUT/(name+".svg")
    raw=p.read_text()
    raw=raw[raw.index('<svg'):]
    raw=raw.replace('<svg ', '<svg role="img" aria-labelledby="'+name+'-title '+name+'-desc" ',1)
    root_end=raw.index('>')+1
    raw=raw[:root_end]+f'<title id="{name}-title">{mode.title()} · {level} architecture</title><desc id="{name}-desc">Logical software responsibilities. Solid nodes are existing or external; blue dashed nodes are proposed. Select a node in the research website for source code and integration details.</desc>'+raw[root_end:]
    p.write_text(raw)
    return name,raw

if __name__=="__main__":
    diagrams=dict(render(mode,level) for mode in ("before","after") for level in ("system",*DETAILS))
    (ROOT/"research/architecture-diagrams.js").write_text("window.ARCHITECTURE_DIAGRAMS="+json.dumps(diagrams)+";\n")
