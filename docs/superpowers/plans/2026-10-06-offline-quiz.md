# Offline Maverick or Goose Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver an entertaining, mobile-first, offline personality quiz as one shareable HTML file.

**Architecture:** Keep the deliverable self-contained in `index.html`, with separate internal sections for content, pure scoring, session state, rendering, timing, and audio. Developer-only browser tests exercise the actual file and never become recipient dependencies.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Web Audio; Node.js and Playwright for developer tests only.

**Spec:** `docs/superpowers/specs/2026-10-06-offline-quiz-design.md`

## Global Constraints

- Use one `index.html` containing all markup, CSS, JavaScript, question data, vector decoration, and synthesized audio code.
- Use 15 questions mixing everyday situations and fictional flight-school scenarios.
- Give each question 20 seconds and play a synthesized cockpit-style warning during the final five seconds.
- Write eight everyday scenarios and seven flight-school scenarios.
- Each prompt should be at most 35 words and each option at most 16 words so the 20-second limit is practical.
- Require at least ten answers to produce a personality result.
- Mobile is the primary layout target; desktop is a responsive extension.
- Use the existing isolated checkout; do not create a worktree unless explicitly requested.
- No external runtime assets, requests, libraries, build step, storage, or reporting. Keep test dependencies separate.

## Review Focus

- Rapid repeated taps must not answer the next question accidentally (Task 2).
- Switching apps or locking the screen must not consume unseen questions (Task 2).
- Audio API rejection or suspension must not prevent completion (Task 3).
- Small screens, landscape, and enlarged text must retain reachable controls (Task 2).
- Mobile attachment previews may not execute HTML: distinguish supported browser behavior from actual-device delivery claims (Task 4).

## File Map

- `index.html`: complete recipient deliverable; inline script IDs `quiz-core` and `quiz-app` separate pure logic from browser effects.
- `package.json`, `package-lock.json`, `.gitignore`, `playwright.config.js`: minimal reproducible developer test setup; no application build.
- `tests/scoring.test.cjs`: Node tests evaluating the actual `quiz-core` script in an isolated VM.
- `tests/quiz.spec.js`: offline browser, interaction, timing, audio lifecycle, and responsive tests.
- `README.md`: distribution instructions, developer commands, browser limitations, and verification evidence.

### Task 1: Question content and deterministic scoring

**Files:** Create `index.html`, `tests/scoring.test.cjs`, and developer test configuration listed above.

**Interfaces:** The pure inline core exports `globalThis.QuizCore = {questions, scoreAnswers}`. A question is `{id, kind, prompt, options}`; kind is `everyday` or `flight`. An option is `{id, text, traits: [number, number, number, number]}`. `scoreAnswers(answers)` consumes question-ordered `{questionId, optionId}` records (null option ID means timeout), returning `{answeredCount, character}` where character is `Maverick`, `Goose`, or null. It never reads the DOM, clock, or randomness.

- [ ] Write Node tests for 15 unique questions, 8/7 scenario split, three unique options each, word limits, integer traits in [-2, 2], multiple nonzero dimensions, nonzero weighted option scores, both score signs per question, and zero total weighted score across all 45 options. Assert `scoreAnswers(nineAnswers).character === null`, ten positives give Maverick, ten negatives give Goose, and a balanced fixture uses the earliest answered contribution. Assert timeouts do not change the total. Use synthetic fixtures for tie arithmetic if actual data has no convenient ten-answer tie.
- [ ] Run `node --test tests/scoring.test.cjs`; confirm failure is missing deliverable/core rather than a test syntax error.
- [ ] Implement the inline core and all original question/result copy. Use weights [2, 1, -2, -1], the spec's deterministic tie rule, and the ten-answer minimum. If needed, expose a pure `classifyContributions(contributions: number[]): string | null` helper to test tie arithmetic; `scoreAnswers` must use it. Review all 45 options for transparent character stereotypes.
- [ ] Pin Playwright as a development dependency, create a lockfile, and provide `npm test` for Node plus browser tests; ignore node_modules and generated reports.
- [ ] Rerun Node tests; require all intended assertions to execute and pass. Commit the task.

### Task 2: Mobile quiz interaction and robust timer

**Files:** Modify `index.html`; create `tests/quiz.spec.js` and `playwright.config.js`.

**Interfaces:** Browser controller consumes `QuizCore`, renders `intro`, `question`, `timeout`, `result`, or `insufficient` states, and owns `{sessionId, questionId, deadline, answers}`. `startQuiz(): void`, `presentQuestion(index: number): void`, `acceptAnswer(optionId: string, questionId: string, sessionId: number): void`, `expireQuestion(): void`, and `resetQuiz(): void` manage transitions. Deadline is `performance.now() + 20000`. A replaceable internal warning adapter has `unlock(): Promise<boolean>`, `update(remainingMs: number): void`, `stop(): void`, and `setMuted(muted: boolean): void`; Task 2 uses a silent implementation.

- [ ] Add browser tests opening `index.html` by file URL with offline networking. Assert intro, 15-question progress, shuffled options retaining IDs, complete paths to both outcomes, retry after nine answers, and cleared progress after restart. Use controlled browser time to assert 20,000 ms expiry and rejection of late selection. Test a double-click on an option, hidden-tab expiry, and return to a fresh full-duration next question.
- [ ] Add touch viewport assertions: at 360x640 and 390x844, prompt, timer, and every answer bounding box are onscreen; answer height is at least 48 px. At 320-pixel width, landscape, and enlarged text, assert no horizontal overflow and all controls remain reachable by scrolling. Test visible focus, keyboard selection, and reduced motion.
- [ ] Run `npx playwright test`; confirm expected missing-UI failures.
- [ ] Implement the semantic mobile-first screens, original aviation decoration, result descriptions, focus/live-region handling, safe-area padding, and reduced-motion styles. Render new question buttons with fresh identity-bound handlers; reject repeat click events with `event.detail > 1` in addition to stale session/question guards. Show timeout feedback for 800 ms. Never progress unseen questions while hidden; reconcile the active deadline on visibility return. Start each new deadline after its content is rendered.
- [ ] Run Node and browser tests, review phone-size screenshots, and fix observed layout/interaction problems. Commit the task.

### Task 3: Synthesized warning and failure-safe audio

**Files:** Modify `index.html` and `tests/quiz.spec.js`.

**Interfaces:** Replace the silent warning adapter from Task 2 with `createWarningAudio(): {unlock, update, stop, setMuted}` using the same signatures. The controller calls unlock on Start, update while visible and active, and stop on every exit, hidden tab, timeout, restart, or mute. Preserve the mute choice across a replay in the same session.

- [ ] Add tests asserting no tones before five seconds, tones at five seconds, cessation on answer/timeout/mute/hide/restart, and no nodes scheduled beyond the question deadline. Use an instrumented AudioContext stub for lifecycle assertions, plus the real browser context for startup without exceptions. Assert quiz completion when AudioContext is absent or resume rejects, and visible sound-unavailable feedback.
- [ ] Run targeted audio tests and confirm failure with the silent adapter.
- [ ] Implement alternating 660/880 Hz tones with short gain ramps and restrained peak gain (0.035). Use 100 ms pulses spaced 650 ms apart initially and 300 ms apart in the final two seconds; clamp each pulse to remaining time. Catch unsupported/rejected audio initialization, keep the timer independent, and clean up active oscillator/gain nodes. Include accessible mute state and a visual final-five-second cue without flashing.
- [ ] Run the complete test suite. Listen if the environment supports audio; otherwise explicitly record that waveform lifecycle was tested but subjective sound was not auditioned. Commit the task.

### Task 4: Offline distribution, final verification, and reusable environment

**Files:** Create `README.md`; change product or tests only to address verified findings.

**Interfaces:** Recipient opens `index.html`; developer runs `npm ci` and `npm test`. No runtime server is required. Optional development serving uses `python3 -m http.server 8000 --bind 127.0.0.1` from the checkout.

- [ ] Add an offline full-run test that records requests and fails on any HTTP(S) request. Verify the page also runs when copied by itself to a temporary directory. Exercise a real-time 20-second timeout in addition to virtual-time coverage.
- [ ] Run `npm ci`, the relevant Playwright browser installation, and `npm test` from `/workspace/quiz`. Record actual browser engines and counts tested; do not treat mobile viewport emulation as physical iOS/Android attachment validation.
- [ ] Write README instructions for sending the single file, opening it in a JavaScript-capable browser, sound/mute, and mobile mail/file-preview limitations. Explain there is no network use or result reporting. Include developer setup and any untested physical-device/audio limitations.
- [ ] Save tested dependency installation steps and useful startup/test instructions in the environment draft as required by onboarding. Preserve unrelated settings and describe that publishing is user-owned. Do not require a server for recipients or claim fresh-task restoration was tested.
- [ ] Review the full diff against the approved spec, run any checks affected by corrections, confirm repository status, and commit. Report the deliverable, verification, saved environment fields, and material remaining limitations.

## Self-review and handoff

All spec areas map to the four tasks: content/scoring to Task 1, mobile UI and session rules to Task 2, warning behavior to Task 3, and offline delivery/environment evidence to Task 4. Test-only dependencies never enter the shareable artifact. Recommend native execution because the tasks share one small HTML deliverable and tightly coupled browser state; one final independent review is proportionate. Await user review and execution-method selection before product implementation.
