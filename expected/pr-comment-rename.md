<!-- dashlint:v1 -->
**dashlint: this PR would break 5 tiles**

| Change | Breaks |
|---|---|
| `checkout_started` renamed to `checkout_begun` (web/src/App.tsx:38) | Funnel "Checkout funnel (web)" (step 1: dead, was one platform) |
| | Trend "Checkouts started (all platforms)" (dead, was one platform) |
| | Trend "Checkout funnel health" (dead, was one platform) |
| | Funnel "Checkout funnel (by payment method)" (step 1: dead) |
| | Trend "Checkouts started" (dead, was one platform) |

Checked against `dashlint.requirements.json` (pulled 2026-11-14). 4 tiles were already dead before this PR. 1 call site has non-literal event names. 2 parts could not be decided.
<sub>dashlint 0.0.0 · a clean result means nothing dashlint can see is broken, not that every number is right</sub>
