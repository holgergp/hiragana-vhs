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
    min-height: 100vh;
  }

  .app { max-width: 900px; margin: 0 auto; padding: 2rem 1rem 4rem; }

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
      </div>
    </>
  );
}
