import csv, io, re
from collections import defaultdict
UP='/root/.claude/uploads/7cd269b9-76ec-5b62-a114-e98ebb274bdd/'
FILES={'2026/08':UP+'56b8ea3f-202608_item_list_3.csv','2025/08':UP+'821d6c86-202508_item_list_4.csv'}

def load(p):
    rows=list(csv.reader(io.open(p,encoding='utf-8-sig',newline='')))
    hdr=rows[5]; out=[]
    for r in rows[6:]:
        if len(r)<14 or not r[0].strip(): continue
        d=dict(zip(hdr,r))
        def num(k):
            v=d.get(k,'').replace(',','').strip()
            try: return int(float(v))
            except: return 0
        out.append({'genre':d['ジャンル'],'name':d['商品名'],'code':d['商品番号'].strip(),
                    'sales':num('売上'),'cnt':num('売上件数'),'access':num('アクセス人数')})
    return out

BRAND_MAP=[
 (r'jill\s*stuart|ジル\s*スチュアート','JILL STUART'),
 (r'pinky\s*[&＆]?\s*dianne|ピンキー\s*[&＆]?\s*ダイアン','Pinky&Dianne'),
 (r'margaret\s*howell|マーガレット\s*[・･]?\s*ハウエル','MARGARET HOWELL'),
 (r'beams','BEAMS'),
 (r'patrick\s*cox|パトリック\s*コックス','PATRICK COX'),
 (r'ungaro|ウンガロ','UNGARO'),
 (r'lanvin|ランバン','LANVIN'),
 (r'maniuno|マニウノ','MANIUNO'),
 (r'mila\s*schon|ミラ\s*ショーン','Mila schon'),
 (r'agnes\s*b|アニエスベー|アニエス・ベー','agnes b.'),
 (r'mary\s*quant|マリークヮント|マリークワント','MARY QUANT'),
 (r'furla|フルラ','FURLA'),
]
PREFIX={'JS':'JILL STUART','PD':'Pinky&Dianne','MH':'MARGARET HOWELL','BM':'BEAMS',
        'PC':'PATRICK COX','PX':'PATRICK COX','UU':'UNGARO','LV':'LANVIN','LN':'LANVIN',
        'MU':'MANIUNO','MS':'Mila schon','AB':'agnes b.','MQ':'MARY QUANT','NA':'NOMADOI'}

def brand(name, code):
    low=name.lower()
    for pat,canon in BRAND_MAP:
        if re.search(pat,low): return canon
    return PREFIX.get(code[:2].upper(),'その他')

def category(g):
    parts=[p.strip() for p in g.split('>') if p.strip()]
    return parts[-1] if parts else '不明'

data={k:load(v) for k,v in FILES.items()}
for k,v in data.items():
    for r in v: r['brand']=brand(r['name'],r['code']); r['cat']=category(r['genre'])
for k,v in data.items():
    print(k,'items:',len(v),'売上:',f"{sum(r['sales'] for r in v):,}",'件:',f"{sum(r['cnt'] for r in v):,}")

def agg(rows,key):
    d=defaultdict(lambda:[0,0])
    for r in rows: d[r[key]][0]+=r['sales']; d[r[key]][1]+=r['cnt']
    return d

print('\n=== ブランド別 ===')
b26,b25=agg(data['2026/08'],'brand'),agg(data['2025/08'],'brand')
t26=sum(v[0] for v in b26.values())
for b,v in sorted(b26.items(),key=lambda x:-x[1][0]):
    p=b25.get(b,[0,0]); yoy=f"{v[0]/p[0]*100:.1f}%" if p[0] else 'NEW'
    print(f"{b:22}{v[0]:>11,}{v[1]:>6}{v[0]/t26*100:>7.1f}%{p[0]:>11,}{p[1]:>6}{yoy:>9}")
print(f"{'合計':22}{t26:>11,}{sum(v[1] for v in b26.values()):>6}{100.0:>7.1f}%{sum(v[0] for v in b25.values()):>11,}{sum(v[1] for v in b25.values()):>6}")

print('\n=== カテゴリ別（全ブランド） ===')
c26,c25=agg(data['2026/08'],'cat'),agg(data['2025/08'],'cat')
for c,v in sorted(c26.items(),key=lambda x:-x[1][0])[:22]:
    p=c25.get(c,[0,0]); yoy=f"{v[0]/p[0]*100:.1f}%" if p[0] else 'NEW'
    print(f"{c:34}{v[0]:>11,}{p[0]:>11,}{yoy:>9}")

print('\n=== カテゴリ別（JILL STUART） ===')
j26=[r for r in data['2026/08'] if r['brand']=='JILL STUART']
j25=[r for r in data['2025/08'] if r['brand']=='JILL STUART']
a26,a25=agg(j26,'cat'),agg(j25,'cat')
for c,v in sorted(a26.items(),key=lambda x:-x[1][0])[:12]:
    p=a25.get(c,[0,0]); yoy=f"{v[0]/p[0]*100:.1f}%" if p[0] else 'NEW'
    print(f"{c:34}{v[0]:>11,}{v[1]:>6}{p[0]:>11,}{p[1]:>6}{yoy:>9}")
print('JS合計 26:',f"{sum(r['sales'] for r in j26):,}",'25:',f"{sum(r['sales'] for r in j25):,}")

def short(n):
    n=re.sub(r'【[^】]*】','',n); n=re.sub(r'［[^］]*］','',n)
    n=re.sub(r'バッグマニア.*$','',n)
    return re.sub(r'\s+',' ',n).strip()

prev={r['code']:r for r in data['2025/08'] if r['code']}
cur={r['code']:r for r in data['2026/08'] if r['code']}
print('\n=== 商品別 TOP12 ===')
for i,r in enumerate(sorted(data['2026/08'],key=lambda x:-x['sales'])[:12],1):
    p=prev.get(r['code']); yoy=(f"{(r['sales']/p['sales']-1)*100:+.1f}%" if p and p['sales'] else '新規')
    print(f"{i:>2} {r['code']:<10} {short(r['name'])[:42]:<44}{r['sales']:>9,}{r['cnt']:>5}件{yoy:>9}")

diffs=[(r['sales']-(prev[c]['sales'] if c in prev else 0), r, prev.get(c)) for c,r in cur.items()]
print('\n=== 伸び商品 TOP8 ===')
for d,r,p in sorted(diffs,key=lambda x:-x[0])[:8]:
    print(f"{r['code']:<10} {short(r['name'])[:38]:<40} {(p['sales'] if p else 0):>10,} -> {r['sales']:>10,} ({d:+,})")
alld=list(diffs)+[(-p['sales'],None,p) for c,p in prev.items() if c not in cur]
print('\n=== 落ち商品 TOP8 ===')
for d,r,p in sorted(alld,key=lambda x:x[0])[:8]:
    nm=r if r else p
    print(f"{nm['code']:<10} {short(nm['name'])[:38]:<40} {p['sales']:>10,} -> {(r['sales'] if r else 0):>10,} ({d:+,})")
