import { useState } from "react";
import { HIRAGANA_DATA, GROUP_LABELS } from "./data.js";
import Quiz from "./components/Quiz.jsx";
import WordQuiz from "./components/WordQuiz.jsx";

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

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("overview");
  const [wrongCounts, setWrongCounts] = useState({});

  const handleWrong = (key) => {
    setWrongCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

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
        {tab === "quiz-char" && (
          <Quiz key="char2rom" mode="char2rom" wrongCounts={wrongCounts} onWrong={handleWrong} />
        )}
        {tab === "quiz-rom" && (
          <Quiz key="rom2char" mode="rom2char" wrongCounts={wrongCounts} onWrong={handleWrong} />
        )}
        {tab === "quiz-word-char" && (
          <WordQuiz key="word-char2rom" mode="char2rom" wrongCounts={wrongCounts} onWrong={handleWrong} />
        )}
        {tab === "quiz-word-rom" && (
          <WordQuiz key="word-rom2char" mode="rom2char" wrongCounts={wrongCounts} onWrong={handleWrong} />
        )}
      </div>
    </>
  );
}
