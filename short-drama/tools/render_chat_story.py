#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""チャット小説ショート動画レンダラー（Seedance不使用・ローカル生成のみ）

usage: python3 render_chat_story.py story.json out.mp4

story.json:
{
  "header": "ソウタ",                  # トーク相手名（画面上部）
  "status_time": "22:17",             # ステータスバー時刻
  "messages": [
    {"side": "pill",  "text": "今日"},
    {"side": "narr",  "text": "夫が死んで、7日目。", "hold": 2.2},   # 黒帯ナレーション
    {"side": "left",  "text": "ただいま", "time": "22:17"},
    {"side": "right", "text": "誰ですか？", "time": "22:18", "kidoku": false},
    ...
  ],
  "end_question": ["あなたなら、どうする？"]   # 最終カード（省略可）
}

left は吹き出し前に「…」タイピング演出が入る。表示保持時間は文字数から自動計算
（hold で上書き可）。メッセージ出現ごとにポップSE、以外は無音（BGMなし）。
"""
import json, math, pathlib, subprocess, sys, tempfile

from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FG = '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
W, H = 720, 1280
CHAT_TOP, CHAT_BOTTOM = 160, H - 120
BG = (142, 165, 196); HEAD = (245, 246, 248); GREEN = (126, 217, 87)
WHITE = (255, 255, 255); TXT = (30, 34, 40)

def font(sz): return ImageFont.truetype(FG, sz)

def tw(d, t, f):
    b = d.textbbox((0, 0), t, font=f); return b[2] - b[0]

def wrap(text, limit=14):
    lines, cur = [], ''
    for ch in text:
        cur += ch
        if len(cur) >= limit and ch not in '、。！？」':
            lines.append(cur); cur = ''
    if cur: lines.append(cur)
    return lines

def item_height(it):
    k = it['side']
    if k == 'pill': return 66
    if k == 'narr': return 110
    lines = wrap(it['text'])
    return len(lines) * 44 + 30 + 26 + (0 if k == 'right' else 0)

def draw_state(header, status_time, items):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 54], fill=HEAD)
    d.text((28, 12), status_time, font=font(30), fill=TXT)
    for i in range(4):
        d.rectangle([560 + i * 14, 34 - i * 6, 568 + i * 14, 40], fill=TXT)
    d.rounded_rectangle([636, 16, 694, 42], radius=6, outline=TXT, width=3)
    d.rectangle([640, 20, 676, 38], fill=TXT)
    d.rectangle([0, 54, W, 140], fill=HEAD)
    d.line([(34, 97), (56, 75)], fill=(60, 120, 220), width=6)
    d.line([(34, 97), (56, 119)], fill=(60, 120, 220), width=6)
    f = font(38)
    d.text(((W - tw(d, header, f)) // 2, 76), header, font=f, fill=TXT)
    # scroll: keep newest visible
    heights = [item_height(it) + 16 for it in items]
    total = sum(heights)
    avail = CHAT_BOTTOM - CHAT_TOP
    start = 0
    while total > avail and start < len(items) - 1:
        total -= heights[start]; start += 1
    y = CHAT_TOP
    fb = font(31); ft = font(21)
    for it in items[start:]:
        k = it['side']
        if k == 'pill':
            t = it['text']; w = tw(d, t, ft)
            d.rounded_rectangle([(W - w) // 2 - 18, y, (W + w) // 2 + 18, y + 40], radius=20, fill=(109, 133, 166))
            d.text(((W - w) // 2, y + 8), t, font=ft, fill=(235, 240, 246))
            y += 66 + 16
        elif k == 'narr':
            d.rectangle([0, y + 6, W, y + 96], fill=(20, 22, 26))
            t = it['text']; fnarr = font(34)
            d.text(((W - tw(d, t, fnarr)) // 2, y + 30), t, font=fnarr, fill=(240, 240, 242))
            y += 110 + 16
        else:
            lines = wrap(it['text']) or ['']
            bw = max(tw(d, ln, fb) for ln in lines) + 44
            bh = len(lines) * 44 + 26
            if k == 'typing':
                bw, bh = 110, 56
            if k in ('left', 'typing'):
                d.ellipse([26, y, 90, y + 64], fill=(190, 198, 208))
                d.ellipse([44, y + 12, 72, y + 40], fill=(150, 158, 170))
                d.ellipse([36, y + 38, 80, y + 76], fill=(150, 158, 170))
                d.rectangle([20, y + 64, 96, y + 80], fill=BG)
                bx0 = 106
                d.rounded_rectangle([bx0, y, bx0 + bw, y + bh], radius=26, fill=WHITE)
                d.polygon([(bx0 + 2, y + 14), (bx0 - 12, y + 4), (bx0 + 10, y + 30)], fill=WHITE)
                if k == 'typing':
                    for i in range(3):
                        d.ellipse([bx0 + 24 + i * 24, y + 22, bx0 + 36 + i * 24, y + 34], fill=(160, 168, 178))
                else:
                    for i, ln in enumerate(lines):
                        d.text((bx0 + 22, y + 12 + i * 44), ln, font=fb, fill=TXT)
                    if it.get('time'):
                        d.text((bx0 + bw + 12, y + bh - 28), it['time'], font=ft, fill=(236, 240, 246))
            else:
                bx1 = W - 30; bx0 = bx1 - bw
                d.rounded_rectangle([bx0, y, bx1, y + bh], radius=26, fill=GREEN)
                d.polygon([(bx1 - 2, y + 14), (bx1 + 12, y + 4), (bx1 - 10, y + 30)], fill=GREEN)
                for i, ln in enumerate(lines):
                    d.text((bx0 + 22, y + 12 + i * 44), ln, font=fb, fill=(18, 40, 16))
                mx = bx0 - 12
                if it.get('kidoku'):
                    w2 = tw(d, '既読', ft); d.text((mx - w2, y + 4), '既読', font=ft, fill=(236, 240, 246))
                if it.get('time'):
                    w2 = tw(d, it['time'], ft); d.text((mx - w2, y + bh - 28), it['time'], font=ft, fill=(236, 240, 246))
            y += bh + 26 + 16
    # input bar
    d.rectangle([0, H - 104, W, H], fill=HEAD)
    d.rounded_rectangle([84, H - 88, 596, H - 36], radius=26, fill=WHITE, outline=(210, 214, 220), width=2)
    d.text((108, H - 78), 'メッセージを入力', font=font(28), fill=(178, 184, 192))
    return im

def endcard(lines):
    im = Image.new('RGB', (W, H), (12, 12, 14))
    d = ImageDraw.Draw(im)
    y = 520
    f1 = font(46)
    for t in lines:
        d.text(((W - tw(d, t, f1)) // 2, y), t, font=f1, fill=(240, 240, 242)); y += 66
    f2 = font(34)
    t2 = '▼ コメントで教えて ▼'
    d.text(((W - tw(d, t2, f2)) // 2, y + 40), t2, font=f2, fill=(126, 217, 87))
    return im

def main():
    story = json.loads(pathlib.Path(sys.argv[1]).read_text())
    out = sys.argv[2]
    header = story.get('header', '')
    st = story.get('status_time', '21:00')
    tmp = pathlib.Path(tempfile.mkdtemp(prefix='chatstory_'))
    segs = []  # (png_path, duration, pop:boolean)
    shown = []
    idx = 0
    for m in story['messages']:
        if m['side'] == 'left':
            ty = shown + [{'side': 'typing', 'text': ''}]
            p = tmp / f'f{idx:03d}.png'; idx += 1
            draw_state(header, st, ty).save(p)
            segs.append((p, m.get('typing', 0.9), False))
        shown = shown + [m]
        p = tmp / f'f{idx:03d}.png'; idx += 1
        draw_state(header, st, shown).save(p)
        hold = m.get('hold') or max(1.3, 0.55 + len(m.get('text', '')) * 0.115)
        segs.append((p, hold, m['side'] in ('left', 'right')))
    if story.get('end_question'):
        p = tmp / f'f{idx:03d}.png'; idx += 1
        endcard(story['end_question']).save(p)
        segs.append((p, 3.2, False))
    # concat file
    cf = tmp / 'list.txt'
    with open(cf, 'w') as fh:
        for p, dur, _ in segs:
            fh.write(f"file '{p}'\nduration {dur:.3f}\n")
        fh.write(f"file '{segs[-1][0]}'\n")
    total = sum(d for _, d, _ in segs)
    # pop SE track
    pops, tcur = [], 0.0
    for _, dur, pop in segs:
        if pop: pops.append(tcur)
        tcur += dur
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    pop_wav = tmp / 'pop.wav'
    subprocess.run([ff, '-y', '-f', 'lavfi', '-i', 'sine=frequency=1245:duration=0.09',
                    '-af', 'volume=0.35,afade=t=out:st=0.05:d=0.04', str(pop_wav)], capture_output=True)
    inputs = ['-f', 'concat', '-safe', '0', '-i', str(cf)]
    fc = []
    amix = []
    for i, ptime in enumerate(pops):
        inputs += ['-i', str(pop_wav)]
        fc.append(f'[{i+1}:a]adelay={int(ptime*1000)}|{int(ptime*1000)}[a{i}]')
        amix.append(f'[a{i}]')
    if pops:
        fc.append(f"anullsrc=r=44100:cl=stereo:d={total:.2f}[sil]")
        fc.append(''.join(amix) + f"[sil]amix=inputs={len(pops)+1}:normalize=0[aout]")
        fcs = ';'.join(fc)
        cmd = [ff, '-y'] + inputs + ['-filter_complex', fcs,
               '-map', '0:v', '-map', '[aout]', '-r', '24', '-pix_fmt', 'yuv420p',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
               '-c:a', 'aac', '-ar', '44100', '-b:a', '128k', '-movflags', '+faststart', '-shortest', out]
    else:
        cmd = [ff, '-y'] + inputs + ['-r', '24', '-pix_fmt', 'yuv420p',
               '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-movflags', '+faststart', out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stderr[-1500:]); sys.exit(1)
    print(f'OK {out} ({total:.1f}s, {len(segs)} states, {len(pops)} pops)')

if __name__ == '__main__':
    main()
