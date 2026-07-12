"""Load colleagues.yaml — the identity of record (spec §4).

Zero-dependency YAML subset parser: the file is flat enough that we avoid
requiring PyYAML for the prototype. Swap for `yaml.safe_load` in real code.
"""
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Colleague:
    id: str
    display_name: str
    role: str
    persona: str
    sandbox_mode: str
    approval_policy: str


@dataclass
class Config:
    owner: str
    colleagues: dict  # id -> Colleague

    def find_by_plus_tag(self, tag: str):
        return self.colleagues.get(tag.lower())


def load(path: Path) -> Config:
    owner, colleagues, cur = None, {}, None
    for raw in path.read_text().splitlines():
        line = raw.split("#", 1)[0].rstrip()
        if not line.strip():
            continue
        if line.startswith("owner:"):
            owner = line.split(":", 1)[1].strip()
        elif line.strip().startswith("- id:"):
            if cur:
                colleagues[cur["id"]] = Colleague(**cur)
            cur = {"id": line.split(":", 1)[1].strip()}
        elif cur is not None and ":" in line:
            k, v = line.strip().split(":", 1)
            cur[k.strip()] = v.strip()
    if cur:
        colleagues[cur["id"]] = Colleague(**cur)
    return Config(owner=owner, colleagues=colleagues)
