# Wingman

A mobile-first, just-for-fun Maverick or Goose personality quiz.

## Send it

Send **index.html**. That is the entire quiz: 15 scenarios, 20-second timers,
a synthesized final-five-second warning, mute control, and both results.
No server, internet, account, installation, or result reporting is required.
At least ten answered questions are needed for a result. Nothing is saved.

Save the file and open it in a browser that runs JavaScript. Some phone email
and file-preview apps only show a preview and will not run an attached HTML
file. Use an actual browser where local HTML is supported. Mobile layout has
been tested in browser emulation; delivery from phone attachments has not been
verified on physical iPhones or Android devices.

The warning is an original synthesized cockpit-style sound, not a recording
from an F-14. Both results are entertainment, not psychological assessments.
The embedded scoring can be inspected by anyone who opens the source.

## Development

There is no application build. Edit `index.html` and reload it.

Node.js 20+ and Chromium are needed only for the automated tests:

```sh
npm ci --cache /workspace/.cache/quiz-npm
npm test
```

Tests default to `/usr/bin/chromium`; set `CHROMIUM_PATH` for another Chromium
installation. The cloud environment's managed Chromium blocks `file:` URLs.
In that environment, load the same unchanged HTML directly into the test page:

```sh
QUIZ_INLINE_TEST=1 npm test
```

This mode tests offline page behavior but does not establish that opening a
local attachment works on a particular device. No browser policy is disabled.
A local development server is optional, not part of the deliverable:
`python3 -m http.server 8000 --bind 127.0.0.1`.

Checks cover both complete result paths without network requests, question
balance, answer thresholds, tie handling, timeout flow, repeated clicks,
background recovery, sound scheduling/mute, audio-unavailable behavior,
keyboard use, enlarged text, and mobile layouts from 320 pixels wide.
A separate check exercises the real 20-second deadline. Synthesized audio
scheduling is verified automatically; its subjective sound has not been
listened to in this environment.
