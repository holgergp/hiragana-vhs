# Mobile Viewport Optimization Plan

**Target device:** iPhone 16 Pro (393 × 852 logical px, ~732 px usable height after status bar + Dynamic Island)
**Goal:** Make the main quiz card + all 3 answer options visible without scrolling.

---

## 1. Respect iOS Safe Areas (`index.html`)

- Add `viewport-fit=cover` to the `<meta name="viewport">` tag so the app renders edge-to-edge.
- This enables `env(safe-area-inset-*)` in CSS to avoid the Dynamic Island and Home Indicator.

## 2. Use Dynamic Viewport Height (`App.jsx` CSS)

- Change `body` and `.app` from `min-height: 100vh` to `min-height: 100dvh`.
- `dvh` uses the actual dynamic viewport height on mobile browsers, preventing layout jumps when the browser chrome shows/hides.
- Add `overflow-x: hidden` to `body` to prevent accidental horizontal scroll.

## 3. Compact Header on Mobile

- Reduce `.header` `margin-bottom` and `padding-bottom`.
- Shrink `.header-title` to `1.8rem`.
- Tighten `.header-eyebrow` and `.header-sub` margins.

## 4. Horizontal Scroll Navigation

- On screens ≤ 480 px wide, switch `.nav` from `flex-wrap` to `nowrap` with horizontal scroll (`overflow-x: auto`).
- Hide the scrollbar (`scrollbar-width: none` + `::-webkit-scrollbar { display: none; }`).
- Make `.nav-btn` non-wrapping (`flex: 0 0 auto; min-width: 100px`) so each button has enough width for its label.
- This keeps the nav to a single predictable row (~45 px) instead of letting long German labels wrap unpredictably.

## 5. Tighten Quiz Spacing

- Reduce `.quiz-score-bar` `margin-bottom` to `1rem`.
- Reduce `.quiz-card` internal `padding` to `1.5rem 1rem` and `margin-bottom` to `1rem`.
- Reduce `.options-grid` `gap` to `6px`.
- Reduce `.opt-btn` `padding` to `12px 16px` so the 3 buttons are shorter.
- Reduce `.next-btn` and `.quiz-feedback` margins.

## 6. Scale Down Quiz Fonts

- `.quiz-big-char`: `100px` → `72px` (still very readable, shorter card).
- `.quiz-big-rom`: `52px` → `40px`.
- `.quiz-big-word`: `clamp(2.5rem, 8vw, 4rem)` → `2rem`.
- `.opt-char`, `.opt-rom`, `.opt-word`: slightly smaller on mobile.

## 7. Reduce Overview Grid Size

- Shrink `.hira-grid` columns to `minmax(60px, 1fr)` with `gap: 5px`.
- Reduce `.hira-card` padding and `.hira-char` font size so the grid is more compact.

## 8. Fix Bottom Padding / Home Indicator

- Change `.app` bottom padding from a fixed `4rem` to `calc(1rem + env(safe-area-inset-bottom))` on mobile.
- This prevents the Home Indicator from covering the “Nächste Frage” button or the last option.

---

## Expected Result on iPhone 16 Pro Portrait

With these changes the vertical stack becomes roughly:

| Element | Approx. Height |
|---|---|
| Status bar + safe area | ~50 px |
| Compact header | ~60 px |
| Single-row scrollable nav | ~45 px |
| Lesson filter | ~32 px |
| Score bar | ~35 px |
| Quiz card | ~130 px |
| 3 option buttons | ~120 px total |
| Feedback + Next button | ~60 px |
| Bottom safe area | ~34 px |
| **Total** | **≈ 566 px** |

**Well within the 732 px usable height.** No scrolling needed for the quiz.
