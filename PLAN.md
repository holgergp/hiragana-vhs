# Plan: 3-Sekunden-Denkphase im Quiz

## Ziel
In den beiden Quiz-Modi (`Zeichen → Aussprache` und `Aussprache → Zeichen`) sollen die Antwortmöglichkeiten erst nach einer kurzen Denkphase von **3 Sekunden** eingeblendet werden. Das zu erratende Zeichen/die Aussprache selbst ist sofort sichtbar.

## Betroffene Datei
- `src/App.jsx`

---

## 1. React-Import erweitern
**Aktion:** `useEffect` zu den bestehenden React-Imports (`useState`, `useCallback`) hinzufügen.

---

## 2. Neue State-Variablen im `Quiz`-Component
**Aktion:** Zwei neue `useState`-Hooks innerhalb der `Quiz`-Funktion einführen:
- `const [optionsVisible, setOptionsVisible] = useState(false);`
  - Steuert, ob die Antwort-Buttons gerendert werden dürfen.
- `const [countdown, setCountdown] = useState(3);`
  - Zeigt die verbleibende Zeit an.

---

## 3. Timer-Logik mit `useEffect`
**Aktion:** Einen neuen `useEffect`-Block hinzufügen, der auf Änderungen des `question`-States reagiert.

**Ablauf:**
1. Bei jedem neuen `question` (inkl. Initialisierung und "Nächste Frage"):
   - `setOptionsVisible(false)`
   - `setCountdown(3)`
2. Ein `setInterval` wird gestartet, der jede Sekunde (`1000ms`) ausgelöst wird.
3. Bei jedem Tick:
   - `setCountdown` wird mit dem vorherigen Wert `prev => prev - 1` aufgerufen.
4. Sobald der Countdown bei `0` ankommt:
   - `setOptionsVisible(true)`
   - Der Intervall wird mit `clearInterval` gestoppt.

**Cleanup:**
- Die Cleanup-Funktion des `useEffect` muss `clearInterval(intervalId)` aufrufen, um Memory-Leaks zu vermeiden, falls die Komponente unmounted wird oder der Effekt vorzeitig neu ausgelöst wird (z. B. durch Filterwechsel).

---

## 4. `makeQuestion` anpassen
**Aktion:** Die Funktion `makeQuestion` bleibt im Kern unverändert (sie generiert Frage, Distraktoren und shuffelt).

**Anpassung:**
- Das Zurücksetzen der Timer-States (`optionsVisible`, `countdown`) wird **nicht** manuell in `makeQuestion` gemacht, sondern ausschließlich vom neuen `useEffect` übernommen, sobald sich der `question`-State ändert.

---

## 5. Rendering der Optionen anpassen
**Aktion:** Der Teil im JSX, der die Antwort-Buttons (`question.options.map(...)`) rendert, wird bedingt.

**Logik:**
- **Während des Countdowns (`!optionsVisible`):**
  - Anstelle der Buttons wird ein Placeholder innerhalb des `options-grid`-Containers angezeigt.
  - Inhalt: Ein zentrierter Hinweis wie z.B. `"Antworten in {countdown}..."`.
  - Das Layout (Höhe, Breite) sollte stabil bleiben, um ein starkes Springen der Seite beim Einblenden der Buttons zu vermeiden.
- **Nach Ablauf der 3 Sekunden (`optionsVisible`):**
  - Die gewohnten Antwort-Buttons werden normal eingeblendet und sind klickbar.

**Wichtig:** Das Frage-Prompt (das große Hiragana-Zeichen oder die Romanisierung) bleibt während der gesamten 3 Sekunden sichtbar, damit der Nutzer schon überlegen kann.

---

## 6. Styling (CSS-Template-String)
**Aktion:** Dem bestehenden `css`-Template-String einige neue Regeln hinzufügen.

**Neue Klassen:**
- `.countdown-placeholder`: Styling für den Text, der während des Countdowns angezeigt wird.
  - Dezente Farbe (z.B. `#666` oder `#888`), passend zum Dark Theme.
  - Mindestens die gleiche Höhe (`min-height`) wie die Button-Liste, damit der Layout-Sprung minimal ist.
  - Zentrierte Ausrichtung (`display: flex`, `align-items: center`, `justify-content: center`).

**Design-Prinzipien:**
- Keine Änderung am bestehenden Farbschema (Dark Theme, Gold-Akzente).
- Keine neuen externen Abhängigkeiten.

---

## 7. Edge-Cases abdecken

| Szenario | Verhalten |
|---|---|
| **Initialer Start** | Die erste Frage wird geladen, Countdown startet sofort bei 3. |
| **"Nächste Frage"** | `makeQuestion` setzt einen neuen `question`-State. Der `useEffect` erkennt die Änderung, setzt den Countdown zurück und startet neu. |
| **Lektions-Filterwechsel** | Der Filterwechsel setzt `question` auf `null` und anschließend neu. `useEffect` startet den Countdown neu. |
| **Tab-Wechsel** | Durch den `key`-Prop (`key="char2rom"` / `key="rom2char"`) wird die `Quiz`-Komponente komplett neu gemountet. Der State wird frisch initialisiert, der Timer startet sauber. |
| **Schnelles Umschalten** | Dank der `useEffect`-Cleanup-Funktion (`clearInterval`) werden alte, nicht mehr benötigte Intervalle zuverlässig gelöscht. |

---

## Zusammenfassung der Änderungen
- **~5 Zeilen:** Import-Erweiterung + neue `useState`-Hooks.
- **~15 Zeilen:** Neuer `useEffect`-Block für den Countdown-Timer.
- **~10 Zeilen:** Anpassung des JSX-Renderings (bedingte Anzeige der Buttons vs. Placeholder).
- **~5 Zeilen:** Neue CSS-Regeln im Template-String.

**Geschätzte Gesamtänderung:** ~35 neue Code-Zeilen in `src/App.jsx`.
