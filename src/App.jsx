import { useState, useCallback, useEffect } from "react";

const HIRAGANA_DATA = [
  // Vowels (Lektion 1 - erste Zeichen in Minna no Nihongo)
  { char: "あ", rom: "a", group: "vowels", lesson: 1 },
  { char: "い", rom: "i", group: "vowels", lesson: 1 },
  { char: "う", rom: "u", group: "vowels", lesson: 1 },
  { char: "え", rom: "e", group: "vowels", lesson: 1 },
  { char: "お", rom: "o", group: "vowels", lesson: 1 },
  // K-row
  { char: "か", rom: "ka", group: "k", lesson: 1 },
  { char: "き", rom: "ki", group: "k", lesson: 1 },
  { char: "く", rom: "ku", group: "k", lesson: 1 },
  { char: "け", rom: "ke", group: "k", lesson: 1 },
  { char: "こ", rom: "ko", group: "k", lesson: 1 },
  // S-row
  { char: "さ", rom: "sa", group: "s", lesson: 1 },
  { char: "し", rom: "shi", group: "s", lesson: 1 },
  { char: "す", rom: "su", group: "s", lesson: 1 },
  { char: "せ", rom: "se", group: "s", lesson: 1 },
  { char: "そ", rom: "so", group: "s", lesson: 1 },
  // T-row
  { char: "た", rom: "ta", group: "t", lesson: 1 },
  { char: "ち", rom: "chi", group: "t", lesson: 1 },
  { char: "つ", rom: "tsu", group: "t", lesson: 1 },
  { char: "て", rom: "te", group: "t", lesson: 1 },
  { char: "と", rom: "to", group: "t", lesson: 1 },
  // N-row
  { char: "な", rom: "na", group: "n", lesson: 1 },
  { char: "に", rom: "ni", group: "n", lesson: 1 },
  { char: "ぬ", rom: "nu", group: "n", lesson: 1 },
  { char: "ね", rom: "ne", group: "n", lesson: 1 },
  { char: "の", rom: "no", group: "n", lesson: 1 },
  // H-row
  { char: "は", rom: "ha", group: "h", lesson: 1 },
  { char: "ひ", rom: "hi", group: "h", lesson: 1 },
  { char: "ふ", rom: "fu", group: "h", lesson: 1 },
  { char: "へ", rom: "he", group: "h", lesson: 1 },
  { char: "ほ", rom: "ho", group: "h", lesson: 1 },
  // M-row
  { char: "ま", rom: "ma", group: "m", lesson: 1 },
  { char: "み", rom: "mi", group: "m", lesson: 1 },
  { char: "む", rom: "mu", group: "m", lesson: 1 },
  { char: "め", rom: "me", group: "m", lesson: 1 },
  { char: "も", rom: "mo", group: "m", lesson: 1 },
  // Y-row
  { char: "や", rom: "ya", group: "y", lesson: 1 },
  { char: "ゆ", rom: "yu", group: "y", lesson: 1 },
  { char: "よ", rom: "yo", group: "y", lesson: 1 },
  // R-row
  { char: "ら", rom: "ra", group: "r", lesson: 1 },
  { char: "り", rom: "ri", group: "r", lesson: 1 },
  { char: "る", rom: "ru", group: "r", lesson: 1 },
  { char: "れ", rom: "re", group: "r", lesson: 1 },
  { char: "ろ", rom: "ro", group: "r", lesson: 1 },
  // W-row + n
  { char: "わ", rom: "wa", group: "w", lesson: 1 },
  { char: "を", rom: "wo", group: "w", lesson: 1 },
  { char: "ん", rom: "n", group: "w", lesson: 1 },
  // Dakuten (voiced) - typically introduced later in Minna no Nihongo
  { char: "が", rom: "ga", group: "g", lesson: 2 },
  { char: "ぎ", rom: "gi", group: "g", lesson: 2 },
  { char: "ぐ", rom: "gu", group: "g", lesson: 2 },
  { char: "げ", rom: "ge", group: "g", lesson: 2 },
  { char: "ご", rom: "go", group: "g", lesson: 2 },
  { char: "ざ", rom: "za", group: "z", lesson: 2 },
  { char: "じ", rom: "ji", group: "z", lesson: 2 },
  { char: "ず", rom: "zu", group: "z", lesson: 2 },
  { char: "ぜ", rom: "ze", group: "z", lesson: 2 },
  { char: "ぞ", rom: "zo", group: "z", lesson: 2 },
  { char: "だ", rom: "da", group: "d", lesson: 2 },
  { char: "ぢ", rom: "di", group: "d", lesson: 2 },
  { char: "づ", rom: "du", group: "d", lesson: 2 },
  { char: "で", rom: "de", group: "d", lesson: 2 },
  { char: "ど", rom: "do", group: "d", lesson: 2 },
  { char: "ば", rom: "ba", group: "b", lesson: 2 },
  { char: "び", rom: "bi", group: "b", lesson: 2 },
  { char: "ぶ", rom: "bu", group: "b", lesson: 2 },
  { char: "べ", rom: "be", group: "b", lesson: 2 },
  { char: "ぼ", rom: "bo", group: "b", lesson: 2 },
  { char: "ぱ", rom: "pa", group: "p", lesson: 2 },
  { char: "ぴ", rom: "pi", group: "p", lesson: 2 },
  { char: "ぷ", rom: "pu", group: "p", lesson: 2 },
  { char: "ぺ", rom: "pe", group: "p", lesson: 2 },
  { char: "ぽ", rom: "po", group: "p", lesson: 2 },
];

const WORD_DATA = [
  // Begrüßungen und Ausdrücke
  { word: "すみません", rom: "sumimasen", german: "Entschuldigung / Tut mir leid", lesson: 1 },
  { word: "おはよう", rom: "ohayou", german: "Guten Morgen", lesson: 1 },
  { word: "こんにちは", rom: "konnichiwa", german: "Guten Tag", lesson: 1 },
  { word: "さようなら", rom: "sayounara", german: "Auf Wiedersehen", lesson: 1 },
  { word: "おやすみ", rom: "oyasumi", german: "Gute Nacht", lesson: 1 },
  { word: "はい", rom: "hai", german: "Ja", lesson: 1 },
  { word: "いいえ", rom: "iie", german: "Nein", lesson: 1 },
  // Personen
  { word: "わたし", rom: "watashi", german: "ich", lesson: 1 },
  { word: "あなた", rom: "anata", german: "du", lesson: 1 },
  { word: "かれ", rom: "kare", german: "er", lesson: 1 },
  { word: "ひと", rom: "hito", german: "Person", lesson: 1 },
  { word: "おんな", rom: "onna", german: "Frau", lesson: 1 },
  { word: "おとこ", rom: "otoko", german: "Mann", lesson: 1 },
  { word: "せんせい", rom: "sensei", german: "Lehrer", lesson: 1 },
  // Tiere
  { word: "いぬ", rom: "inu", german: "Hund", lesson: 1 },
  { word: "ねこ", rom: "neko", german: "Katze", lesson: 1 },
  { word: "さかな", rom: "sakana", german: "Fisch", lesson: 1 },
  // Essen und Natur
  { word: "のみもの", rom: "nomimono", german: "Getränk", lesson: 1 },
  { word: "やさい", rom: "yasai", german: "Gemüse", lesson: 1 },
  // Körper
  { word: "て", rom: "te", german: "Hand", lesson: 1 },
  { word: "あし", rom: "ashi", german: "Fuß", lesson: 1 },
  { word: "め", rom: "me", german: "Auge", lesson: 1 },
  { word: "みみ", rom: "mimi", german: "Ohr", lesson: 1 },
  { word: "はな", rom: "hana", german: "Nase", lesson: 1 },
  { word: "くち", rom: "kuchi", german: "Mund", lesson: 1 },
  { word: "あたま", rom: "atama", german: "Kopf", lesson: 1 },
  // Zahlen
  { word: "いち", rom: "ichi", german: "eins", lesson: 1 },
  { word: "に", rom: "ni", german: "zwei", lesson: 1 },
  { word: "さん", rom: "san", german: "drei", lesson: 1 },
  { word: "よん", rom: "yon", german: "vier", lesson: 1 },
  { word: "ろく", rom: "roku", german: "sechs", lesson: 1 },
  { word: "なな", rom: "nana", german: "sieben", lesson: 1 },
  { word: "はち", rom: "hachi", german: "acht", lesson: 1 },
  // Fragewörter und Sonstiges
  { word: "なに", rom: "nani", german: "was", lesson: 1 },
  { word: "いくら", rom: "ikura", german: "wie viel / wie teuer", lesson: 1 },
  { word: "たいへん", rom: "taihen", german: "sehr / schlimm", lesson: 1 },
  // Alltagsgegenstände und Orte
  { word: "ほん", rom: "hon", german: "Buch", lesson: 1 },
  { word: "かさ", rom: "kasa", german: "Regenschirm", lesson: 1 },
  { word: "くるま", rom: "kuruma", german: "Auto", lesson: 1 },
  { word: "ひこうき", rom: "hikouki", german: "Flugzeug", lesson: 1 },
  { word: "ふね", rom: "fune", german: "Schiff", lesson: 1 },
  { word: "いす", rom: "isu", german: "Stuhl", lesson: 1 },
  { word: "つくえ", rom: "tsukue", german: "Tisch", lesson: 1 },
  { word: "とけい", rom: "tokei", german: "Uhr", lesson: 1 },
  { word: "くつ", rom: "kutsu", german: "Schuhe", lesson: 1 },
  { word: "ふく", rom: "fuku", german: "Kleidung", lesson: 1 },
  { word: "こうえん", rom: "kouen", german: "Park", lesson: 1 },
  { word: "まち", rom: "machi", german: "Stadt", lesson: 1 },
  { word: "みせ", rom: "mise", german: "Geschäft", lesson: 1 },
  { word: "いま", rom: "ima", german: "jetzt", lesson: 1 },
  { word: "あさ", rom: "asa", german: "Morgen", lesson: 1 },
  { word: "ひる", rom: "hiru", german: "Mittag", lesson: 1 },
  { word: "よる", rom: "yoru", german: "Nacht", lesson: 1 },
  { word: "いえ", rom: "ie", german: "Haus", lesson: 1 },
  { word: "うち", rom: "uchi", german: "Zuhause", lesson: 1 },
];

const GROUP_LABELS = {
  vowels: "Vokale",
  k: "か行 (K)",
  s: "さ行 (S)",
  t: "た行 (T)",
  n: "な行 (N)",
  h: "は行 (H)",
  m: "ま行 (M)",
  y: "や行 (Y)",
  r: "ら行 (R)",
  w: "わ行 (W) · ん",
  g: "が行 (G)",
  z: "ざ行 (Z)",
  d: "だ行 (D)",
  b: "ば行 (B)",
  p: "ぱ行 (P)",
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getWrongOptions(correct, pool, count = 2) {
  const others = pool.filter((x) => x.rom !== correct.rom);
  return shuffle(others).slice(0, count);
}

// ── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Noto Sans JP', sans-serif;
    background: #0d0d0f;
    color: #e8e4dc;
    min-height: 100dvh;
    overflow-x: hidden;
  }

  .app { max-width: 900px; margin: 0 auto; padding: 2rem 1rem 4rem; min-height: 100dvh; }

  .header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .header-eyebrow {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #b8860b;
    margin-bottom: 0.5rem;
  }
  .header-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 6vw, 3.2rem);
    color: #f5f0e8;
    line-height: 1.1;
  }
  .header-sub {
    font-size: 13px;
    color: #666;
    margin-top: 0.5rem;
  }

  .nav {
    display: flex;
    gap: 6px;
    margin-bottom: 2.5rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 5px;
  }
  .nav-btn {
    flex: 1;
    padding: 10px;
    border: none;
    background: transparent;
    color: #888;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .nav-btn:hover { color: #e8e4dc; background: rgba(255,255,255,0.05); }
  .nav-btn.active { background: #b8860b; color: #fff; }

  /* Overview */
  .lesson-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }
  .filter-pill {
    padding: 5px 14px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.12);
    background: transparent;
    color: #888;
    font-size: 12px;
    font-family: 'Noto Sans JP', sans-serif;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-pill:hover { border-color: #b8860b; color: #b8860b; }
  .filter-pill.active { background: rgba(184,134,11,0.15); border-color: #b8860b; color: #b8860b; }

  .section { margin-bottom: 2rem; }
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .section-label {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
    font-weight: 500;
  }
  .section-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }

  .hira-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 6px;
  }
  .hira-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 12px 8px 10px;
    text-align: center;
    cursor: default;
    transition: all 0.15s;
  }
  .hira-card:hover {
    border-color: rgba(184,134,11,0.4);
    background: rgba(184,134,11,0.06);
    transform: translateY(-1px);
  }
  .hira-char { font-size: 28px; line-height: 1; color: #f0ece4; display: block; }
  .hira-rom { font-size: 11px; color: #666; margin-top: 5px; }

  /* Quiz */
  .quiz-wrap { display: flex; flex-direction: column; align-items: center; }

  .quiz-score-bar {
    width: 100%;
    max-width: 480px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  .score-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 100px;
    padding: 5px 16px;
    font-size: 13px;
    color: #888;
  }
  .score-pill span { color: #e8e4dc; font-weight: 500; }

  .quiz-card {
    width: 100%;
    max-width: 480px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .quiz-prompt-label {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 1rem;
  }
  .quiz-big-char {
    font-size: 100px;
    line-height: 1;
    color: #f5f0e8;
    display: block;
    margin: 0.2rem 0 0.5rem;
    text-shadow: 0 0 60px rgba(184,134,11,0.2);
  }
  .quiz-big-rom {
    font-family: 'DM Serif Display', serif;
    font-size: 52px;
    color: #f5f0e8;
    letter-spacing: 0.05em;
  }

  .options-grid {
    width: 100%;
    max-width: 480px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .opt-btn {
    padding: 14px 20px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.03);
    color: #c8c4bc;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .opt-btn:hover:not(:disabled) {
    border-color: rgba(184,134,11,0.5);
    background: rgba(184,134,11,0.08);
    color: #f5f0e8;
  }
  .opt-btn.correct {
    border-color: #4caf50;
    background: rgba(76,175,80,0.12);
    color: #81c784;
  }
  .opt-btn.wrong {
    border-color: #ef5350;
    background: rgba(239,83,80,0.12);
    color: #ef9a9a;
  }
  .opt-btn:disabled { cursor: default; }
  .opt-char { font-size: 28px; }
  .opt-rom { font-size: 16px; }

  .quiz-feedback {
    margin-top: 1.2rem;
    font-size: 14px;
    color: #666;
    min-height: 20px;
    text-align: center;
  }
  .quiz-feedback.ok { color: #81c784; }
  .quiz-feedback.err { color: #ef9a9a; }

  .next-btn {
    margin-top: 1.5rem;
    padding: 12px 32px;
    border-radius: 100px;
    border: 1px solid rgba(184,134,11,0.5);
    background: rgba(184,134,11,0.12);
    color: #b8860b;
    font-family: 'Noto Sans JP', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.05em;
  }
  .next-btn:hover { background: rgba(184,134,11,0.22); color: #d4a020; }

  .lesson-filter-quiz {
    display: flex;
    gap: 6px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .countdown-placeholder {
    padding: 14px 20px;
    border-radius: 12px;
    border: 1px dashed rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.02);
    color: #666;
    font-size: 16px;
    text-align: center;
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    letter-spacing: 0.05em;
  }

  .quiz-big-word {
    font-size: clamp(2.5rem, 8vw, 4rem);
    color: #f5f0e8;
    line-height: 1.2;
    display: block;
    margin: 0.2rem 0 0.5rem;
  }
  .quiz-sub-label {
    font-size: 13px;
    color: #888;
    margin-top: 0.5rem;
  }
  .opt-word {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    .app { padding: 1rem 0.75rem calc(1rem + env(safe-area-inset-bottom)); }
    .header { margin-bottom: 1.25rem; padding-bottom: 1rem; }
    .header-title { font-size: 1.8rem; }
    .header-eyebrow { font-size: 10px; margin-bottom: 0.3rem; }
    .header-sub { font-size: 12px; margin-top: 0.3rem; }
    .nav {
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      margin-bottom: 1.25rem;
      padding: 4px;
      gap: 4px;
    }
    .nav::-webkit-scrollbar { display: none; }
    .nav-btn { flex: 0 0 auto; min-width: 100px; padding: 8px 10px; font-size: 11px; border-radius: 6px; }
    .lesson-filter { margin-bottom: 1rem; gap: 6px; }
    .filter-pill { padding: 4px 10px; font-size: 11px; }
    .quiz-score-bar { margin-bottom: 1rem; }
    .quiz-card { padding: 1.5rem 1rem; margin-bottom: 1rem; border-radius: 16px; }
    .quiz-big-char { font-size: 72px; }
    .quiz-big-rom { font-size: 40px; }
    .quiz-big-word { font-size: 2rem; }
    .quiz-sub-label { font-size: 12px; }
    .options-grid { gap: 6px; }
    .opt-btn { padding: 12px 16px; font-size: 16px; border-radius: 10px; }
    .opt-char { font-size: 24px; }
    .opt-rom { font-size: 14px; }
    .opt-word { font-size: 18px; }
    .next-btn { margin-top: 1rem; padding: 10px 24px; }
    .quiz-feedback { margin-top: 0.75rem; }
    .section { margin-bottom: 1.25rem; }
    .hira-grid { grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 5px; }
    .hira-card { padding: 10px 6px 8px; }
    .hira-char { font-size: 24px; }
    .hira-rom { font-size: 10px; }
    .countdown-placeholder { padding: 12px 16px; font-size: 14px; min-height: 44px; }
    .lesson-filter-quiz { margin-bottom: 1rem; gap: 6px; }
  }
`;

// ── Overview Component ───────────────────────────────────────────────────────
function Overview() {
  const [lessonFilter, setLessonFilter] = useState("all");

  const filtered =
    lessonFilter === "all"
      ? HIRAGANA_DATA
      : HIRAGANA_DATA.filter((h) => h.lesson === Number(lessonFilter));

  const groups = {};
  filtered.forEach((h) => {
    if (!groups[h.group]) groups[h.group] = [];
    groups[h.group].push(h);
  });

  return (
    <div>
      <div className="lesson-filter">
        {["all", "1", "2"].map((l) => (
          <button
            key={l}
            className={`filter-pill ${lessonFilter === l ? "active" : ""}`}
            onClick={() => setLessonFilter(l)}
          >
            {l === "all"
              ? "Alle Zeichen"
              : l === "1"
                ? "Lektion 1 — Grundzeichen"
                : "Lektion 2 — Dakuten & Handakuten"}
          </button>
        ))}
      </div>

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="section">
          <div className="section-header">
            <span className="section-label">
              {GROUP_LABELS[group] || group}
            </span>
            <div className="section-line" />
          </div>
          <div className="hira-grid">
            {items.map((h) => (
              <div key={h.char} className="hira-card">
                <span className="hira-char">{h.char}</span>
                <span className="hira-rom">{h.rom}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Quiz Component ───────────────────────────────────────────────────────────
function Quiz({ mode }) {
  // mode: "char2rom" = zeige Hiragana, wähle Aussprache
  //       "rom2char" = zeige Aussprache, wähle Hiragana
  const [lessonFilter, setLessonFilter] = useState("1");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const pool =
    lessonFilter === "all"
      ? HIRAGANA_DATA
      : HIRAGANA_DATA.filter((h) => h.lesson === Number(lessonFilter));

  const makeQuestion = useCallback(() => {
    const correct = shuffle(pool)[0];
    const wrongs = getWrongOptions(correct, pool, 2);
    const options = shuffle([correct, ...wrongs]);
    setQuestion({ correct, options });
  }, [pool]);

  useEffect(() => {
    if (!question) return;

    setSelected(null);
    setFeedback(null);
    setOptionsVisible(false);
    setCountdown(3);

    let intervalId;
    intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setOptionsVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [question]);

  if (!question) {
    makeQuestion();
    return null;
  }

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.rom === question.correct.rom;
    setFeedback(
      isCorrect ? "Richtig! ✓" : `Falsch — es war „${question.correct.rom}"`,
    );
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const accuracy =
    score.total === 0
      ? "—"
      : Math.round((score.correct / score.total) * 100) + "%";

  return (
    <div className="quiz-wrap">
      <div className="lesson-filter-quiz">
        {["1", "2", "all"].map((l) => (
          <button
            key={l}
            className={`filter-pill ${lessonFilter === l ? "active" : ""}`}
            onClick={() => {
              setLessonFilter(l);
              setQuestion(null);
              setScore({ correct: 0, total: 0 });
            }}
          >
            {l === "1" ? "Lektion 1" : l === "2" ? "Lektion 1+2" : "Alle"}
          </button>
        ))}
      </div>

      <div className="quiz-score-bar">
        <div className="score-pill">
          Richtig <span>{score.correct}</span>
        </div>
        <div className="score-pill">
          Gesamt <span>{score.total}</span>
        </div>
        <div className="score-pill">
          Quote <span>{accuracy}</span>
        </div>
      </div>

      <div className="quiz-card">
        <div className="quiz-prompt-label">
          {mode === "char2rom"
            ? "Wie lautet die Aussprache?"
            : "Welches Zeichen ist das?"}
        </div>
        {mode === "char2rom" ? (
          <span className="quiz-big-char">{question.correct.char}</span>
        ) : (
          <span className="quiz-big-rom">{question.correct.rom}</span>
        )}
      </div>

      <div className="options-grid">
        {optionsVisible ? (
          question.options.map((opt) => {
            let cls = "opt-btn";
            if (selected) {
              if (opt.rom === question.correct.rom) cls += " correct";
              else if (opt.rom === selected.rom) cls += " wrong";
            }
            return (
              <button
                key={opt.char + opt.rom}
                className={cls}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
              >
                {mode === "char2rom" ? (
                  <span className="opt-rom">{opt.rom}</span>
                ) : (
                  <span className="opt-char">{opt.char}</span>
                )}
              </button>
            );
          })
        ) : (
          <div className="countdown-placeholder">
            Antworten in {countdown}...
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`quiz-feedback ${selected?.rom === question.correct.rom ? "ok" : "err"}`}
        >
          {feedback}
        </div>
      )}

      {selected && (
        <button className="next-btn" onClick={makeQuestion}>
          Nächste Frage →
        </button>
      )}
    </div>
  );
}

// ── Word Quiz Component ────────────────────────────────────────────────────
function WordQuiz({ mode }) {
  // mode: "char2rom" = zeige Hiragana-Wort, wähle Aussprache
  //       "rom2char" = zeige Aussprache, wähle Hiragana-Wort
  const [lessonFilter, setLessonFilter] = useState("1");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const pool =
    lessonFilter === "all"
      ? WORD_DATA
      : WORD_DATA.filter((w) => w.lesson === Number(lessonFilter));

  const makeQuestion = useCallback(() => {
    const correct = shuffle(pool)[0];
    const wrongs = getWrongOptions(correct, pool, 2);
    const options = shuffle([correct, ...wrongs]);
    setQuestion({ correct, options });
  }, [pool]);

  useEffect(() => {
    if (!question) return;

    setSelected(null);
    setFeedback(null);
    setOptionsVisible(false);
    setCountdown(3);

    let intervalId;
    intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setOptionsVisible(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [question]);

  if (!question) {
    makeQuestion();
    return null;
  }

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.rom === question.correct.rom;
    setFeedback(
      isCorrect ? "Richtig! ✓" : `Falsch — es war „${question.correct.rom}"`,
    );
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  };

  const accuracy =
    score.total === 0
      ? "—"
      : Math.round((score.correct / score.total) * 100) + "%";

  return (
    <div className="quiz-wrap">
      <div className="lesson-filter-quiz">
        {["1", "all"].map((l) => (
          <button
            key={l}
            className={`filter-pill ${lessonFilter === l ? "active" : ""}`}
            onClick={() => {
              setLessonFilter(l);
              setQuestion(null);
              setScore({ correct: 0, total: 0 });
            }}
          >
            {l === "1" ? "Lektion 1" : "Alle Wörter"}
          </button>
        ))}
      </div>

      <div className="quiz-score-bar">
        <div className="score-pill">
          Richtig <span>{score.correct}</span>
        </div>
        <div className="score-pill">
          Gesamt <span>{score.total}</span>
        </div>
        <div className="score-pill">
          Quote <span>{accuracy}</span>
        </div>
      </div>

      <div className="quiz-card">
        <div className="quiz-prompt-label">
          {mode === "char2rom"
            ? "Wie lautet die Aussprache?"
            : "Welches Wort ist das?"}
        </div>
        {mode === "char2rom" ? (
          <span className="quiz-big-word">{question.correct.word}</span>
        ) : (
          <span className="quiz-big-rom">{question.correct.rom}</span>
        )}
        <div className="quiz-sub-label">
          Deutsche Bedeutung: {question.correct.german}
        </div>
      </div>

      <div className="options-grid">
        {optionsVisible ? (
          question.options.map((opt) => {
            let cls = "opt-btn";
            if (selected) {
              if (opt.rom === question.correct.rom) cls += " correct";
              else if (opt.rom === selected.rom) cls += " wrong";
            }
            return (
              <button
                key={opt.word + opt.rom}
                className={cls}
                onClick={() => handleSelect(opt)}
                disabled={!!selected}
              >
                {mode === "char2rom" ? (
                  <span className="opt-rom">{opt.rom}</span>
                ) : (
                  <span className="opt-word">{opt.word}</span>
                )}
              </button>
            );
          })
        ) : (
          <div className="countdown-placeholder">
            Antworten in {countdown}...
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`quiz-feedback ${selected?.rom === question.correct.rom ? "ok" : "err"}`}
        >
          {feedback}
        </div>
      )}

      {selected && (
        <button className="next-btn" onClick={makeQuestion}>
          Nächste Frage →
        </button>
      )}
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="header">
          <div className="header-eyebrow">みんなの日本語 · A1.1.1</div>
          <h1 className="header-title">Hiragana</h1>
          <p className="header-sub">Strukturierte Übersicht & Quizmodus</p>
        </header>

        <nav className="nav">
          {[
            { id: "overview", label: "Übersicht", icon: "⊞" },
            { id: "quiz-char", label: "Zeichen → Aussprache", icon: "あ→" },
            { id: "quiz-rom", label: "Aussprache → Zeichen", icon: "→あ" },
            { id: "quiz-word-char", label: "Wort → Aussprache", icon: "私→" },
            { id: "quiz-word-rom", label: "Aussprache → Wort", icon: "→私" },
          ].map((t) => (
            <button
              key={t.id}
              className={`nav-btn ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {tab === "overview" && <Overview />}
        {tab === "quiz-char" && <Quiz key="char2rom" mode="char2rom" />}
        {tab === "quiz-rom" && <Quiz key="rom2char" mode="rom2char" />}
        {tab === "quiz-word-char" && <WordQuiz key="word-char2rom" mode="char2rom" />}
        {tab === "quiz-word-rom" && <WordQuiz key="word-rom2char" mode="rom2char" />}
      </div>
    </>
  );
}
