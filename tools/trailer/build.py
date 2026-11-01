"""Cuts the vertical trailer from staged game frames, Flow clips, captions and the game music.
Usage (repo root): python3 tools/trailer/build.py <zh|en> <workdir> <flow-clip-dir> [out.mp4]
Needs ffmpeg. Run tools/trailer/stage.js and tools/trailer/cards.js first."""
import json, os, subprocess, sys

lang, WORK, FLOW = sys.argv[1], os.path.abspath(sys.argv[2]), os.path.abspath(sys.argv[3])
OUTF = os.path.abspath(sys.argv[4] if len(sys.argv) > 4 else f'promo/trailer-{lang}.mp4')
D, C, T = f'{WORK}/{lang}', f'{WORK}/caps/{lang}', f'{WORK}/build_{lang}'
os.makedirs(T, exist_ok=True)
MUSIC = 'assets/music-play.mp3'
MUSIC_START = 9.3            # the track gets loud ~13.5 s in; this lands that on the slipper segment
FLOWS = {'slap': 'Hand_slapping_paper_figure_on_1943ac2f.mp4', 'beans': 'Soybeans_thrown_at_paper_effigy_4a18a762.mp4',
         'sunrise': 'Sunrise_over_misty_mountains_aadf0b99.mp4'}
SEG = [  # (kind, source, seconds, caption, options)
    ('flow', 'slap', 2.8, 'hook', {'a': 3.4, 'b': 7.9}),
    ('still', 'name', 1.4, 'name', {'top': 1}),
    ('burst', 'slipper', 3.0, 'slipper', {'a': 0.2, 'b': 3.2}),
    ('burst', 'burn', 1.8, 'burn', {'a': 0.0, 'b': 1.27}),
    ('burst', 'nail', 2.0, 'nail', {'a': 0.2, 'b': 2.6}),
    ('burst', 'tear', 2.0, 'tear', {'a': 0.2, 'b': 2.6}),
    ('flow', 'beans', 2.4, 'beans', {'a': 0.8, 'b': 4.6}),
    ('burst', 'poe', 2.2, 'poe', {'a': 0.3, 'b': 2.6}),
    ('still', 'cat', 1.6, 'cat', {}),
    ('flow', 'sunrise', 2.2, 'sunrise', {'a': 2.0, 'b': 7.9}),
    ('still', 'result', 1.8, 'talisman', {'top': 1}),
    ('end', 'endcard', 2.8, None, {}),
]

def run(cmd): subprocess.run(cmd, check=True)

parts = []
for i, (kind, src, dur, cap, o) in enumerate(SEG):
    out = f'{T}/s{i:02d}.mp4'
    if kind == 'burst':
        frames = json.load(open(f'{D}/{src}.json'))
        a, b = o['a'], o['b']; sp = (b - a) / dur
        sel = [f for f in frames if a <= f[1] <= b]
        lst = f'{T}/s{i:02d}.txt'
        with open(lst, 'w') as fh:
            for j, (f, t) in enumerate(sel):
                nt = sel[j + 1][1] if j + 1 < len(sel) else t + 1 / 15
                fh.write(f"file '{f}'\nduration {(nt - t) / sp:.4f}\n")
            fh.write(f"file '{sel[-1][0]}'\n")
        inputs = ['-f', 'concat', '-safe', '0', '-i', lst]
        base = f'[0:v]scale=960:1920,fps=30,setsar=1,trim=duration={dur:.3f},setpts=PTS-STARTPTS[fg0]'
        framed = True
    elif kind == 'flow':
        sp = (o['b'] - o['a']) / dur
        inputs = ['-ss', str(o['a']), '-to', str(o['b']), '-i', f'{FLOW}/{FLOWS[src]}']
        base = f'[0:v]setpts=PTS/{sp:.4f},scale=1080:1920,fps=30,setsar=1,trim=duration={dur:.3f},setpts=PTS-STARTPTS[fg0]'
        framed = False
    else:
        img = f'{C}/endcard.png' if kind == 'end' else f'{D}/{src}.jpg'
        inputs = ['-loop', '1', '-t', str(dur), '-i', img]
        n = int(dur * 30); size = '1080x1920' if kind == 'end' else '960x1920'
        base = f"[0:v]scale={size.replace('x', ':')},zoompan=z='1+0.05*on/{n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={n}:s={size}:fps=30,setsar=1[fg0]"
        framed = kind != 'end'
    fc = [base]
    if framed:   # game frames are 1:2, so sit them on a blurred copy of themselves
        fc.append('[fg0]split[f1][f2];[f2]scale=1080:2160,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];[bg][f1]overlay=60:0[c0]')
    else:
        fc.append('[fg0]null[c0]')
    if kind == 'end':
        fc.append('[c0]format=yuv420p[comp]')
    else:
        fc.append("[c0]drawbox=x=0:y=0:w=iw:h=ih:color=white@0.55:t=fill:enable='lt(t,0.05)',format=yuv420p[c1]")
        if cap:
            inputs += ['-i', f'{C}/cap_{cap}.png']
            if o.get('top'):
                fc.append("[c1][1:v]overlay=x=0:y='if(lt(t,0.18),90-(0.18-t)*900,90)':format=auto,format=yuv420p[comp]")
            else:
                fc.append("[c1][1:v]overlay=x=0:y='if(lt(t,0.18),1420+(0.18-t)*900,1420)':format=auto,format=yuv420p[comp]")
        else:
            fc.append('[c1]null[comp]')
    run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[comp]', '-an', '-t', str(dur), '-r', '30',
         '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p', out])
    parts.append(out)

lst = f'{T}/all.txt'
open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
total = sum(s[2] for s in SEG)
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-ss', str(MUSIC_START), '-i', MUSIC, '-filter_complex',
     f'[1:a]atrim=duration={total:.2f},afade=t=in:d=0.15,afade=t=out:st={total - 1.8:.2f}:d=1.8[aout]',
     '-map', '0:v', '-map', '[aout]', '-t', f'{total:.2f}', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-movflags', '+faststart',
     '-c:a', 'aac', '-b:a', '160k', OUTF])
print(OUTF, f'{total:.1f}s')
