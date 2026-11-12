# dashlint demo

Demo apps and PostHog project used to try dashlint end to end: a small fictional bookshop with a
web app and a mobile app, both instrumented with PostHog, checked against a committed dashlint
requirements snapshot.

Not affiliated with or endorsed by PostHog, Mixpanel, Amplitude or Twilio Segment.

## Structure

- `web/` Vite and React bookshop
- `mobile/` Expo and React Native bookshop
- `scripts/` synthetic traffic and PostHog project setup
- `expected/` the expected verdicts this demo should produce, written before the run

By Aman Gupta.

This repository is under active development and not yet ready for use.

A clean result means nothing dashlint can see is broken, not that every number is right.
