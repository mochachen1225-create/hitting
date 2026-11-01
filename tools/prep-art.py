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
