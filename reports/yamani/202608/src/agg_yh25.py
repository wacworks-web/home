import csv, io, re
from collections import defaultdict
F={'2026/08':'/root/.claude/uploads/7cd269b9-76ec-5b62-a114-e98ebb274bdd/bebd9d1d-thebagmania-item_report_8.csv',
   '2025/08':'/root/.claude/uploads/7cd269b9-76ec-5b62-a114-e98ebb274bdd/d75d3ac4-thebagmania-item_report_9.csv'}
def n(v):
    v=(v or '').replace(',','').strip()
    try: return int(float(v))
    except: return 0
def load(p):
    rows=list(csv.reader(io.StringIO(io.open(p,encoding='cp932',errors='replace',newline='').read())))
    out=[]
    for r in rows[1:]:
        if len(r)<14 or r[2]!='': continue
        out.append({'name':r[0],'code':r[1].upper(),'sales':n(r[3]),'ord':n(r[4]),
                    'buyers':n(r[6]),'visit':n(r[12])})
    return out
BM=[(r'jill\s*stuart|ジル\s*スチュアート','JILL STUART'),
 (r'pinky\s*[&＆]?\s*dianne|ピンキー\s*[&＆]?\s*ダイアン|pinky&amp;dianne','Pinky&Dianne'),
 (r'margaret\s*howell|マーガレット\s*[・･]?\s*ハウエル','MARGARET HOWELL'),
 (r'beams','BEAMS'),(r'patrick\s*cox|パトリック\s*コックス','PATRICK COX'),
 (r'ungaro|ウンガロ','UNGARO'),(r'lanvin|ランバン','LANVIN'),
 (r'maniuno|マニウノ','MANIUNO'),(r'mila\s*schon|ミラ\s*ショーン','Mila schon'),
 (r'agnes\s*b|アニエスベー','agnes b.'),(r'nomadoi|ノマドイ','NOMADOI')]
PRE={'JS':'JILL STUART','PD':'Pinky&Dianne','MH':'MARGARET HOWELL','BM':'BEAMS','PC':'PATRICK COX',
     'PX':'PATRICK COX','UU':'UNGARO','LV':'LANVIN','LN':'LANVIN','MU':'MANIUNO','MS':'Mila schon',
     'AB':'agnes b.','NA':'NOMADOI'}
def brand(nm,c):
    low=nm.lower()
    for pat,k in BM:
        if re.search(pat,low): return k
    return PRE.get(c[:2],'その他')
D={k:load(v) for k,v in F.items()}
for k,v in D.items():
    for r in v: r['brand']=brand(r['name'],r['code'])
    print(k,'商品数',len(v),'売上',f"{sum(r['sales'] for r in v):,}",'注文',sum(r['ord'] for r in v))

def agg(rows):
    d=defaultdict(lambda:[0,0])
    for r in rows: d[r['brand']][0]+=r['sales']; d[r['brand']][1]+=r['ord']
    return d
b26,b25=agg(D['2026/08']),agg(D['2025/08'])
t26,t25=sum(v[0] for v in b26.values()),sum(v[0] for v in b25.values())
print('\n=== ブランド別前年比 ===')
for b,v in sorted(b26.items(),key=lambda x:-x[1][0]):
    p=b25.get(b,[0,0]); yoy=f"{v[0]/p[0]*100:.0f}%" if p[0] else 'NEW'
    print(f"{b:20}{v[0]:>10,}{v[1]:>6}{v[0]/t26*100:>7.1f}%{p[0]:>10,}{p[1]:>6}{yoy:>8}")
for b,v in b25.items():
    if b not in b26: print(f"{b:20}{'0':>10}{0:>6}{0.0:>7.1f}%{v[0]:>10,}{v[1]:>6}{'消滅':>8}")
print(f"{'合計':20}{t26:>10,}{sum(v[1] for v in b26.values()):>6}{100.0:>7.1f}%{t25:>10,}{sum(v[1] for v in b25.values()):>6}{t26/t25*100:>7.0f}%")

def short(nm):
    nm=re.sub(r'【[^】]*】','',nm); nm=re.sub(r'［[^］]*］','',nm)
    nm=nm.replace('&amp;','&')
    return re.sub(r'\s+',' ',nm).strip()
prev={r['code']:r for r in D['2025/08']}
cur={r['code']:r for r in D['2026/08']}
print('\n=== TOP10 前年比 ===')
for i,r in enumerate(sorted(D['2026/08'],key=lambda x:-x['sales'])[:10],1):
    p=prev.get(r['code'])
    yoy=(f"{(r['sales']/p['sales']-1)*100:+.1f}%" if p and p['sales'] else '新規')
    print(f"{i:>2} {r['code']:<11}{short(r['name'])[:40]:<42}{r['sales']:>9,}{r['ord']:>5}件{yoy:>9}")
diffs=[(r['sales']-(prev[c]['sales'] if c in prev else 0), r, prev.get(c)) for c,r in cur.items()]
alld=list(diffs)+[(-p['sales'],None,p) for c,p in prev.items() if c not in cur]
print('\n=== 伸び TOP6 ===')
for d,r,p in sorted(diffs,key=lambda x:-x[0])[:6]:
    print(f"{r['code']:<11}{short(r['name'])[:36]:<38}{(p['sales'] if p else 0):>9,} -> {r['sales']:>9,} ({d:+,})")
print('\n=== 落ち TOP6 ===')
for d,r,p in sorted(alld,key=lambda x:x[0])[:6]:
    nm=r if r else p
    print(f"{nm['code']:<11}{short(nm['name'])[:36]:<38}{p['sales']:>9,} -> {(r['sales'] if r else 0):>9,} ({d:+,})")
