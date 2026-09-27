"""Convert a WFDB record, or a folder of records, into portable Heartscope JSON."""
import argparse, json, math, hashlib
from pathlib import Path

def convert(path, output):
    import wfdb
    import numpy as np
    signals, fields = wfdb.rdsamp(str(path.with_suffix('')))
    aliases={x.lower():x for x in ['I','II','III','aVR','aVL','aVF','V1','V2','V3','V4','V5','V6']}
    names=[aliases.get(x.strip().lower()) for x in fields['sig_name']]
    if not names or None in names or len(set(names))!=len(names): raise ValueError('Unsupported or duplicate lead names')
    if len(signals)<2 or len(signals)>2000000: raise ValueError('Recording must contain 2–2,000,000 samples')
    if not math.isfinite(fields['fs']) or not 1<=fields['fs']<=20000: raise ValueError('Invalid sample rate')
    for i,unit in enumerate(fields['units']):
        factor={'mV':1,'uV':.001,'V':1000}.get(unit)
        if factor is None: raise ValueError(f'Unsupported unit {unit}')
        signals[:,i]*=factor
    if not np.isfinite(signals).all(): raise ValueError('Nonfinite or missing samples: review before importing')
    # Do not copy free-text header comments, which may contain identifying information.
    record={'schemaVersion':1,'sampleRateHz':fields['fs'],'units':'mV','leads':names,'samples':signals.tolist(),'source':{'format':'WFDB','headerSha256':hashlib.sha256(path.read_bytes()).hexdigest()},'processing':{'filtering':'none','resampling':'none','converter':'heartscope-0.1.0'}}
    output.parent.mkdir(parents=True,exist_ok=True)
    if output.exists(): raise FileExistsError(f'Refusing to overwrite {output}')
    output.write_text(json.dumps(record,allow_nan=False),encoding='utf-8')
    return output

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('input',type=Path);p.add_argument('--output',type=Path,default=Path('processed'));args=p.parse_args()
    root=args.input
    files=sorted(root.rglob('*.hea')) if root.is_dir() else [root if root.suffix=='.hea' else root.with_suffix('.hea')]
    if not files: p.error('No .hea files found')
    failures=[]
    for f in files:
        relative=f.relative_to(root) if root.is_dir() else Path(f.name)
        try: print(convert(f,args.output/relative.with_suffix('.json')))
        except Exception as e: failures.append(str(f));print(f'FAILED {f}: {e}')
    print(f'{len(files)-len(failures)} converted; {len(failures)} failed.')
    return bool(failures)
if __name__=='__main__': raise SystemExit(main())
