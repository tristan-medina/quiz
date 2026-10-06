# The Top Quiz

A mobile-first, just-for-fun Maverick or Goose personality quiz: 15 scenarios,
20-second timers, a synthesized final-five-second warning, and two results.
No accounts, analytics, or result reporting. At least ten answers are needed.

## Share a link with iPhone users

Once GitHub Pages is enabled, share **https://tristan-medina.github.io/quiz/**.
Recipients tap the link, tap Start flight, and take the quiz in their browser.
They need a connection for the first load; no installation or Home Screen
shortcut is needed to take it. When the page says **Ready for offline use.**,
its browser has cached the quiz for offline use and reloads. Browser storage
can be cleared or evicted, so this is not a guarantee of permanent availability.
In-app browsers may have separate storage; Safari is recommended for later
reuse. Audio starts only after tapping Start, and can be muted.

Do not send HTML or ZIP attachments through iMessage to iPhone recipients:
iOS attachment previews do not run the quiz's JavaScript.

## Publish on GitHub Pages

In this repository's **Settings → Pages**, select **Deploy from a branch**,
choose **main** and **/ (root)**, then Save. Wait for GitHub's deployment to
finish and open the URL above. `.nojekyll` makes this a plain static site.
No GitHub Actions workflow, backend, or build service is required.

The site files (`index.html`, `sw.js`) are generated and committed. After editing
the quiz or site generator, run `npm run build` and commit both generated files.
The service worker uses a versioned cache; revisiting online installs updates.
An already open quiz is not forcibly reloaded mid-flight.

## Source and optional desktop file

`The Top Quiz.html` is the single source for quiz content, behavior, and styling.
It contains its favicon and audio synthesis without external runtime assets.
It can also be opened directly in a desktop browser. The ZIP is the earlier
standalone desktop download; the website is the supported iPhone delivery route.
`scripts/build-site.cjs` creates the web version and offline service worker.
The warning is original synthesized audio, not an authentic F-14 recording.
Results are entertainment, not a psychological assessment.

## Development and validation

Node.js 20+, Python 3, and Chromium are used only for development and tests:

```sh
npm ci --cache /workspace/.cache/quiz-npm
npm run build
QUIZ_INLINE_TEST=1 npm test
```

Tests use `/usr/bin/chromium`; set `CHROMIUM_PATH` for a different installation.
The cloud's managed browser blocks file URLs, so `QUIZ_INLINE_TEST=1` loads the
standalone HTML directly into the test page. Site tests use an actual local HTTP
server under `/quiz/`, matching the GitHub Pages subdirectory, and verify real
service-worker installation, offline reload, and a complete mobile-emulated run.

Other checks cover both results, ten-answer eligibility, timeouts, repeated taps,
background recovery, warning/mute, unavailable audio, keyboard navigation,
enlarged text, and narrow-screen layouts. Mobile emulation is not a physical
Safari/iPhone test. Subjective audio has not been auditioned here.
