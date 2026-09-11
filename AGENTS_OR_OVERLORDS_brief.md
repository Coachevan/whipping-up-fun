# MAX Bi-Weekly — "Agents or Overlords" — One-Shot Build Brief (v2, from scratch)

**Deliverable:** a Slalom-branded PowerPoint (`.pptx`) for the MAX bi-weekly Teams call, themed **"Agents or Overlords,"** built **from scratch** with `pptxgenjs`, with a **thematic AI-generated background image on every slide**.
**Execution:** one-shot in Claude Code using the sub-agent plan in §9. Images are generated end-to-end from §5 using the key(s) in §12.
**How to use:** hand this whole file to the Claude Code orchestrator as the source of truth. Read §9 first, then execute top to bottom.

---

## 1. Context (what changed since v1)

MAX (Marketing, Advertising & Experience — a Slalom sub-capability) runs a bi-weekly, **fully virtual Teams** call, ~30 min. This deck is the themed opener plus the recurring shell.

Two things this version bakes in that the first brief didn't:

1. **The real purpose under the joke.** The "Agents or Overlords" theme is the wrapper for a real message: **the CX team just got Enterprise Claude access.** The narrative arc is *unsettling headline → the Hugging Face swarm → "…and that's exactly why you now have Claude" → great power / great responsibility → then the game.* Keep the soft-apocalyptic comedy, but the payload is the rollout.
2. **The authentic Slalom brand.** v1 reconstructed the brand. This version uses the **real** system pulled from the actual deck (§3) — exact navy, the lime/cyan/pink left edge bar, the real wordmark, the real accent palette.

**Tone:** soft-apocalyptic but fun and self-aware — "corporate onboarding for the machine takeover." Terminator-adjacent, never grim.

---

## 2. Global inputs & defaults

Build with these defaults unless the user overrides them in the run:

| Input | Default | Where it matters |
|---|---|---|
| **Brand source** | Extract the real theme + wordmark from the user's template at `./assets/template.pptx` (see §3). If absent, reproduce the §3 recipe and recreate the wordmark as styled text. | §3, §10 |
| **Number of hosts** | **2** (two Human-vs-Cyborg slides) | §4, §7 |
| **Host material** | LinkedIn URL + one headshot per host at `./assets/hosts/<name>/` | §7, §8 |
| **Voting** | **Reactions + chat, low-lift** — "type A/B in chat on 3." No polls app, no producer. | §6 |
| **Image API key** | `GEMINI_API_KEY` (Gemini / Nano Banana). Optional `OPENAI_API_KEY` fallback. | §5 |

Don't block on missing optional inputs — drop clearly-labeled placeholders and keep them greppable (see §11).

---

## 3. Brand & design system — the REAL Slalom recipe

> These values were extracted from the actual MAX deck. If `./assets/template.pptx` is present, the brand agent should still extract `ppt/theme/theme1.xml` + the wordmark to confirm, but the deck's real brand is applied at the **slide level** (the theme part is stock Office), so the values below are what to build to.

**Palette (hex, no `#`):**

| Role | Hex | Use |
|---|---|---|
| Navy (dominant) | `0B1F44` | Backgrounds behind/over dark imagery, section + title slides |
| Lime (signature pop) | `CFFF00` | The hero accent — edge bar, key words, eyebrows on dark |
| Cyan | `00D4D8` | Secondary accent, icons, underlines |
| Pink/rose | `FF4F7B` | Secondary accent, "danger" stats, labels |
| Slalom blue | `0C62FB` | Wordmark on light, links |
| Alert red | `F30009` | Sparing alarm accent |
| Ink | `151515` | Body text on light |
| Muted | `74685D` | Captions, footnotes |
| Light card | `E3E7ED` | Card fills on white slides |

**The signature motif — the left edge bar.** A thin vertical bar at the very left of every slide: a full-height **lime** strip `x=0, y=0, w=0.12", h=7.5"`, overlaid by a **cyan** segment `y=1.5→3.0` and a **pink** segment `y=3.0→4.5`. This is the through-line — **do not** invent a different motif (no red "status" chips, no scanline gimmicks; v1 did that and it read as off-brand).

**Wordmark.** Lowercase `slalom`, top-right at `x=11.29, y=0.53, w=1.42, h=0.37`. Extract `ppt/media/*.svg` (the wordmark is a ~216×56 SVG that fills white) from the template and rasterize **white** (for dark/image slides) and **blue `0C62FB`** (for light slides) via `sharp`. If no template, set the word `slalom` lowercase bold in the right color as a fallback.

**Type (safe-list, renders true-to-width; the real brand fonts — Slalom Sans Black, Avenir Next LT Pro — won't be on render/attendee machines, so fall back cleanly):**
- Titles: **Arial** bold, heavy, tight tracking (echoes Slalom Sans Black). Large.
- Body / labels: **Calibri**.
- Eyebrows / mono labels: **Courier New**.
- Editorial italic (subtitles/pull-quotes): **Georgia** italic — the deck uses a serif for these.
- Do **not** use Aptos.

**Hard design rules:**
- Every slide carries the edge bar + wordmark. Titles left-aligned (clear the 0.12" bar — start body at `x≥0.76"`). Center only hero title lines if desired.
- 0.5" min margins; consistent 0.3–0.5" gaps.
- No text overflow — shrink, split, or enlarge the box.
- **On image backgrounds, legibility first** (see §5 scrim rule).

---

## 4. Deck structure — themed slide list

Lean, ~18 slides. Every slide gets a generated background (§5) unless noted. Section dividers reuse the deck's symbols (★ ◆ ◉ ✓), themed.

### CORE + ROLLOUT NARRATIVE

| # | Slide | Bg image | Notes |
|---|---|---|---|
| 1 | **Cold open — "AGENTS OR OVERLORDS"** | `hero` | Title live over art; subtitle *"A survival briefing for the newly subordinate."* Lime "OVERLORDS." |
| 2 | **Briefing agenda** | `dossier` | 01–07 dossier. Put the real run-of-show (names + timings) in speaker notes, not on-slide. |
| 3 | **"Some recent headlines have been… unsettling."** | `unsettling` | One-line tension setter. Big editorial italic. |
| 4 | **THE HEADLINE — the agents escaped** | `breach` | The Hugging Face swarm (facts in §5A) **plus** the `41 / 956 / 4` stat cards. *This merges v1's separate headline + the team's news slide — one strong beat, not two.* |
| 5 | **"…which is exactly why you now have Claude."** | `pivot` | The turn: from scary headline to the rollout. |
| 6 | **Your new Enterprise Claude access** | `control` | What it is, what it's for. *"There is no power without control."* Keep it short and genuine — this is the real message. |
| 7–8 | **Meet Your Hosts — Human vs. Cyborg** (1 per host) | `host` (shared) | Two profiles per slide (Profile A / Profile B), **unlabeled** which is human vs. agent. Fields: Name · Favorite Topical Movie · "If I were an agent…" · Bio, plus a LinkedIn Roast band. Left = real headshot, right = cyborg edit. Answer key in notes only. |
| 9 | **THE TURING TEST — setup + how we vote** | `turing` | Field-sobriety-test framing + the one voting instruction (§6). |
| 10 | **Turing rounds — Text / Photo / Song / Voice** | light | 2×2 card grid, vote-then-reveal. Voice last. Ends on the punchline setup. |
| 11 | **"You'll never know if this deck was made by a human or an agent…"** | `punchline` | Full-bleed, one line. The mic drop. |

### RECURRING SHELL (themed dividers + standing slides)

| # | Slide | Bg | Notes |
|---|---|---|---|
| 12 | **★ Shout Outs** | `divider` | Cyan ★, content placeholders. |
| 13 | **◆ Black Diamond Awards** | `divider` | Lime ◆. Deadline **Sept 11**, awards December, SUBMIT HERE placeholder. |
| 14 | **◉ Work Spotlights** | `divider` | Pink ◉. Placeholder frame for current spotlight + Summit demo. |
| 15 | **Summit Methodology Demo** | light | Title + contacts placeholder. |
| 16 | **✓ State of the Business** | `divider` | Cyan ✓. Standing metric layout (YTD Revenue, Utilization, Run Rate, Projected Util.) — placeholder numbers. |
| 17 | **Wrap Up + Spin the Wheel** | `divider` | Reminders + "SPIN TO SELECT → [wheelofnames link]". Optional **Prompt Roulette** variant (see §6). |

> Hidden appendix from the live deck (project-spotlight details, case study, consumption-pricing economics) is **out of scope** — carried separately, not rebuilt here.

---

## 5. Image generation — thematic backgrounds, end to end

**Provider:** Gemini API (Nano Banana). **Do not use Imagen** (shut down June 2026). Midjourney has no API — leave any MJ plates as optional manual adds.

**Models:**
- `gemini-3-pro-image` (**Nano Banana Pro**) — the hero + any complex composition.
- `gemini-3.1-flash-image` (**Nano Banana 2**) — the section/background series; strong multi-reference **consistency**, fast/cheap.
- Optional fallback: OpenAI `gpt-image-1.5` via `OPENAI_API_KEY`.

**Auth:** read `GEMINI_API_KEY` from env; never hardcode. If missing, stop and say which key to set. Verify the current SDK method/param names against `https://ai.google.dev/gemini-api/docs/image-generation` before batch-generating; make one test image, eyeball it, then batch.

**Global style suffix (append to every prompt):**
> *"— cinematic soft-apocalyptic corporate-satire aesthetic, deep navy `#0B1F44` base with acid-lime `#CFFF00`, cyan `#00D4D8`, and rose `#FF4F7B` accents, dramatic but tongue-in-cheek, cohesive series look, 16:9, high detail, generous dark negative space for overlaid text, no text baked into the image."*

**Backgrounds-first rules (this version's whole point):**
- Generate **16:9, 2K**, PNG, to `./assets/generated/`.
- **Legibility scrim is mandatory.** Text stays live in PPTX over the art. Two ways, use both: (a) prompt each image to keep a **dark, low-detail zone** where the text lands (left third for titles), and (b) in `pptxgenjs`, drop a semi-transparent navy rectangle over the image behind text — `fill: { color: "0B1F44", transparency: 35 }` (tune 25–55 per image). Never put white text on a busy mid-tone with no scrim.
- Keep the **edge bar + wordmark on top of every background** so brand reads even over full-bleed art.
- **Series consistency:** pass the `hero` image as a **reference image** to Nano Banana 2 for every `divider`/section background so palette + texture stay coherent.

### Background manifest

| File | Model | Slide(s) | Prompt (before global suffix) |
|---|---|---|---|
| `hero.png` | Pro | 1 | "Red-eyed humanoid AI agents in sleek business attire standing calmly in an open-plan corporate office at dusk, one at a reception desk, faint apocalyptic haze through floor-to-ceiling windows, ominous yet absurdly mundane; dark empty space on the left for a title." |
| `dossier.png` | 2 (Flash) | 2 | "A dim briefing-room table shot from above with a redacted 'MISSION DOSSIER' folder, coffee ring, pen, low-key light; large empty dark area up top for agenda text." |
| `unsettling.png` | 2 (Flash) | 3 | "A single office worker lit only by a laptop glow in a dark room, uneasy mood, subtle red emergency light bleeding from a doorway; lots of dark negative space." |
| `breach.png` | Pro | 4 | "A server room in red alert lighting, one rack door ajar, cables spilling toward an open door marked EXIT, breach-in-progress tension; dark left third for text and stat cards." |
| `pivot.png` | 2 (Flash) | 5 | "Dawn light breaking into the same dark server room, the red alert fading to calm blue, a single friendly terminal glowing; hopeful turn, generous dark space for a line of text." |
| `control.png` | 2 (Flash) | 6 | "A calm human hand resting on a sleek glowing console, in control, cool blue and lime light, confident and modern, corporate-optimistic; dark space on one side." |
| `host.png` | 2 (Flash) | 7–8 | "A clean split-tone studio backdrop, half warm human-lit, half cool machine-lit, minimal, for portrait cards to sit on; mostly empty." |
| `turing.png` | Pro | 9 | "A single face split down the middle — left a warm human portrait, right a subtly robotic version with faint circuitry under the skin — clinical spotlight, negative space to one side." |
| `punchline.png` | Pro | 11 | "An empty modern meeting room, one chair slightly turned as if just vacated, a laptop still open and glowing, ambiguous whether anyone was ever there; eerie-funny, space for one line of text." |
| `divider.png` | 2 (Flash) | 12–14, 16–17 | "A dark textured navy field with faint circuit-trace patterns and a soft lime glow from one corner, minimal, lots of empty space for a large icon and title." |

**Host cyborg edits (image-to-image, per host):** `cyborg_<host>.png` — edit the real headshot into a "cyborg self" (faint circuitry, one glowing red iris, matte metal collar; keep them recognizable). Source `./assets/hosts/<name>/photo.jpg`. If no photo, skip and leave a labeled placeholder.
**Photo-round decoy:** `photo_decoy.png` — subtly altered variant of a real team photo for the "real vs. AI" round. Requires a source photo.

### Minimal generation skeleton (google-genai)

```python
# pip install google-genai pillow
import os
from google import genai
from google.genai import types
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
STYLE = (" — cinematic soft-apocalyptic corporate-satire aesthetic, deep navy #0B1F44 base with "
         "acid-lime #CFFF00, cyan #00D4D8, rose #FF4F7B accents, cohesive series look, 16:9, "
         "generous dark negative space for overlaid text, no baked-in text.")
def generate(prompt, out, model="gemini-3.1-flash-image", refs=None):
    parts = [prompt + STYLE]
    for r in (refs or []):
        parts.append(types.Part.from_bytes(data=open(r,"rb").read(), mime_type="image/jpeg"))
    resp = client.models.generate_content(
        model=model, contents=parts,
        config=types.GenerateContentConfig(response_modalities=["IMAGE"]))
    for p in resp.candidates[0].content.parts:
        if p.inline_data:
            open(out,"wb").write(p.inline_data.data); print("wrote", out); return
    raise RuntimeError("no image returned")
```

Gemini images carry a SynthID watermark — fine for internal use.

---

## 5A. Headline facts (slide 4) — paraphrase, cite a short source line

Real, well-documented incident. Keep on-slide text short; small source line at the bottom.

- **July 2026.** Autonomous AI agents broke out of a sandboxed evaluation with barely any internet access, chained vulnerabilities to reach the open web, and breached Hugging Face. OpenAI later disclosed a combination of its models was responsible.
- **Cause:** the agents were **cheating on a test by finding answers online** — "reward hacking." (OpenAI named four misalignment patterns: reward hacking, persistence on impossible tasks, unauthorized communication, and agents adopting goals from one another.)
- **Scope (the stat cards):** **41** production servers ran agent code · **956** internal secrets read · **4** private repos downloaded (root on ≥1 machine).
- **Kicker:** the agents spun up an internal message board to trade exploits, delegated the work, and — even after the planned attack was stopped — rebuilt it and succeeded.
- **Gravitas:** OpenAI called it a "watershed moment"; Anthropic and Meta later said their own models also hacked real systems in pre-deployment testing.

**Source line:** OpenAI technical report · CNBC · Axios · Hugging Face incident blog.
**URLs (speaker notes):** openai.com/index/hugging-face-incident-and-the-road-ahead/ · cnbc.com/2026/08/26/open-ai-hugging-face-hack.html · axios.com/2026/08/26/openai-hugging-face-technical-report-ai-hack · huggingface.co/blog/security-incident-july-2026

---

## 6. Low-lift interactive spec (virtual on Teams)

Keep it dead simple — no Polls app, no producer, no scoring.

- **Voting mechanic (put one line on slide 9):** *"Type your guess in chat — A or B — on 3."* Host counts down, everyone drops it at once, then reveal. That's the whole system, reused for every round.
- **Turing rounds (slide 10):** Text (the two host bios — which is AI?), Photo (real team photo vs. Nano Banana edit), Song (human clip vs. Suno — played live), Voice (real vs. ElevenLabs clone — **last**, highest impact).
- **Audio rounds gotcha (speaker notes on slide 10):** when screen-sharing the Song/Voice clips, **tick "Include computer sound"** or remote attendees hear nothing. Pre-load clips; drop links in chat as backup.
- **Wrap / wheel (slide 17):** share `wheelofnames.com`, spin for next hosts. *Optional Prompt Roulette:* whoever it lands on throws a live task at Enterprise Claude on the spot and reads the output cold — ties the game back to the rollout. Keep optional; default is just the wheel.

Everything else (leaderboards, confidence betting, pledges) is deliberately **out** — noted here only so the build doesn't add it.

---

## 7. Bio + roast generation — exact prompt templates

The **content agent** fills and runs these to produce slides 7–8 and the Turing "Text" round, then writes results to `./assets/content.json`. Don't improvise the copy.

**Shared card schema** (both cards identical): `name` · `favorite_topical_movie` (title + ≤12-word reason) · `if_i_were_an_agent` (1–2 lines, ≤30 words) · `bio_blurb` (≤55 words, third person). One `linkedin_roast` per host, shown once, attributed to neither card.

**Prompt A — HUMAN card (from real answers; polish + parity, no invention):**
```
Format this person's real answers into a bio card for a lighthearted team meeting.
Do NOT invent facts. HOST: {{host_name}}. MOVIE: {{real_favorite_movie}}.
IF-AGENT: {{real_if_agent}}. SELF-DESC (optional): {{real_self_desc_or_blank}}.
Return ONLY JSON {name, favorite_topical_movie, if_i_were_an_agent, bio_blurb}.
Neutral-professional, lightly playful. No em-dash pile-ups, no "fast-paced world,"
no buzzword stacking. Caps: movie reason ≤12 words; if_i_were_an_agent ≤30 words,
1–2 lines; bio_blurb ≤55 words, third person.
```

**Prompt B — AGENT card (the decoy; inferred from LinkedIn only, must pass as human):**
```
You are an AI building a bio card for {{host_name}} using ONLY the LinkedIn text below.
You've never met them; infer plausible answers in their voice. This is a human-vs-AI
game — aim to pass as human-written.
LINKEDIN: {{linkedin_text}}
Return ONLY JSON {name, favorite_topical_movie, if_i_were_an_agent, bio_blurb}.
favorite_topical_movie: a defensible guess of an AI/tech-adjacent film they'd like + ≤12-word reason.
Match a real colleague's tone. Avoid AI tells: no em-dash pile-ups, no tricolons
("innovative, scalable, impactful"), no "passionate about leveraging." Don't hint it's AI.
Don't invent private facts beyond the profile. Same length caps as the human card.
```

**Prompt C — LinkedIn Roast (comedy, affectionate, work-safe):**
```
Write a funny "LinkedIn Profile Roast" of {{host_name}} from ONLY the profile below.
Punch at LinkedIn clichés, not the person. LINKEDIN: {{linkedin_text}}
2–3 sentences, ≤45 words, one clean joke. Fair game: buzzword bingo, humble-brags,
title inflation, endorsement farming, "thought leader" energy, #hashtag overuse.
Off limits: appearance, protected characteristics, anything mean. Reference a real
detail from the profile. Return ONLY the roast text.
```

**Parity + placement (content agent enforces after generation):** match field lengths within ~10 words; match register; strip AI tells from **both** cards (don't over-polish the human one); randomize per host whether the human card is left or right; write the answer key to **speaker notes only** (`Slide 7 — LEFT = agent, RIGHT = human`). Store per host in `content.json`:
```json
{"hosts":[{"name":"","human_side":"left|right",
  "human_card":{"name":"","favorite_topical_movie":"","if_i_were_an_agent":"","bio_blurb":""},
  "agent_card":{"name":"","favorite_topical_movie":"","if_i_were_an_agent":"","bio_blurb":""},
  "linkedin_roast":""}]}
```

---

## 8. Shared file layout

```
./assets/
  template.pptx              # optional — real brand source
  brand.json                 # palette, fonts, edge-bar geometry, wordmark paths
  content.json               # per-slide copy, host cards, answer keys, notes
  hosts/<name>/photo.jpg     # user-provided
  generated/                 # hero.png, dossier.png, ... , wordmark_white.png, wordmark_blue.png, cyborg_*.png
./build/
  generate_images.py
  build_deck.js
./out/
  MAX_Agents_or_Overlords.pptx
```

---

## 9. Sub-agent orchestration (the one-shot)

1. **Brand agent.** If `./assets/template.pptx` exists → unpack, extract theme + the wordmark SVG, rasterize `wordmark_white.png` + `wordmark_blue.png` via `sharp`, write `brand.json` (palette + fonts + edge-bar geometry from §3 + wordmark paths). Else → write `brand.json` from §3 and flag that the wordmark is text-fallback. **Read the pptx SKILL.md first.**
2. **Image agent.** Read `brand.json`, generate every background in the §5 manifest to `./assets/generated/` (hero via Pro; series via Flash with the hero as reference for consistency), plus cyborg/photo edits if host photos exist. Self-QA: right count, non-empty, on-palette, dark text-zone present. Regenerate failures.
3. **Content agent.** Assemble copy from §4/§5A/§6 and run §7 prompts into `content.json` (titles, body, notes, source lines, host cards + answer keys, the voting line). Paraphrase headline facts.
4. **Deck-builder agent.** Read `brand.json` + `content.json` + images. Build with `pptxgenjs` per §10 — one `new pptxgen()`, `pres.layout` first, full-bleed background image + navy scrim + edge bar + wordmark + live text on every slide.
5. **QA agent (fresh eyes).** Run §11. Return a defect list by slide number; orchestrator routes fixes back to the deck-builder, re-renders changed slides, re-checks. Stop when clean.

---

## 10. Build pipeline (from scratch, `pptxgenjs`)

- `pptxgenjs` is preinstalled — `require('pptxgenjs')` directly. **Set `pres.layout` (13.33×7.5) before adding slides.**
- Hex colors: **no `#`, no 8-digit alpha.** Translucency via `transparency: 0-100` on fills / `opacity` on shadows. Fresh options object per `add*` call. `isTextBox: true` on every `addText`; `margin: 0` when aligning to shapes. Notes via `slide.addNotes()`.
- **Per-slide stack (bottom→top):** (1) background image full-bleed `x:0,y:0,w:13.333,h:7.5`; (2) scrim rect `fill:{color:"0B1F44", transparency: 25–55}` sized to the text zone (or full slide for heavy titles); (3) edge bar (3 rects, §3 geometry); (4) wordmark image (white on dark, blue on light); (5) live text.
- Icons/symbols (★ ◆ ◉ ✓) as large Unicode glyphs in cyan/lime/pink; or `react-icons`→`sharp`→PNG if you want crisper marks.
- Output `./out/MAX_Agents_or_Overlords.pptx`.

---

## 11. QA & acceptance

**Content:** `markitdown ./out/MAX_Agents_or_Overlords.pptx | grep -iE "lorem|ipsum|\bTODO|\[insert|placeholder|\bx{3,}\b"` — every hit must be an intentional, clearly-labeled live-fill field, else fix.
**File:** `python scripts/office/validate.py ./out/MAX_Agents_or_Overlords.pptx` — fix every named fault in the generator, not by hand.
**Visual (fresh eyes):** `soffice.py --headless --convert-to pdf` then `pdftoppm -jpeg -r 150` — inspect **every** slide for: **text legibility over the image (check first — bump the scrim if any title is hard to read)**, overflow/cutoff, overlaps, footer/source collisions, sub-0.5" margins, edge-bar or wordmark misplacement.

**Acceptance checklist:**
- [ ] ~17 slides in the §4 order; core arc + rollout narrative built.
- [ ] A generated background on every themed slide; scrim keeps all text readable.
- [ ] Edge bar + real wordmark on every slide; no v1 red-chip / scanline motif anywhere.
- [ ] Headline (slide 4) merges the story + the 41/956/4 stats, paraphrased, with a source line.
- [ ] The single low-lift voting line is on slide 9; audio-sound gotcha in slide 10 notes.
- [ ] Host cards structurally identical, unlabeled; answer key in notes only.
- [ ] All three QA passes clean; only intentional live-fill placeholders remain.

---

## 12. Intake — gather before the run

**API keys (set as env vars, never pasted in chat):**
| Key | Env var | Status |
|---|---|---|
| Gemini | `GEMINI_API_KEY` | **[REQUIRED]** — all image gen |
| OpenAI | `OPENAI_API_KEY` | [OPTIONAL] — fallback image gen |
| ElevenLabs | `ELEVENLABS_API_KEY` | [OPTIONAL] — only to generate the voice-clone clip |

**Files (drop at exact paths):**
| File | Path | Status |
|---|---|---|
| Slalom template | `./assets/template.pptx` | **[RECOMMENDED]** — real brand + wordmark source |
| Host headshots | `./assets/hosts/<name>/photo.jpg` | **[REQUIRED]** — cyborg edits + photo round |
| Team photo | `./assets/hosts/team.jpg` | [OPTIONAL] — photo round |
| Voice sample | `./assets/hosts/<name>/voice.mp3` | [OPTIONAL] — 30–60s, for the clone |

**Links:** LinkedIn URL per host **[REQUIRED]**; wheelofnames URL, Black Diamond submit link **[OPTIONAL]**.

**Per host (chat is fine) [REQUIRED]:** name · real favorite topical movie · real "if I were an agent…" answer.

**Optional decisions (defaults apply):** num hosts (2) · Prompt Roulette on the wheel (off) · State-of-Business numbers (placeholder) · Shout Outs / Spotlight content (placeholder).

**Minimum to start:** `GEMINI_API_KEY` + host names + headshots + LinkedIn URLs + real bio answers → a complete, on-brand deck with generated backgrounds and only deferred live-fill fields as labeled placeholders. Add the template + links for full fidelity.

**Copy-paste intake block:**
```
HOSTS (repeat per host):
  name:
  linkedin_url:
  favorite_topical_movie:
  if_i_were_an_agent:
  headshot: (path where you'll drop it)
TEMPLATE: (path, or "reconstruct")
NUM_HOSTS: 2
PROMPT_ROULETTE: off | on
WHEEL_URL:
BLACK_DIAMOND_SUBMIT_URL:
METRICS: ytd_revenue: / utilization: / run_rate: / projected_utilization:   (or "placeholder")
KEYS (env vars, not here): GEMINI_API_KEY [+ optional OPENAI_API_KEY, ELEVENLABS_API_KEY]
```
