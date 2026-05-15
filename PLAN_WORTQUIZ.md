# Plan: Wort-Quiz-Modus

## Ziel
Zwei neue Quiz-Tabs für das Lernen von Wörtern aus den behandelten Lektionen:

| Tab | Anzeige (Prompt) | Antwortmöglichkeiten |
|-----|------------------|----------------------|
| **Wort → Aussprache** | Ein Hiragana-Wort + deutsche Übersetzung | 3 Romaji-Wörter |
| **Aussprache → Wort** | Ein Romaji-Wort + deutsche Übersetzung | 3 Hiragana-Wörter |

Die deutsche Übersetzung ist immer sichtbar, damit der Lernkontext klar bleibt.

---

## Betroffene Datei
- `src/App.jsx`

---

## 1. Neue Datenstruktur: `WORD_DATA`

**Aktion:** Neues Array `WORD_DATA` direkt unter `HIRAGANA_DATA` anlegen.

**Struktur pro Eintrag:**
```js
{ word: "わたし", rom: "watashi", german: "ich", lesson: 1 }
{ word: "あなた", rom: "anata", german: "du", lesson: 1 }
// ...
```

**Felder:**
- `word` — das Hiragana-Wort
- `rom` — Hepburn-Romanisierung
- `german` — deutsche Bedeutung
- `lesson` — Lektionsnummer (analog zum Kursfortschritt)

**Initialer Inhalt:** Starterliste mit ~15–20 Wörtern aus *Minna no Nihongo Lektion 1* (z. B. watashi, anata, san, sensei, gakusei, …).

---

## 2. Neue Komponente: `WordQuiz({ mode })`

**Aktion:** Eigene `WordQuiz`-Komponente einführen, analog zum bestehenden `Quiz`.

**State (identisch zu `Quiz`):**
- `lessonFilter`, `score`, `question`, `selected`, `feedback`, `optionsVisible`, `countdown`

**Wichtige Funktionen:**
- `makeQuestion()` — shuffelt aus `WORD_DATA`, generiert 3 Optionen (1 korrekt + 2 Distraktoren)
- `getWrongOptions()` kann wiederverwendet werden (Vergleich über `rom` funktioniert auch für Wörter)
- Timer-Logik mit `useEffect` — identisch zur 3-Sekunden-Denkphase im Zeichen-Quiz

---

## 3. Tab-Router erweitern

**Aktion:** Navigation im `App`-Component um zwei Einträge erweitern.

**Neue Nav-Einträge:**
```js
{ id: "quiz-word-char", label: "Wort → Aussprache", icon: "私→" }
{ id: "quiz-word-rom",  label: "Aussprache → Wort", icon: "→私" }
```

**Neues Conditional Rendering:**
```jsx
{tab === "quiz-word-char" && <WordQuiz key="word-char2rom" mode="char2rom" />}
{tab === "quiz-word-rom"  && <WordQuiz key="word-rom2char" mode="rom2char" />}
```

---

## 4. UI/UX Anpassungen

### Frage-Karte (`quiz-card`)
Da Wörter länger als einzelne Zeichen sind, braucht es eine angepasste Darstellung:

- **Hiragana-Wort:** Größere Schrift als Romaji, aber kleiner als einzelne Zeichen (z. B. `clamp(2.5rem, 8vw, 4rem)` statt 100px), damit längere Wörter nicht umbrechen.
- **Romaji-Wort:** Gleiche Schriftgröße wie bisher (`quiz-big-rom` passt).
- **Deutsche Übersetzung:** Immer als Untertitel sichtbar, z. B. in `.quiz-sub-label` (klein, `#888`): *„deutsche Bedeutung: ich”*

### Antwort-Buttons (`opt-btn`)
- Bei **Aussprache → Wort**: Buttons zeigen die Hiragana-Wörter (`.opt-char`, etwas kleinere Schrift als Einzelzeichen, damit 3–4 Silben passen).
- Bei **Wort → Aussprache**: Buttons zeigen die Romaji-Wörter (`.opt-rom`).

### Filter-Pills
Analog zum Zeichen-Quiz: Filter nach Lektion (zunächst nur `"1"`, `"all"`).

### Countdown & Score
Identisches Verhalten wie im bestehenden Quiz:
- 3-Sekunden-Countdown vor Einblenden der Optionen
- Score-Reset bei Filterwechsel
- Korrekte/Inkorrekte Feedback-Farben

---

## 5. Styling (CSS-Template-String)

**Aktion:** Dem bestehenden `css`-Template-String neue Regeln hinzufügen.

**Neue Klassen:**
```css
.quiz-big-word {
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: #f5f0e8;
  line-height: 1.2;
}
.quiz-sub-label {
  font-size: 13px;
  color: #888;
  margin-top: 0.5rem;
}
```

**Design-Prinzipien:**
- Keine Änderung am bestehenden Farbschema (Dark Theme, Gold-Akzente).
- Keine neuen externen Abhängigkeiten.
- Responsive Darstellung für längere Wörter.

---

## 6. Implementierungs-Schritte

| # | Schritt |
|---|---------|
| 1 | `WORD_DATA` mit initialen Vokabeln aus Minna no Nihongo Lektion 1 anlegen |
| 2 | `WordQuiz`-Komponente schreiben (Kopie von `Quiz`, angepasst auf Wörter + German-Label) |
| 3 | Navigation erweitern (`nav`-Array + Conditional Rendering) |
| 4 | CSS-Regeln für Wort-Darstellung ergänzen |
| 5 | Lokal testen (`npm run dev`) — Filter, Countdown, Distraktoren prüfen |

---

## 7. Edge-Cases

| Szenario | Verhalten |
|---|---|
| **Pool zu klein** | `getWrongOptions()` muss sicherstellen, dass mindestens 3 Wörter in der gefilterten Menge sind. Falls weniger, keine Frage generieren oder Hinweis anzeigen. |
| **Lektions-Filterwechsel** | Score wird zurückgesetzt, neue Frage wird generiert. |
| **Tab-Wechsel** | Durch den `key`-Prop wird `WordQuiz` komplett neu gemountet. State wird frisch initialisiert. |
| **Wiederholte Distraktoren** | `shuffle()` + `slice()` gewährleistet zufällige, aber eindeutige Distraktoren. |

---

## Zusammenfassung der Änderungen

- **~20 Zeilen:** Neue `WORD_DATA` mit initialen Vokabeln.
- **~120 Zeilen:** Neue `WordQuiz`-Komponente (analog zu `Quiz`, leicht angepasst).
- **~4 Zeilen:** Erweiterung der Navigation (`nav`-Array).
- **~2 Zeilen:** Neues Conditional Rendering für die beiden Tabs.
- **~5 Zeilen:** Neue CSS-Regeln im Template-String.

**Geschätzte Gesamtänderung:** ~150 neue Code-Zeilen in `src/App.jsx`.
