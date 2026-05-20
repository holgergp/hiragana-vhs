import { useState, useCallback, useEffect } from "react";
import { HIRAGANA_DATA } from "../data.js";
import { getWrongOptions, pickWeighted, shuffle } from "../quizUtils.js";

// Quiz für Hiragana-Zeichen
// mode: "char2rom" = zeige Hiragana, wähle Aussprache
//       "rom2char" = zeige Aussprache, wähle Hiragana
export default function Quiz({ mode, wrongCounts, onWrong }) {
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
    const correct = pickWeighted(pool, wrongCounts, (item) => item.char);
    const wrongs = getWrongOptions(correct, pool, 2);
    const options = shuffle([correct, ...wrongs]);
    setQuestion({ correct, options });
  }, [pool, wrongCounts]);

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
    if (!isCorrect) {
      onWrong(question.correct.char);
    }
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
