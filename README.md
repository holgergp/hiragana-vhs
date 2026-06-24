# 🎌 Hiragana Lernapp — みんなの日本語 A1.1.1

[![Netlify Status](https://api.netlify.com/api/v1/badges/b886b5dd-2fef-4dc8-9a77-3030ba18d427/deploy-status)](https://app.netlify.com/projects/hiragana-vhs/deploys)

Eine interaktive Lernapp für Hiragana, begleitend zum Japanischkurs A1.1.1 der VHS Düsseldorf mit dem Lehrbuch **Minna no Nihongo**.

🔗 **[→ App öffnen](https://holgergp.github.io/hiragana-vhs/)**

---

## Funktionen

- **Übersicht** — alle Hiragana strukturiert nach Reihen (か行, さ行 usw.), filterbar nach Lektion
- **Quiz: Zeichen → Aussprache** — ein Hiragana wird angezeigt, drei Aussprache-Optionen zur Auswahl
- **Quiz: Aussprache → Zeichen** — eine Romaji wird angezeigt, drei Hiragana zur Auswahl

## Lokale Entwicklung

```bash
npm install
npm run dev
```

## Technologie

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- Deployment via [GitHub Pages](https://pages.github.com/) & [Netlify](https://www.netlify.com/)

## Netlify Branch Deployments

Jeder Push auf einen beliebigen Branch erzeugt eine eigene Deploy-Preview:

1. Repository auf [Netlify](https://app.netlify.com/) importieren
2. Unter **Site configuration → Build & deploy → Branches** "Branch deploys" aktivieren
3. Fertig — jedes Pull Request und jeder Branch bekommen eine eigene URL

---

## Lektionsstruktur & Datenmodell

Die App unterscheidet streng zwischen dem Lernen einzelner Zeichen und dem Lernen von Wörtern anhand ihrer phonetischen Regeln:

### 1. Einzelne Zeichen (`HIRAGANA_DATA` in `src/data.js`)
* **Lektion 1:** Grundzeichen (Vokale, K-Reihe, S-Reihe etc.)
* **Lektion 2:** Dakuten & Handakuten (stimmhafte Laute wie が, ざ, だ, ば, ぱ)
* *Hinweis:* Für Zeichen-Quizzes gibt es nur Lektion 1 und 2, da die komplexeren Regeln (Lektion 3+) erst im Kontext ganzer Wörter Sinn ergeben.

### 2. Vokabeln / Wörter (`WORD_DATA` in `src/data.js`)
* **Lektion 1:** Einfache Wörter mit Grundzeichen
* **Lektion 2:** Wörter mit Dakuten/Handakuten
* **Lektion 3:** Lange Vokale (Chōon · 長音) — z. B. `aa`, `ou`
* **Lektion 4:** Doppelkonsonanten (Sokuon · 促音) — Verdoppelung mit kleinem `っ`
* **Lektion 5:** Verbindungsschreibweisen (Yōon · 拗音) — Gleitlaute mit kleinem `ゃ`, `ゅ`, `ょ`

### 3. Additive Quizzes
Sowohl im Zeichen- als auch im Wort-Quiz sind die Filter **additiv** gestaltet:
* Wenn du z. B. **Lektion 1-3 (Lange Vokale)** auswählst, fragt das Quiz Vokabeln aus Lektion 1, 2 und 3 gemischt ab. So festigst du altes Wissen, während du neue Regeln lernst!
