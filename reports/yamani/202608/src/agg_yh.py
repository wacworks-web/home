import csv, io, re
from collections import defaultdict
p='/root/.claude/uploads/7cd269b9-76ec-5b62-a114-e98ebb274bdd/bebd9d1d-thebagmania-item_report_8.csv'
rows=list(csv.reader(io.StringIO(io.open(p,encoding='cp932',errors='replace',newline='').read())))
def n(v):
    v=(v or '').replace(',','').strip()
    try: return int(float(v))
    except: return 0
items=[]
for r in rows[1:]:
    if len(r)<14 or r[2]!='': continue          # parent rows only (ties to store total)
    items.append({'name':r[0],'code':r[1].upper(),'sales':n(r[3]),'ord':n(r[4]),
                  'qty':n(r[5]),'buyers':n(r[6]),'pv':n(r[10])+n(r[11]),'visit':n(r[12])})

BRAND_MAP=[(r'jill\s*stuart|ジル\s*スチュアート','JILL STUART'),
 (r'pinky\s*[&＆]?\s*dianne|ピンキー\s*[&＆]?\s*ダイアン','Pinky&Dianne'),
 (r'margaret\s*howell|マーガレット\s*[・･]?\s*ハウエル','MARGARET HOWELL'),
 (r'beams','BEAMS'),(r'patrick\s*cox|パトリック\s*コックス','PATRICK COX'),
 (r'ungaro|ウンガロ','UNGARO'),(r'lanvin|ランバン','LANVIN'),
 (r'maniuno|マニウノ','MANIUNO'),(r'mila\s*schon|ミラ\s*ショーン','Mila schon'),
 (r'agnes\s*b|アニエスベー','agnes b.'),(r'nomadoi|ノマドイ','NOMADOI')]
PREFIX={'JS':'JILL STUART','PD':'Pinky&Dianne','MH':'MARGARET HOWELL','BM':'BEAMS',
        'PC':'PATRICK COX','PX':'PATRICK COX','UU':'UNGARO','LV':'LANVIN','LN':'LANVIN',
        'MU':'MANIUNO','MS':'Mila schon','AB':'agnes b.','NA':'NOMADOI'}
def brand(nm,c):
    low=nm.lower()
    for pat,k in BRAND_MAP:
        if re.search(pat,low): return k
    return PREFIX.get(c[:2],'その他')
for it in items: it['brand']=brand(it['name'],it['code'])

T=sum(i['sales'] for i in items); O=sum(i['ord'] for i in items)
print("商品数:",len(items)," 売上合計:",f"{T:,}"," 注文数:",O)

d=defaultdict(lambda:[0,0])
for i in items: d[i['brand']][0]+=i['sales']; d[i['brand']][1]+=i['ord']
print("\n=== ブランド別（2026年8月） ===")
for b,v in sorted(d.items(),key=lambda x:-x[1][0]):
    print(f"{b:20}{v[0]:>11,}{v[1]:>7}{v[0]/T*100:>8.1f}%")
print(f"{'合計':20}{T:>11,}{O:>7}{100.0:>8.1f}%")

def short(nm):
    nm=re.sub(r'【[^】]*】','',nm); nm=re.sub(r'［[^］]*］','',nm)
    return re.sub(r'\s+',' ',nm).strip()
print("\n=== 商品別 TOP12（2026年8月） ===")
for k,i in enumerate(sorted(items,key=lambda x:-x['sales'])[:12],1):
    print(f"{k:>2} {i['code']:<12}{short(i['name'])[:46]:<48}{i['sales']:>9,}{i['ord']:>5}件")

print("\n=== 商品別 訪問者/購買率（TOP10の効率） ===")
for k,i in enumerate(sorted(items,key=lambda x:-x['sales'])[:10],1):
    cvr = i['buyers']/i['visit']*100 if i['visit'] else 0
    print(f"{k:>2} {i['code']:<12} 訪問{i['visit']:>6}  購買率 {cvr:>5.2f}%  客単価 {(i['sales']//i['ord'] if i['ord'] else 0):>8,}")
