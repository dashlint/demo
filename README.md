# dashlint demo

Demo apps and PostHog project used to try dashlint end to end: a small fictional bookshop with a
web app and a mobile app, both instrumented with PostHog, checked against a committed dashlint
requirements snapshot.

A few of the bookshop's dashboard tiles and alerts are seeded with a mismatch between the code and
the PostHog project on purpose (a renamed event, a filter on a property the code names differently,
a breakdown on a property never sent, and more). Running dashlint against this repository finds
them without ever calling PostHog, because the snapshot below is committed.

Not affiliated with or endorsed by PostHog, Mixpanel, Amplitude or Twilio Segment.

## Try it

Clone this repository and run dashlint against the committed snapshot, no PostHog account or key
needed:

```sh
npx @dashlint/cli audit --offline
```

This prints the text report and writes `dashlint-report.html`; it exits 1 because this demo has
seeded dead tiles on purpose. A clean result means nothing dashlint can see is broken, not that
every number is right.

## Structure

- `web/` Vite and React bookshop
- `mobile/` Expo and React Native bookshop
- `scripts/` synthetic traffic and PostHog project setup
- `expected/` the expected verdicts this demo should produce, written before the run
- `dashlint.config.yml`, `dashlint.requirements.json` the committed snapshot the offline try-it
  path above reads; `.github/workflows/refresh.yml` documents how to pull a fresh one

By Aman Gupta.

A clean result means nothing dashlint can see is broken, not that every number is right.
