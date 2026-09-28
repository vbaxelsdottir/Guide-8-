from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[2];out=root/'comparison'
data=json.loads((out/'data.json').read_text())
for c in data['concepts']:
 for e in c['examples'].values():
  assert '\n'.join((root/e['file']).read_text().splitlines()[e['start']-1:e['end']])==e['code'], e['file']
for name,digest in json.loads((out/'source-manifest.json').read_text()).items():
 assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest, name+' changed'
for m in data['metrics']:
 files=[root/n for n in m['fileList']]
 assert len(files)==m['files']
 assert sum(len(p.read_text().splitlines()) for p in files)==m['lines']
 pkg=json.loads((root/m['id']/'package.json').read_text())
 assert len(pkg.get('dependencies',{}))==m['dependencies']
 assert len(pkg.get('devDependencies',{}))==m['devDependencies']
print('PASS: 33 source excerpts, measured line/file/dependency counts, and unchanged project files.')
