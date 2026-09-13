import csv, io, re, json
from collections import defaultdict

UP='/root/.claude/uploads/7cd269b9-76ec-5b62-a114-e98ebb274bdd/'
FILES={'2026/08':UP+'390d5bd3-202608_item_list_2.csv','2025/08':UP+'1ffbe842-202508_item_list_3.csv'}

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
                    'mng':d['商品管理番号'].strip(),'sales':num('売上'),'cnt':num('売上件数'),
                    'qty':num('売上個数'),'access':num('アクセス人数')})
    return out

# ---- brand normalisation ----
BRAND_MAP=[
 (r'tommy\s*hilfiger','TOMMY HILFIGER Golf'),
 (r'pearly\s*gates','PEARLY GATES'),
 (r'admiral','Admiral GOLF'),
 (r'new\s*balance','new balance'),
 (r'sun\s*mountain','Sun Mountain'),
 (r'psycho\s*bunny','Psycho Bunny'),
 (r'master\s*bunny','MASTER BUNNY EDITION'),
 (r'jack\s*bunny','Jack Bunny'),
 (r'new\s*era','New Era'),
 (r'travis\s*mathew','Travis Mathew'),
 (r'\bping\b','PING'),
 (r'prosendr','ProSENDR'),
 (r'disney','DISNEY'),
]
PREFIX={'TH':'TOMMY HILFIGER Golf','PA':'PEARLY GATES','AD':'Admiral GOLF','NJ':'new balance',
        'NB':'new balance','SU':'Sun Mountain','PB':'Psycho Bunny','MB':'MASTER BUNNY EDITION',
        'JB':'Jack Bunny','NE':'New Era','TR':'Travis Mathew','PI':'PING','PS':'ProSENDR','DI':'DISNEY'}

def brand(name, code):
    brs=re.findall(r'\[([^\]]+)\]', name)
    for b in brs:
        low=b.lower()
        for pat,canon in BRAND_MAP:
            if re.search(pat,low): return canon
    low=name.lower()
    for pat,canon in BRAND_MAP:
        if re.search(pat,low): return canon
    return PREFIX.get(code[:2].upper(),'その他')

def category(genre):
    parts=[p.strip() for p in genre.split('>') if p.strip()]
    return parts[-1] if parts else '不明'

data={k:load(v) for k,v in FILES.items()}
for k,v in data.items():
    for r in v:
        r['brand']=brand(r['name'],r['code']); r['cat']=category(r['genre'])

print('=== 収録件数 / 合計 ===')
for k,v in data.items():
    print(k, 'items:',len(v),'売上合計:',f"{sum(r['sales'] for r in v):,}",'件数:',f"{sum(r['cnt'] for r in v):,}")

def agg(rows,key):
    d=defaultdict(lambda:[0,0])
    for r in rows:
        d[r[key]][0]+=r['sales']; d[r[key]][1]+=r['cnt']
    return d

print('\n=== ブランド別 (2026/08 vs 2025/08) ===')
b26,b25=agg(data['2026/08'],'brand'),agg(data['2025/08'],'brand')
tot26=sum(v[0] for v in b26.values())
print(f"{'brand':26}{'売上26':>12}{'件26':>7}{'構成比':>8}{'売上25':>12}{'件25':>7}{'前年比':>9}")
for b,v in sorted(b26.items(),key=lambda x:-x[1][0]):
    p=b25.get(b,[0,0]); yoy=f"{v[0]/p[0]*100:.0f}%" if p[0] else 'NEW'
    print(f"{b:26}{v[0]:>12,}{v[1]:>7}{v[0]/tot26*100:>7.1f}%{p[0]:>12,}{p[1]:>7}{yoy:>9}")
print(f"{'合計':26}{tot26:>12,}{sum(v[1] for v in b26.values()):>7}{100.0:>7.1f}%{sum(v[0] for v in b25.values()):>12,}{sum(v[1] for v in b25.values()):>7}")

print('\n=== カテゴリ別 (全ブランド) ===')
c26,c25=agg(data['2026/08'],'cat'),agg(data['2025/08'],'cat')
print(f"{'category':32}{'売上26':>12}{'売上25':>12}{'前年比':>9}")
for c,v in sorted(c26.items(),key=lambda x:-x[1][0])[:30]:
    p=c25.get(c,[0,0]); yoy=f"{v[0]/p[0]*100:.1f}%" if p[0] else 'NEW'
    print(f"{c:32}{v[0]:>12,}{p[0]:>12,}{yoy:>9}")

print('\n=== カテゴリ別 (TOMMY HILFIGER Golf) ===')
th26=[r for r in data['2026/08'] if r['brand']=='TOMMY HILFIGER Golf']
th25=[r for r in data['2025/08'] if r['brand']=='TOMMY HILFIGER Golf']
t26,t25=agg(th26,'cat'),agg(th25,'cat')
print(f"{'category':32}{'売上26':>11}{'件26':>6}{'売上25':>11}{'件25':>6}{'前年比':>9}")
for c,v in sorted(t26.items(),key=lambda x:-x[1][0])[:15]:
    p=t25.get(c,[0,0]); yoy=f"{v[0]/p[0]*100:.1f}%" if p[0] else 'NEW'
    print(f"{c:32}{v[0]:>11,}{v[1]:>6}{p[0]:>11,}{p[1]:>6}{yoy:>9}")
print('TH合計 26:',f"{sum(r['sales'] for r in th26):,}",' 25:',f"{sum(r['sales'] for r in th25):,}")

def short(name):
    n=re.sub(r'【[^】]*】','',name)
    n=re.sub(r'\[[^\]]*\]','',n,count=0)
    n=re.sub(r'\s*[0-9]{3}-[0-9]{6,7}\s*',' ',n)
    n=re.sub(r'\s*[A-Z]{2}[A-Z0-9]{4,7}\s*ヤマニゴルフ.*$','',n)
    n=re.sub(r'ヤマニゴルフ.*$','',n)
    return re.sub(r'\s+',' ',n).strip()[:48]

prev={r['code']:r for r in data['2025/08'] if r['code']}
print('\n=== 商品別売上ランキング TOP15 (2026/08) ===')
top=sorted(data['2026/08'],key=lambda r:-r['sales'])[:15]
for i,r in enumerate(top,1):
    p=prev.get(r['code'])
    yoy=(f"{(r['sales']/p['sales']-1)*100:+.1f}%" if p and p['sales'] else '新規')
    print(f"{i:>2} {r['code']:<10} {r['brand']:<22} {short(r['name'])[:40]:<42}{r['sales']:>9,}{r['cnt']:>5}件 {yoy:>9}")

print('\n=== 伸び商品 TOP10 (増加額) ===')
cur={r['code']:r for r in data['2026/08'] if r['code']}
diffs=[]
for c,r in cur.items():
    p=prev.get(c); diffs.append((r['sales']-(p['sales'] if p else 0), r, p))
for d,r,p in sorted(diffs,key=lambda x:-x[0])[:10]:
    print(f"{r['code']:<10} {r['brand']:<20} {short(r['name'])[:34]:<36} {(p['sales'] if p else 0):>9,} -> {r['sales']:>9,}  ({d:+,})")
print('\n=== 落ち商品 TOP10 (減少額) ===')
alld=list(diffs)
for c,p in prev.items():
    if c not in cur: alld.append((-p['sales'], None, p))
for d,r,p in sorted(alld,key=lambda x:x[0])[:10]:
    nm=r if r else p
    print(f"{nm['code']:<10} {nm['brand']:<20} {short(nm['name'])[:34]:<36} {p['sales']:>9,} -> {(r['sales'] if r else 0):>9,}  ({d:+,})")
