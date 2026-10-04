from pathlib import Path
import sys
old="https://gruporichard.pe"
new=sys.argv[1].rstrip("/") if len(sys.argv)>1 else None
if not new:
    raise SystemExit("Uso: python set_domain.py https://tudominio.pe")
for p in Path(".").rglob("*"):
    if p.is_file() and p.suffix in {".html",".xml",".txt"}:
        s=p.read_text(encoding="utf-8")
        if old in s:
            p.write_text(s.replace(old,new),encoding="utf-8")
print("Dominio actualizado a",new)
