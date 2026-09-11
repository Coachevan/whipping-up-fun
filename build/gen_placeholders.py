from PIL import Image, ImageDraw
import os

os.makedirs('assets/generated', exist_ok=True)

# Brand colors (RGB)
NAVY = (11, 31, 68)
LIME = (207, 255, 0)
CYAN = (0, 212, 216)
PINK = (255, 79, 123)

BACKGROUNDS = {
    'hero':        ('hero',        LIME),
    'dossier':     ('dossier',     CYAN),
    'unsettling':  ('unsettling',  PINK),
    'breach':      ('breach',      PINK),
    'pivot':       ('pivot',       CYAN),
    'control':     ('control',     CYAN),
    'host':        ('host',        LIME),
    'turing':      ('turing',      LIME),
    'punchline':   ('punchline',   PINK),
    'divider':     ('divider',     CYAN),
}

W, H = 1920, 1080

for name, (label, accent) in BACKGROUNDS.items():
    img = Image.new('RGB', (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # Subtle gradient effect: lighter navy in top-right
    for y in range(H):
        ratio = y / H
        r = int(NAVY[0] + (30 - NAVY[0]) * (1 - ratio) * 0.3)
        g = int(NAVY[1] + (50 - NAVY[1]) * (1 - ratio) * 0.3)
        b = int(NAVY[2] + (90 - NAVY[2]) * (1 - ratio) * 0.3)
        draw.line([(0, y), (W, y)], fill=(r, g, b))

    # Subtle accent glow in bottom-right corner
    for radius in range(300, 0, -30):
        alpha = int(15 * (300 - radius) / 300)
        draw.ellipse(
            [(W - radius, H - radius), (W + radius, H + radius)],
            fill=tuple(int(c * alpha / 255) + int(NAVY[i] * (255 - alpha) / 255) for i, c in enumerate(accent))
        )

    # Thin accent line at bottom (edge detail)
    draw.rectangle([(0, H-4), (W, H)], fill=accent)

    out = f'assets/generated/{name}.png'
    img.save(out, 'PNG', compress_level=0)
    print(f'Written: {out} ({os.path.getsize(out):,} bytes)')
