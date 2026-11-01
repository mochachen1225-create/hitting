"""Turns the raw AI images in art-inbox/ into web assets in assets/.
Usage: python3 tools/prep-art.py <inbox-dir>   (needs Pillow; run from the repo root)
The mapping below names which inbox image becomes which asset."""
import sys, os
from PIL import Image

INBOX = sys.argv[1] if len(sys.argv) > 1 else 'art-inbox'
BG = {  # asset key -> inbox file (backgrounds, 9:16)
    'menu': 'Ink_wash_painting_with_mist_8390b4c0.jpg',
    'clear': 'East_Asian_ink_wash_painting_43288458.jpg',
    'darts': 'Lantern_illuminating_temple_wall_302a905b.jpg',
    'slipper': 'Incense_altar_under_highway_flyover_e303949e.jpg',
    'burn': 'Dark_temple_interior_with_embers_fa52c2d9.jpg',
    'nail': 'Ancient_sacred_tree_in_moonlight_47ea455a.jpg',
    'tear': 'Torn_paper_drifting_over_floor_556430ba.jpg',
    'crumple': 'Alley_at_night_reflecting_light_afbc76bd.jpg',
    'water': 'Night_garden_pond_with_lotus_eee05096.jpg',
    'shake': 'Herbal_shop_shelves_at_night_8739b426.jpg',
    'cat': 'Divine_light_over_golden_clouds_11492467.jpg',
    'poe': 'Red_lacquered_temple_offering_table_4105532a.jpg',
}
PAPER = 'Gemini_Generated_Image_odzt8jodzt8jodzt.jpeg'
CATGOD = 'Tabby_cat_deity_sitting_9a340d87.jpg'
COVER = 'Gemini_Generated_Image_cqyk6rcqyk6rcqyk.jpeg'

os.makedirs('assets', exist_ok=True)
def save(im, name, q=74):
    im.save(f'assets/{name}.webp', 'WEBP', quality=q, method=6)
    print(f'{name}.webp', im.size, os.path.getsize(f"assets/{name}.webp") // 1024, 'KB')

for key, f in BG.items():
    im = Image.open(os.path.join(INBOX, f)).convert('RGB')
    im.thumbnail((720, 1290), Image.LANCZOS)
    save(im, f'bg-{key}')

# talisman paper: drop the pale grey backdrop around the deckled edge (low saturation + light)
im = Image.open(os.path.join(INBOX, PAPER)).convert('RGBA').resize((680 * 2 // 2, 1300 * 2 // 2), Image.LANCZOS)
px = im.load()
for y in range(im.size[1]):
    for x in range(im.size[0]):
        r, g, b, a = px[x, y]
        mx, mn = max(r, g, b), min(r, g, b)
        sat = (mx - mn) / (mx or 1)
        if sat < 0.16 and mx > 150:
            px[x, y] = (r, g, b, 0)
        elif sat < 0.24 and mx > 150:
            px[x, y] = (r, g, b, int(255 * (sat - 0.16) / 0.08))
save(im, 'talisman-paper', 80)

# cat god: key out the green screen, trim, keep a soft edge
im = Image.open(os.path.join(INBOX, CATGOD)).convert('RGBA')
px = im.load()
for y in range(im.size[1]):
    for x in range(im.size[0]):
        r, g, b, a = px[x, y]
        excess = g - max(r, b)
        if excess > 60:
            px[x, y] = (0, 0, 0, 0)
        elif excess > 20:
            k = (excess - 20) / 40
            px[x, y] = (r, int(g - excess * k * 0.9), b, int(255 * (1 - k)))
im = im.crop(im.getbbox())
im.thumbnail((520, 640), Image.LANCZOS)
save(im, 'cat-god', 82)

# painted talismans: the shareable talisman picks one at random (also used for promo images)
for i, f in enumerate([COVER, 'Taoist_talisman_on_golden_paper_dca9cb41.jpg'], 1):
    im = Image.open(os.path.join(INBOX, f)).convert('RGB')
    im.thumbnail((1080, 1935), Image.LANCZOS)
    save(im, f'talisman-art-{i}', 82)

# ---- second batch: slipper sprite, paper-man texture and outline ----
import json
import numpy as np

def key_green(path):
    """Green-screen key with a soft edge; returns an RGBA image cropped to its content."""
    im = Image.open(os.path.join(INBOX, path)).convert('RGBA')
    a = np.asarray(im).astype(np.int32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    excess = g - np.maximum(r, b)
    alpha = np.clip(255 - (excess - 20) * 255 // 40, 0, 255)
    spill = np.clip(excess - 20, 0, None) * np.clip(1 - alpha / 255, 0, 1) * 0.9
    out = a.copy(); out[..., 1] = (g - spill).clip(0, 255); out[..., 3] = np.minimum(alpha, 255)
    im = Image.fromarray(out.astype(np.uint8), 'RGBA')
    return im.crop(im.getbbox())

SLIPPER = 'Taiwanese_flip-flop_slipper_on_b_9b09e12f.jpg'
PAPERMAN = 'Paper_effigy_figure_for_ritual_65da45f9.jpg'
if os.path.exists(os.path.join(INBOX, SLIPPER)):
    im = key_green(SLIPPER); im.thumbnail((300, 520), Image.LANCZOS); save(im, 'slipper', 84)

def trace(mask):
    """Moore-neighbour boundary trace of the blob under the centre column; returns [(x, y), ...]."""
    h, w = mask.shape
    # keep only the blob connected to the centre (drops stray specks), then start at its first pixel row-major
    from collections import deque
    keep = np.zeros_like(mask); cy0 = int(np.argmax(mask[:, w // 2]))
    q = deque([(w // 2, cy0)]); keep[cy0, w // 2] = True
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and mask[ny, nx] and not keep[ny, nx]: keep[ny, nx] = True; q.append((nx, ny))
    mask = keep
    ys, xs = np.nonzero(mask)
    start = (xs[np.argmin(ys * w + xs)], ys.min())
    nb = [(-1, 0), (-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1)]
    pts = [start]; cur = start; back = 0
    for _ in range(200000):
        for i in range(8):
            d = (back + i) % 8; nx, ny = cur[0] + nb[d][0], cur[1] + nb[d][1]
            if 0 <= nx < w and 0 <= ny < h and mask[ny, nx]:
                back = (d + 6) % 8; cur = (nx, ny); break
        if cur == start: break
        pts.append(cur)
    return pts

def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = np.array(pts[0], float), np.array(pts[-1], float)
    ab = b - a; L = np.hypot(*ab) or 1
    d = [abs(ab[0] * (p[1] - a[1]) - ab[1] * (p[0] - a[0])) / L for p in pts[1:-1]]
    i = int(np.argmax(d)) + 1
    if d[i - 1] > eps: return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]

if os.path.exists(os.path.join(INBOX, PAPERMAN)):
    im = key_green(PAPERMAN)
    W0, H0 = im.size
    # local units: feet at y=100, head top at y=-93 (same span as the old shape), centred on x=0
    k = 193 / H0
    tex = im.copy(); tex.thumbnail((int(W0 * 520 / H0), 520), Image.LANCZOS); save(tex, 'paperman', 84)
    small = im.resize((int(W0 * 260 / H0), 260), Image.LANCZOS)
    mask = np.asarray(small)[..., 3] > 128
    pts = trace(mask); s2 = 193 / 260
    # a closed loop starts and ends on the same point, so split it at the farthest point before simplifying
    far = int(np.argmax([np.hypot(x - pts[0][0], y - pts[0][1]) for x, y in pts]))
    poly = rdp(pts[:far + 1], 1.1)[:-1] + rdp(pts[far:] + [pts[0]], 1.1)[:-1]
    cx = small.size[0] / 2
    body = [[round((x - cx) * s2, 1), round(y * s2 - 93, 1)] for x, y in poly]
    # head: widest row in the top fifth of the mask
    widths = mask.sum(axis=1); full = widths.max()
    shoulder = int(np.argmax(widths > full * 0.6))          # first row where the arms appear
    lo = int(len(widths) * 0.06)                             # skip the narrow crown of the head
    neck = lo + int(np.argmin(widths[lo:shoulder])) if shoulder > lo + 2 else shoulder
    row = int(np.argmax(widths[:neck])) if neck > 2 else 0; r = widths[row] / 2 * s2
    shape = {'body': body, 'headCy': round(row * s2 - 93, 1), 'headR': round(r, 1),
             'neckY': round(row * s2 - 93 + r, 1), 'texW': round(W0 * k, 1), 'texH': 193.0,
             'minX': min(p[0] for p in body), 'maxX': max(p[0] for p in body)}
    json.dump(shape, open('assets/paperman-shape.json', 'w'))
    print('paper man outline:', len(body), 'points, head', shape['headCy'], shape['headR'])

# ---- music: the AI tracks arrive as mp4; keep the audio only, loudness-matched, ~80 kbps mp3 (needs ffmpeg) ----
import subprocess, shutil
MUSIC = {'menu': 'Ascent_of_the_Jade_Throne.mp4', 'play': 'Steps_of_the_Jade_Fox.mp4'}
if shutil.which('ffmpeg'):
    for key, f in MUSIC.items():
        src = os.path.join(INBOX, f)
        if os.path.exists(src):
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-af', 'loudnorm=I=-20:TP=-2', '-ac', '2', '-ar', '44100', '-b:a', '80k', f'assets/music-{key}.mp3'], check=True)
            print(f'music-{key}.mp3', os.path.getsize(f'assets/music-{key}.mp3') // 1024, 'KB')
