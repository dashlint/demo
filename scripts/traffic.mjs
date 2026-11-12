// T9.3: a day of synthetic traffic for the demo PostHog project (spec 6.17.1). Run daily by
// .github/workflows/traffic.yml, and once by hand at setup. Uses the demo project's PUBLIC project
// token (safe to commit: the same token ships inside the web and mobile app bundles), never a
// personal API key, so it needs no Keychain access (G3, H0 Q8 standing permission).
//
// Deliberately never sends, so the matching dashlint-demo pattern stays dead or "not arriving":
//   gift_card_redeemed (pattern 1, renamed to giftcard_redeemed), format on order_completed
//   (pattern 3), payment_method in any case other than lowercase (pattern 4, until V3 ships),
//   discount_applied (pattern 7, its call was deleted with the launch discount), gift_wrap on
//   order_completed_native (pattern 6), wishlist_added_legacy (pattern 10), book_returned
//   (pattern 12, ADR-010), book_viewed's "genre" property (pattern 2, only genre_id is sent).
//
// Sends the V3 pair (ADR-010's sibling note, research/posthog-semantics.md): `v3_test_flag: true`
// on checkout_started (web) and `v3_test_flag: "true"` on added_to_cart_native (mobile), so a later
// task can confirm PostHog treats a raw boolean true and the string "true" as the same value.
const PROJECT_TOKEN = 'phc_tJXbib2kGKL6pSAwwiE2UaD2RbkZboZPUL6zqFZ3cqWA'; // dashlint-demo, public (not secret)
const CAPTURE_HOST = 'https://us.i.posthog.com';
const PEOPLE = 40;

const WEB_BOOKS = [
  { id: 'b-1', genreId: 'mystery', price: 14.5 },
  { id: 'b-2', genreId: 'fiction', price: 12 },
  { id: 'b-3', genreId: 'romance', price: 11.25 },
  { id: 'b-4', genreId: 'nonfiction', price: 18 },
  { id: 'b-5', genreId: 'fantasy', price: 15.75 },
];
const MOBILE_BOOKS = WEB_BOOKS.slice(0, 3);
const CHANNELS = ['email', 'link'];

function pick(arr, i) {
  return arr[i % arr.length];
}

function nowIso(offsetMinutes) {
  return new Date(Date.now() - offsetMinutes * 60_000).toISOString();
}

const events = [];
function send(event, distinctId, properties, offsetMinutes, deviceType) {
  events.push({
    event,
    distinct_id: distinctId,
    timestamp: nowIso(offsetMinutes),
    properties: { ...properties, $device_type: deviceType },
  });
}

for (let n = 0; n < PEOPLE; n++) {
  const distinctId = `demo-person-${n}`;
  const t = n * 2; // spread sessions across the last ~80 minutes, well inside one UTC day
  const book = pick(WEB_BOOKS, n);
  const mobileBook = pick(MOBILE_BOOKS, n);

  // --- web session ---
  send('search_performed', distinctId, { query: 'ledger', result_count: 3 }, t + 10, 'Desktop');
  // pattern 2: genre_id only, never "genre".
  send('book_viewed', distinctId, { book_id: book.id, genre_id: book.genreId, price: book.price }, t + 9, 'Desktop');
  send('added_to_cart', distinctId, { book_id: book.id, price: book.price }, t + 8, 'Desktop');
  // V3 pair, half of all web sessions: a real boolean.
  send('checkout_started', distinctId, { cart_total: book.price, item_count: 1, ...(n % 2 === 0 ? { v3_test_flag: true } : {}) }, t + 7, 'Desktop');
  // pattern 3: never a "format" property.
  send('order_completed', distinctId, { order_id: `order-${distinctId}`, total: book.price, item_count: 1 }, t + 6, 'Desktop');
  if (n % 3 === 0) send('review_submitted', distinctId, { book_id: book.id, rating: 4 }, t + 5, 'Desktop');
  // pattern 10: the live half of the OR group; wishlist_added_legacy is never sent.
  if (n % 2 === 0) send('wishlist_added', distinctId, { book_id: book.id }, t + 4, 'Desktop');
  if (n % 5 === 0) send('newsletter_signup', distinctId, { source: 'footer' }, t + 3, 'Desktop');
  if (n % 7 === 0) send(`shared_via_${pick(CHANNELS, n)}`, distinctId, { book_id: book.id }, t + 2, 'Desktop');
  // pattern 1: only the new name.
  if (n % 6 === 0) send('giftcard_redeemed', distinctId, { code: `GIFT${n}`, amount: 10 }, t + 1, 'Desktop');

  // --- mobile session ---
  send('book_viewed_native', distinctId, { book_id: mobileBook.id, genre_id: mobileBook.genreId }, t + 9, 'Mobile');
  // pattern 9: both added_to_cart and added_to_cart_native feed the "any platform" action.
  send('added_to_cart_native', distinctId, { book_id: mobileBook.id, ...(n % 2 === 1 ? { v3_test_flag: 'true' } : {}) }, t + 8, 'Mobile');
  // pattern 4: always lowercase; the dashboard's step filter checks "Card" and never matches.
  send('payment_method_selected', distinctId, { payment_method: n % 2 === 0 ? 'card' : 'cash' }, t + 7, 'Mobile');
  // pattern 6: no "gift_wrap" property is ever attached.
  send('order_completed_native', distinctId, { total: mobileBook.price, payment_method: n % 2 === 0 ? 'card' : 'cash' }, t + 6, 'Mobile');
  if (n % 4 === 0) send('wishlist_synced', distinctId, { book_id: mobileBook.id }, t + 5, 'Mobile');
  // pattern 14: the posthog-react-native lifecycle events the SDK sends on its own.
  send('Application Opened', distinctId, {}, t + 9, 'Mobile');
  send('Application Became Active', distinctId, {}, t + 8, 'Mobile');
}

// The V4 alert spike's control event (ADR-005): one a day, so its alert watches a live series. No
// app code sends it.
send('v4_daily', 'demo-person-0', {}, 1, 'Desktop');

async function sendBatch(batch) {
  const res = await fetch(`${CAPTURE_HOST}/batch/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PROJECT_TOKEN, batch }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST /batch/ -> HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
}

const CHUNK = 200;
let sent = 0;
for (let i = 0; i < events.length; i += CHUNK) {
  const chunk = events.slice(i, i + CHUNK);
  await sendBatch(chunk);
  sent += chunk.length;
}
console.log(`traffic: sent ${sent} events for ${PEOPLE} synthetic persons`);
