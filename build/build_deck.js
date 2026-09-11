#!/usr/bin/env node
/**
 * Build "Agents or Overlords" — MAX deck (17 slides)
 * Output: out/MAX_Agents_or_Overlords.pptx
 */

const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const A = (p) => path.resolve(ROOT, p);

const brand = JSON.parse(fs.readFileSync(A('assets/brand.json'), 'utf8'));
const content = JSON.parse(fs.readFileSync(A('assets/content.json'), 'utf8'));

const P = brand.palette;
const F = brand.fonts;
const EB = brand.edgeBar;
const WM = brand.wordmark;
const SW = brand.slide.w; // 13.333
const SH = brand.slide.h; // 7.5

const WHITE = 'FFFFFF';
const DIM = 'CCCCCC';
// brand muted (74685D) is too dark to read on the navy scrim; lightened for on-dark use
const MUTED = 'A9A29A';

fs.mkdirSync(A('out'), { recursive: true });

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // MUST be set before any addSlide
pres.author = 'Slalom CX';
pres.company = 'Slalom';
pres.title = 'Agents or Overlords';

/* ------------------------------------------------------------------ */
/* background map (keyed on the ids actually present in content.json)  */
/* ------------------------------------------------------------------ */
const BG_MAP = {
  'cold-open': 'hero',
  'briefing-agenda': 'dossier',
  'unsettling-headlines': 'unsettling',
  'the-headline': 'breach',
  'the-pivot': 'pivot',
  'enterprise-access': 'control',
  'host-cards-evan': 'host',
  'host-cards-host-2': 'host',
  'turing-test': 'turing',
  'turing-rounds': 'divider',
  'punchline': 'punchline',
  'shout-outs': 'divider',
  'black-diamond-awards': 'divider',
  'work-spotlights': 'divider',
  'summit-demo': 'divider',
  'state-of-business': 'divider',
  'wrap-up': 'divider'
};

const ICON_COLOR = {
  '★': P.cyan, // star
  '◆': P.lime, // diamond
  '◉': P.pink, // fisheye
  '✓': P.cyan  // check
};

/* ------------------------------------------------------------------ */
/* chrome                                                              */
/* ------------------------------------------------------------------ */
function addChrome(slide, bgFile, scrimTransparency) {
  const t = typeof scrimTransparency === 'number' ? scrimTransparency : 45;

  slide.addImage({ path: A(`assets/generated/${bgFile}.png`), x: 0, y: 0, w: SW, h: SH });

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: SW, h: SH,
    fill: { color: P.navy, transparency: t },
    line: { type: 'none' }
  });

  // edge bar: lime full height, cyan + pink overlays
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: EB.w, h: EB.h,
    fill: { color: P.lime }, line: { type: 'none' }
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: EB.cyanSegment.y, w: EB.w, h: EB.cyanSegment.h,
    fill: { color: P.cyan }, line: { type: 'none' }
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: EB.pinkSegment.y, w: EB.w, h: EB.pinkSegment.h,
    fill: { color: P.pink }, line: { type: 'none' }
  });

  // wordmark
  slide.addImage({ path: A(WM.whitePath), x: WM.x, y: WM.y, w: WM.w, h: WM.h });
}

/* ------------------------------------------------------------------ */
/* text helpers — every call builds a FRESH options object             */
/* ------------------------------------------------------------------ */
function addEyebrow(slide, text, y) {
  slide.addText(text, {
    x: 0.76, y: typeof y === 'number' ? y : 0.55, w: 10.2, h: 0.35,
    fontFace: F.eyebrow, fontSize: 11, bold: true, charSpacing: 1,
    color: P.lime, isTextBox: true, margin: 0, valign: 'middle'
  });
}

function addTitle(slide, text, y, fontSize, w, h) {
  slide.addText(text, {
    x: 0.76, y: typeof y === 'number' ? y : 1.1, w: typeof w === 'number' ? w : 10.5,
    h: typeof h === 'number' ? h : 1.4,
    fontFace: F.title, fontSize: fontSize || 44, bold: true,
    color: WHITE, isTextBox: true, margin: 0, valign: 'top', wrap: true
  });
}

function addSubtitle(slide, text, y, opts) {
  const o = opts || {};
  slide.addText(text, {
    x: 0.76, y: typeof y === 'number' ? y : 2.7, w: o.w || 10.5, h: o.h || 0.7,
    fontFace: o.fontFace || F.body, fontSize: o.fontSize || 20,
    italic: !!o.italic, color: o.color || DIM,
    isTextBox: true, margin: 0, valign: 'top', wrap: true
  });
}

function addBody(slide, text, y, h, opts) {
  const o = opts || {};
  slide.addText(text, {
    x: o.x || 0.76, y: typeof y === 'number' ? y : 3.2,
    w: o.w || 10.5, h: typeof h === 'number' ? h : 2.8,
    fontFace: F.body, fontSize: o.fontSize || 15,
    color: o.color || WHITE, isTextBox: true, margin: 0,
    valign: 'top', wrap: true, paraSpaceAfter: o.paraSpaceAfter || 0
  });
}

function addSectionIcon(slide, icon) {
  slide.addText(icon, {
    x: 0.76, y: 0.8, w: 1.8, h: 1.8,
    fontFace: F.title, fontSize: 80, bold: true,
    color: ICON_COLOR[icon] || P.cyan,
    isTextBox: true, margin: 0, valign: 'middle', align: 'left'
  });
}

function addFootnote(slide, text, y, opts) {
  const o = opts || {};
  slide.addText(text, {
    x: o.x || 0.76, y: typeof y === 'number' ? y : 6.9, w: o.w || 11.5, h: o.h || 0.35,
    fontFace: F.body, fontSize: o.fontSize || 10, italic: !!o.italic,
    color: o.color || MUTED, isTextBox: true, margin: 0,
    align: o.align || 'left', valign: 'top', wrap: true
  });
}

function addCard(slide, x, y, w, h, transparency) {
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: P.navy, transparency: typeof transparency === 'number' ? transparency : 20 },
    line: { color: P.cyan, width: 0.75, transparency: 60 }
  });
}

// array of text runs from a list of strings, breakLine on all but the last
function runs(items, opts) {
  const o = opts || {};
  return items.map((t, i) => ({
    text: t,
    options: {
      bullet: !!o.bullet,
      breakLine: i < items.length - 1,
      color: o.color || WHITE
    }
  }));
}

function splitList(str) {
  if (!str) return [];
  return String(str)
    .split(/\n|\s+·\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ */
/* slide builders                                                      */
/* ------------------------------------------------------------------ */
const builders = {};

/* 1 — cold open */
builders['cold-open'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 45);
  slide.addText(
    [
      { text: 'AGENTS OR ', options: { color: WHITE, breakLine: false } },
      { text: 'OVERLORDS', options: { color: P.lime, breakLine: false } }
    ],
    {
      x: 0.76, y: 1.5, w: 11.5, h: 2.0,
      fontFace: F.title, fontSize: 52, bold: true, charSpacing: 1,
      isTextBox: true, margin: 0, valign: 'middle', wrap: true
    }
  );
  addSubtitle(slide, s.subtitle, 3.7, { fontFace: F.editorial, italic: true, fontSize: 22, color: DIM });
  addFootnote(slide, 'MAX · Slalom Customer Experience', 6.6, { color: MUTED, fontSize: 11 });
};

/* 2 — briefing agenda */
builders['briefing-agenda'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 35);
  addEyebrow(slide, s.eyebrow);
  addTitle(slide, s.title, 1.1, 36);
  const items = splitList(s.body);
  slide.addText(runs(items), {
    x: 0.76, y: 2.3, w: 10.5, h: 4.0,
    fontFace: F.body, fontSize: 16, color: WHITE,
    isTextBox: true, margin: 0, valign: 'top', wrap: true, paraSpaceAfter: 8
  });
};

/* 3 — unsettling headlines */
builders['unsettling-headlines'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 45);
  addTitle(slide, s.title, 1.5, 36);
  slide.addText(s.accent, {
    x: 0.76, y: 3.2, w: 11.5, h: 1.4,
    fontFace: F.editorial, fontSize: 52, italic: true,
    color: P.lime, isTextBox: true, margin: 0, align: 'center', valign: 'middle'
  });
};

/* 4 — the headline */
builders['the-headline'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 35);
  addEyebrow(slide, s.eyebrow);
  addTitle(slide, s.title, 0.9, 40, 7.5, 0.8);

  const paras = String(s.body).split('\n\n').map((p) => p.trim()).filter(Boolean);
  slide.addText(runs(paras), {
    x: 0.76, y: 1.9, w: 7.4, h: 4.6,
    fontFace: F.body, fontSize: 13, color: WHITE,
    isTextBox: true, margin: 0, valign: 'top', wrap: true, paraSpaceAfter: 10
  });

  const cardY = [1.5, 3.1, 4.7];
  (s.stat_cards || []).forEach((c, i) => {
    const y = cardY[i];
    addCard(slide, 8.5, y, 4.2, 1.4, 20);
    slide.addText(c.value, {
      x: 8.7, y: y + 0.12, w: 1.5, h: 0.9,
      fontFace: F.title, fontSize: 44, bold: true, color: P.lime,
      isTextBox: true, margin: 0, valign: 'middle', align: 'left'
    });
    slide.addText(c.label, {
      x: 10.25, y: y + 0.2, w: 2.25, h: 1.0,
      fontFace: F.body, fontSize: 11, color: WHITE,
      isTextBox: true, margin: 0, valign: 'middle', wrap: true
    });
  });

  addFootnote(slide, s.source_line, 6.9, { fontSize: 10, color: MUTED, w: 11.5 });
};

/* 5 — the pivot */
builders['the-pivot'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 45);
  addTitle(slide, s.title, 2.0, 38, 11.0, 1.3);
  addSubtitle(slide, s.subtitle, 3.6, { fontFace: F.editorial, italic: true, fontSize: 22, color: P.lime, w: 11.0 });
};

/* 6 — enterprise access */
builders['enterprise-access'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 35);
  addEyebrow(slide, s.eyebrow);
  addTitle(slide, s.title, 0.9, 36);
  const items = splitList(s.body);
  slide.addText(runs(items, { bullet: true }), {
    x: 0.76, y: 2.0, w: 10.5, h: 3.5,
    fontFace: F.body, fontSize: 15, color: WHITE,
    isTextBox: true, margin: 0, valign: 'top', wrap: true, paraSpaceAfter: 12
  });
  if (s.footer) addFootnote(slide, s.footer, 6.5, { fontSize: 12, color: MUTED });
};

/* 7 & 8 — host / profile cards */
function buildHostSlide(slide, s, host) {
  addChrome(slide, BG_MAP[s.id], 35);
  addTitle(slide, s.title, 0.4, 32, 10.2, 0.6);
  addSubtitle(slide, s.subtitle, 1.15, { fontSize: 14, color: DIM, h: 0.5, w: 10.2 });

  const headshot = host && host.headshot ? A(host.headshot) : null;
  const hasHeadshot = headshot && fs.existsSync(headshot);

  const cardX = [0.76, 7.0];
  const cardY = 2.0;
  const cardW = 5.8;
  const cardH = 4.8;

  (s.cards || []).forEach((c, i) => {
    const x = cardX[i];
    addCard(slide, x, cardY, cardW, cardH, 20);

    if (hasHeadshot) {
      slide.addImage({ path: headshot, x: x + 0.2, y: cardY + 0.2, w: 1.3, h: 1.3 });
    }

    slide.addText(c.name, {
      x: x + 1.65, y: cardY + 0.55, w: 3.9, h: 0.45,
      fontFace: F.title, fontSize: 16, bold: true, color: P.lime,
      isTextBox: true, margin: 0, valign: 'middle'
    });

    slide.addText('FAV FILM:', {
      x: x + 0.2, y: cardY + 1.6, w: 5.4, h: 0.22,
      fontFace: F.eyebrow, fontSize: 10, bold: true, color: P.cyan,
      isTextBox: true, margin: 0, valign: 'middle'
    });
    slide.addText(
      [
        { text: c.favorite_topical_movie, options: { color: WHITE, bold: true, breakLine: false } },
        { text: '  —  ' + c.movie_reason, options: { color: DIM, italic: true, breakLine: false } }
      ],
      {
        x: x + 0.2, y: cardY + 1.84, w: 5.4, h: 0.52,
        fontFace: F.body, fontSize: 12, isTextBox: true, margin: 0,
        valign: 'top', wrap: true
      }
    );

    slide.addText('IF I WERE AN AGENT:', {
      x: x + 0.2, y: cardY + 2.4, w: 5.4, h: 0.22,
      fontFace: F.eyebrow, fontSize: 10, bold: true, color: P.cyan,
      isTextBox: true, margin: 0, valign: 'middle'
    });
    slide.addText(c.if_i_were_an_agent, {
      x: x + 0.2, y: cardY + 2.64, w: 5.4, h: 0.62,
      fontFace: F.body, fontSize: 11, color: WHITE,
      isTextBox: true, margin: 0, valign: 'top', wrap: true
    });

    slide.addText('BIO:', {
      x: x + 0.2, y: cardY + 3.32, w: 5.4, h: 0.22,
      fontFace: F.eyebrow, fontSize: 10, bold: true, color: P.cyan,
      isTextBox: true, margin: 0, valign: 'middle'
    });
    slide.addText(c.bio_blurb, {
      x: x + 0.2, y: cardY + 3.56, w: 5.4, h: 1.1,
      fontFace: F.body, fontSize: 11, color: DIM,
      isTextBox: true, margin: 0, valign: 'top', wrap: true
    });
  });

  if (host && host.linkedin_roast) {
    s.notes = (s.notes || '') + `\n\nLinkedIn Roast: ${host.linkedin_roast}`;
  }
}

builders['host-cards-evan'] = (slide, s) => buildHostSlide(slide, s, content.hosts[0]);
builders['host-cards-host-2'] = (slide, s) => buildHostSlide(slide, s, content.hosts[1]);

/* 9 — turing test */
builders['turing-test'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 40);
  addEyebrow(slide, s.eyebrow);
  addTitle(slide, s.title, 1.1, 40);
  addSubtitle(slide, s.subtitle, 2.6, { fontFace: F.editorial, italic: true, fontSize: 22, color: P.lime });
  addBody(slide, s.body, 3.35, 0.8, { fontSize: 16 });
  slide.addText(s.voting_instruction, {
    x: 0.76, y: 4.5, w: 11.5, h: 1.0,
    fontFace: F.title, fontSize: 28, bold: true, color: P.lime,
    isTextBox: true, margin: 0, align: 'center', valign: 'middle'
  });
};

/* 10 — turing rounds */
builders['turing-rounds'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 60);
  addTitle(slide, s.title, 0.5, 36, 10.2, 0.7);

  const pos = [
    { x: 0.76, y: 1.5 },
    { x: 7.0, y: 1.5 },
    { x: 0.76, y: 4.3 },
    { x: 7.0, y: 4.3 }
  ];
  const cw = 5.8;
  const ch = 2.6;

  (s.cards || []).forEach((c, i) => {
    const p = pos[i];
    if (!p) return;
    addCard(slide, p.x, p.y, cw, ch, 25);
    slide.addText(`Round ${c.round}: ${String(c.category).toUpperCase()}`, {
      x: p.x + 0.3, y: p.y + 0.35, w: cw - 0.6, h: 0.4,
      fontFace: F.eyebrow, fontSize: 12, bold: true, charSpacing: 1,
      color: P.cyan, isTextBox: true, margin: 0, align: 'center', valign: 'middle'
    });
    slide.addText(c.prompt, {
      x: p.x + 0.4, y: p.y + 0.9, w: cw - 0.8, h: 1.4,
      fontFace: F.body, fontSize: 14, color: WHITE,
      isTextBox: true, margin: 0, align: 'center', valign: 'top', wrap: true
    });
  });
};

/* 11 — punchline */
builders['punchline'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 50);
  slide.addText(s.title, {
    x: 0.76, y: 2.4, w: 11.5, h: 2.5,
    fontFace: F.editorial, fontSize: 32, italic: true, color: WHITE,
    isTextBox: true, margin: 0, align: 'center', valign: 'middle', wrap: true
  });
};

/* generic divider (12, 14) */
function buildDivider(slide, s, scrim) {
  addChrome(slide, BG_MAP[s.id], typeof scrim === 'number' ? scrim : 45);
  if (s.section_icon) addSectionIcon(slide, s.section_icon);
  addTitle(slide, s.title, 2.7, 40, 10.5, 1.0);
  if (s.body) addBody(slide, s.body, 3.9, 1.6, { fontSize: 16 });
}

builders['shout-outs'] = (slide, s) => buildDivider(slide, s);

/* 13 — black diamond awards */
builders['black-diamond-awards'] = (slide, s) => {
  buildDivider(slide, s);
  slide.addShape(pres.ShapeType.rect, {
    x: 0.76, y: 5.5, w: 3.5, h: 0.6,
    fill: { color: P.lime }, line: { type: 'none' }
  });
  slide.addText(s.cta, {
    x: 0.76, y: 5.5, w: 3.5, h: 0.6,
    fontFace: F.title, fontSize: 14, bold: true, color: P.ink,
    isTextBox: true, margin: 0, align: 'center', valign: 'middle',
    hyperlink: { url: s.cta_url }
  });
  addFootnote(slide, s.footer, 6.3, { fontSize: 12, color: MUTED });
};

/* 14 — work spotlights */
builders['work-spotlights'] = (slide, s) => {
  buildDivider(slide, s);
  if (s.sub_note) addFootnote(slide, s.sub_note, 5.2, { fontSize: 13, italic: true, color: P.cyan });
};

/* 15 — summit demo */
builders['summit-demo'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 55);
  addTitle(slide, s.title, 1.5, 36, 10.5, 1.0);
  addBody(slide, s.body, 2.8, 1.6, { fontSize: 16 });
};

/* 16 — state of the business */
builders['state-of-business'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 40);
  if (s.section_icon) addSectionIcon(slide, s.section_icon);
  addTitle(slide, s.title, 2.55, 40, 10.5, 0.8);

  const pos = [
    { x: 0.76, y: 3.5 },
    { x: 7.0, y: 3.5 },
    { x: 0.76, y: 5.2 },
    { x: 7.0, y: 5.2 }
  ];
  (s.metrics || []).forEach((m, i) => {
    const p = pos[i];
    if (!p) return;
    addCard(slide, p.x, p.y, 5.8, 1.4, 20);
    slide.addText(m.value, {
      x: p.x + 0.25, y: p.y + 0.12, w: 5.3, h: 0.75,
      fontFace: F.title, fontSize: 28, bold: true, color: P.lime,
      isTextBox: true, margin: 0, valign: 'middle', wrap: false
    });
    slide.addText(m.label, {
      x: p.x + 0.25, y: p.y + 0.88, w: 5.3, h: 0.35,
      fontFace: F.body, fontSize: 12, color: WHITE,
      isTextBox: true, margin: 0, valign: 'middle'
    });
  });
};

/* 17 — wrap up */
builders['wrap-up'] = (slide, s) => {
  addChrome(slide, BG_MAP[s.id], 45);
  addTitle(slide, s.title, 1.1, 40, 10.5, 0.9);
  const items = splitList(s.body);
  slide.addText(runs(items), {
    x: 0.76, y: 2.4, w: 10.5, h: 2.2,
    fontFace: F.body, fontSize: 16, color: WHITE,
    isTextBox: true, margin: 0, valign: 'top', wrap: true, paraSpaceAfter: 8
  });
  slide.addText(s.cta, {
    x: 0.76, y: 5.0, w: 10.5, h: 0.5,
    fontFace: F.title, fontSize: 20, bold: true, color: P.lime,
    isTextBox: true, margin: 0, valign: 'middle'
  });
  addFootnote(slide, s.wheel_note || s.cta_url, 5.55, { fontSize: 12, color: MUTED });
};

/* ------------------------------------------------------------------ */
/* build                                                               */
/* ------------------------------------------------------------------ */
const missing = [];
content.slides.forEach((s) => {
  const fn = builders[s.id];
  if (!fn) { missing.push(s.id); return; }
  const slide = pres.addSlide();
  slide.background = { color: P.navy };
  fn(slide, s);
  if (s.notes) slide.addNotes(s.notes);
});

if (missing.length) {
  console.error('No builder for slide ids: ' + missing.join(', '));
  process.exit(1);
}

const outFile = A('out/MAX_Agents_or_Overlords.pptx');
pres
  .writeFile({ fileName: outFile })
  .then(() => {
    console.log(`Written: ${outFile} (${content.slides.length} slides)`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
