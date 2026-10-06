# Maverick or Goose: offline personality quiz

## Purpose and agreed requirements

Create a self-contained entertainment quiz that the owner can send as one HTML file. Recipients open it in a browser and complete it without network access, accounts, installation, or reporting results to the owner. The only completed personality outcomes are Maverick and Goose from Top Gun. Both should feel positive and entertaining.

Use 15 questions mixing everyday situations and fictional flight-school scenarios. Blend playful humor with cinematic atmosphere. Give each question 20 seconds and play a synthesized cockpit-style warning during the final five seconds. The warning is inspired by cockpit alarms, not represented as an authentic F-14 recording.

Answers must not transparently map to characters. The quiz encourages instinctive choices, not film trivia or a scientifically validated personality assessment. Offline scoring remains inspectable; preventing deliberate source inspection is outside scope.

## Delivery and approach

Use one `index.html` containing all markup, CSS, JavaScript, question data, vector decoration, and synthesized audio code. Use browser system fonts and no external assets, requests, libraries, or build step. This is preferable to a framework bundle for a small, transferable file. A hosted app would add an unnecessary delivery dependency; a PDF would not support the timed interaction and synthesized warning.

Keep code organized into question data, scoring functions, session state, rendering, timing, and audio responsibilities within the file. Developer tests may be separate files and are not needed by recipients. Use the existing isolated checkout; do not create a worktree unless explicitly requested.

## Recipient flow

1. Intro: describe the entertainment premise, 15 questions, 20-second limit, final-five-second sound, and ten-answer minimum. A visible sound toggle is available. The Start button is the gesture that enables browser audio.
2. Question: show one short scenario, three concise options, question progress, remaining seconds, and mute control. Do not show trait scores, character hints, quotes, or character imagery. Shuffle answer positions once per question presentation while preserving option IDs.
3. Answer: accept only the first valid selection before the deadline, stop the warning, record the answer, and move to the next question. Start its full 20 seconds only after rendering. No back navigation within the quiz.
4. Timeout: record no answer and no trait contribution. Stop sound and briefly display a neutral timeout notice before advancing. Require at least ten answers to produce a personality result.
5. Reveal: show either Maverick or Goose, a short original character description, and a playful strengths summary. Do not show per-answer mappings or percentages suggesting scientific accuracy. Provide Play Again.
6. Insufficient answers: explain that at least ten answers are needed and provide Try Again. Do not assign a character.

Restart clears all answers, timers, pending transitions, and audio. No answers or results are persisted or transmitted. Reload starts a new session. The maximum answering time is five minutes, plus brief timeout notices and intro/result screens.

## Question and scoring design

Write eight everyday scenarios and seven flight-school scenarios. Each prompt should be at most 35 words and each option at most 16 words so the 20-second limit is practical. Avoid overt contrasts such as reckless pilot versus loyal sidekick. Every answer should express a reasonable, appealing approach with a tradeoff; avoid an obvious heroic, cowardly, or morally superior option.

Internally score four dimensions: adaptability, initiative, coordination, and deliberation. Each answer contributes to multiple dimensions. Rotate trait combinations and wording across contexts so the same surface behavior is not always associated with one result. Do not equate either character with intelligence, competence, bravery, or moral worth.

Use a fixed, deterministic aggregate classifier. Represent each answer as four integer contributions from -2 to +2. Calculate a character direction from the aggregate using weights [2, 1, -2, -1] in the dimension order above: positive selects Maverick, negative selects Goose. For exact ties, use the first answered question with a nonzero weighted contribution; validate that every option has a nonzero contribution. Never randomize a person's result. Timed-out questions contribute nothing.

For each question, include both positive and negative weighted options; across the full question set balance positive and negative magnitudes and avoid consistent answer-position patterns. The internal axis is an implementation detail, not wording shown to recipients. Multi-trait scoring and shuffled positions reduce obvious cues but cannot make a transparent offline quiz impossible to game.

Maverick copy emphasizes improvisation, personal initiative, and comfort with uncertainty. Goose copy emphasizes situational awareness, connection, and making a team stronger. Neither result is a consolation prize. Review all 45 answers for giveaway wording before implementation is considered complete.

## Timing and audio

Use a monotonic deadline rather than decrementing an interval counter. Derive the countdown from remaining time; reject selections received at or after the deadline. Guard transitions with question/session identity so duplicate clicks and stale callbacks cannot skip questions or score twice.

At five seconds remaining, use Web Audio oscillators and gain envelopes to synthesize a restrained alternating-tone warning. Increase pulse frequency toward expiry without sharply increasing volume. Stop all active sound on answer, timeout, mute, restart, and leaving the active question. Do not schedule audio beyond the deadline. Audio initialization failure must not block the quiz; show sound as unavailable and retain visual timing.

Time continues when the tab is hidden. Silence warning audio while hidden; on return, reconcile the active question against its deadline. If it expired, record one timeout and render the next question with a fresh deadline. Do not consume unseen subsequent questions while backgrounded. This behavior favors a fair reading opportunity over attempts at tamper resistance.

## Presentation and accessibility

Use an aviation-inspired dark navy interface with restrained amber and teal accents, instrument-like countdown, subtle original vector decoration, and large answer buttons. Avoid flashing effects, external film stills, and required animation. Use a responsive single-column layout on small screens.

Use semantic buttons, visible focus, adequate contrast, keyboard support, and comfortable touch targets. Move focus appropriately when a question or result appears. Announce question changes and the five-second warning to assistive technology without announcing every timer tick. Honor reduced-motion preferences. Sound is supplementary; all timing information remains visible. The fixed reading deadline is an intentional user requirement and may make the quiz less accessible to slower readers.

## Validation and completion criteria

- Open the deliverable through a local file URL and complete it with networking disabled; verify no external requests or missing assets.
- Validate exactly 15 questions and three unique options per question, prompt/answer length limits, valid trait vectors, and the documented scoring balance.
- Exercise both results, deterministic ties, ten-answer eligibility, nine-answer retry, and exclusion of timeouts from scoring.
- Verify real and controlled-time countdown behavior, alarm onset at five seconds, mute, timeout advancement, double-click protection, background-tab recovery, and complete cleanup on restart.
- Verify audio failure still permits completion; manually listen to the synthesized warning when an audio-capable environment is available and report any listening limitation.
- Check keyboard navigation, focus changes, reduced motion, and narrow-screen layout. Run a complete browser interaction test rather than relying solely on static checks.
- Confirm all recipient functionality lives in the single HTML file. Record any remaining browser/device validation limitations honestly.

## Scope boundaries

No backend, result collection, analytics, login, downloads of external media, persistent progress, configurable question editor, or authenticity claim for the alarm. A desktop browser opening the HTML file is the primary delivery target; mobile layout is supported where the device permits opening local HTML in a browser. Attachment-opening restrictions in mail apps are outside the quiz's control.
