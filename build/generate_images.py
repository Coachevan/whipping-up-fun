"""Generate AI background images for all slides using Gemini API."""
import os, sys, time
from pathlib import Path
from google import genai
from google.genai import types

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not set"); sys.exit(1)

client = genai.Client(api_key=GEMINI_API_KEY)

STYLE = (
    " — cinematic soft-apocalyptic corporate-satire aesthetic, deep navy #0B1F44 base with "
    "acid-lime #CFFF00, cyan #00D4D8, and rose #FF4F7B accents, dramatic but tongue-in-cheek, "
    "cohesive series look, 16:9, high detail, generous dark negative space for overlaid text, "
    "no text baked into the image."
)

PRO   = "gemini-3-pro-image"
FLASH = "gemini-3.1-flash-image"

MANIFEST = [
    ("hero",       PRO,   "Red-eyed humanoid AI agents in sleek business attire standing calmly in an open-plan corporate office at dusk, one at a reception desk, faint apocalyptic haze through floor-to-ceiling windows, ominous yet absurdly mundane; dark empty space on the left for a title."),
    ("dossier",    FLASH, "A dim briefing-room table shot from above with a redacted 'MISSION DOSSIER' folder, coffee ring, pen, low-key light; large empty dark area up top for agenda text."),
    ("unsettling", FLASH, "A single office worker lit only by a laptop glow in a dark room, uneasy mood, subtle red emergency light bleeding from a doorway; lots of dark negative space."),
    ("breach",     PRO,   "A server room in red alert lighting, one rack door ajar, cables spilling toward an open door marked EXIT, breach-in-progress tension; dark left third for text and stat cards."),
    ("pivot",      FLASH, "Dawn light breaking into the same dark server room, the red alert fading to calm blue, a single friendly terminal glowing; hopeful turn, generous dark space for a line of text."),
    ("control",    FLASH, "A calm human hand resting on a sleek glowing console, in control, cool blue and lime light, confident and modern, corporate-optimistic; dark space on one side."),
    ("host",       FLASH, "A clean split-tone studio backdrop, half warm human-lit, half cool machine-lit, minimal, for portrait cards to sit on; mostly empty."),
    ("turing",     PRO,   "A single face split down the middle — left a warm human portrait, right a subtly robotic version with faint circuitry under the skin — clinical spotlight, negative space to one side."),
    ("punchline",  PRO,   "An empty modern meeting room, one chair slightly turned as if just vacated, a laptop still open and glowing, ambiguous whether anyone was ever there; eerie-funny, space for one line of text."),
    ("divider",    FLASH, "A dark textured navy field with faint circuit-trace patterns and a soft lime glow from one corner, minimal, lots of empty space for a large icon and title."),
]

OUT = Path("assets/generated")
OUT.mkdir(parents=True, exist_ok=True)

def generate(name, model, prompt, refs=None):
    parts = [prompt + STYLE]
    for r in (refs or []):
        data = Path(r).read_bytes()
        parts.append(types.Part.from_bytes(data=data, mime_type="image/png"))
    resp = client.models.generate_content(
        model=model,
        contents=parts,
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]),
    )
    for p in resp.candidates[0].content.parts:
        if p.inline_data:
            out_path = OUT / f"{name}.png"
            out_path.write_bytes(p.inline_data.data)
            size_kb = out_path.stat().st_size // 1024
            print(f"  ✓ {name}.png ({size_kb} KB)")
            return str(out_path)
    raise RuntimeError(f"No image data returned for {name}")

hero_path = None
results = {}

for name, model, prompt in MANIFEST:
    print(f"Generating {name}.png ({model})...")
    refs = [hero_path] if (name != "hero" and model == FLASH and hero_path) else None
    for attempt in range(1, 3):
        try:
            path = generate(name, model, prompt, refs)
            results[name] = "ok"
            if name == "hero":
                hero_path = path
            break
        except Exception as e:
            print(f"  Attempt {attempt} failed: {e}")
            if attempt == 2:
                results[name] = f"FAILED: {e}"
                print(f"  ✗ {name}.png — skipping (placeholder stays)")
            else:
                time.sleep(4)

print("\n--- Summary ---")
for name, status in results.items():
    print(f"  {name}: {status}")

failed = [n for n, s in results.items() if s != "ok"]
if failed:
    print(f"\n{len(failed)} image(s) failed: {', '.join(failed)}")
    print("Placeholder images remain for failed slides.")
else:
    print(f"\nAll {len(MANIFEST)} images generated successfully.")
