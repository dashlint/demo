// T9.3, T9.5: idempotently create the demo project's insights, dashboards, action and alerts, bring
// existing insights to their wanted query, and retire PostHog's starter dashboard and the V4 spike.
//   node runner/with-key.mjs dashlint-posthog-demo-write -- node demo/scripts/setup-posthog.mjs --service dashlint-posthog-demo-write
//
// Objects are matched by name, so a second run changes nothing (CREATED 0 UPDATED 0 RETIRED 0). Refuses (exit 1) unless
// the key is the demo write key (same fingerprint check as scripts/v4-spike.mjs: insights readable,
// event_definitions refused for a missing scope). Never touches the production project (G13). An
// alert that does not fit the free plan's 5-alert budget is reported pending, not forced.
//
// Patterns reference spec section 6.17.1's numbering; each insight and the one action and one alert
// below exist to make one or more of those 16 patterns real and checkable, plus plain filler
// insights so the three dashboards carry realistic tile counts (about 18, 8, 6).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEMO_PROJECT = 731105; // dashlint-demo (gates.md H-SETUP)
const HOST = 'https://us.posthog.com';
const SERVICE = 'dashlint-posthog-demo-write';
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '.setup-posthog');

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const key = process.env.DASHLINT_POSTHOG_KEY;
const refuse = (why) => {
  console.error(`setup-posthog: refused: ${why}`);
  process.exit(1);
};
if (opt('--service') !== SERVICE) refuse(`--service must be ${SERVICE} (got ${opt('--service') ?? 'nothing'})`);
if (!key) refuse('DASHLINT_POSTHOG_KEY is not set: run through runner/with-key.mjs');

const base = `${HOST}/api/projects/${DEMO_PROJECT}`;
async function api(method, path, body) {
  const res = await fetch(`${base}/${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* not JSON */
  }
  return { status: res.status, json };
}

// Fingerprint of the demo write key (ADR-005, research/posthog-limits.md).
const ins = await api('GET', 'insights/?limit=1&basic=true');
const defs = await api('GET', 'event_definitions/?limit=1');
const missingScope = defs.status === 403 && /missing required scope/i.test(String(defs.json?.detail ?? ''));
if (ins.status !== 200 || !missingScope) {
  refuse(`the key is not the demo write key (insights HTTP ${ins.status}, event_definitions HTTP ${defs.status}${defs.json?.detail ? ` [${String(defs.json.detail).slice(0, 120)}]` : ''})`);
}

const userId = (u) => (u && typeof u === 'object' ? u.id : u);
async function listAll(path) {
  const out = [];
  let next = path;
  while (next) {
    const r = await api('GET', next);
    if (r.status !== 200) throw new Error(`GET ${next} -> HTTP ${r.status}`);
    out.push(...(r.json.results ?? []));
    next = r.json.next ? r.json.next.slice(r.json.next.indexOf(`/api/projects/${DEMO_PROJECT}/`) + `/api/projects/${DEMO_PROJECT}/`.length) : null;
  }
  return out;
}

const ev = (event, extra) => ({ kind: 'EventsNode', event, name: event ?? 'All events', math: 'total', ...extra });
const trends = (series, extra) => ({ kind: 'InsightVizNode', source: { kind: 'TrendsQuery', series, interval: 'day', dateRange: { date_from: '-30d' }, ...extra } });
const funnel = (events) => ({ kind: 'InsightVizNode', source: { kind: 'FunnelsQuery', series: events.map((e) => ev(e)), dateRange: { date_from: '-30d' } } });
const hogql = (query) => ({ kind: 'DataVisualizationNode', source: { kind: 'HogQLQuery', query } });

const DASHBOARDS = [
  { key: 'growth', name: 'Bookshop growth' },
  { key: 'checkout', name: 'Checkout' },
  { key: 'mobile', name: 'Mobile' },
];

// `action` series are filled in once the action below is created.
const INSIGHTS = [
  // --- numbered patterns (spec 6.17.1) ---
  { name: 'Gift card redemptions', dash: 'growth', query: trends([ev('gift_card_redeemed')]), description: 'dashlint-demo pattern 1: built on the old event name, renamed to giftcard_redeemed.' },
  { name: 'Book views by genre', dash: 'growth', query: trends([ev('book_viewed')], { properties: [{ key: 'genre', type: 'event', operator: 'exact', value: ['mystery'] }] }), description: 'dashlint-demo pattern 2: filters on "genre"; the code sends "genre_id".' },
  { name: 'Orders by format', dash: 'checkout', query: trends([ev('order_completed')], { breakdownFilter: { breakdown: 'format', breakdown_type: 'event' } }), description: 'dashlint-demo pattern 3: breaks down on "format", never attached to this event.' },
  { name: 'Checkout funnel (by payment method)', dash: 'checkout', query: { kind: 'InsightVizNode', source: { kind: 'FunnelsQuery', series: [ev('checkout_started'), { ...ev('payment_method_selected'), properties: [{ key: 'payment_method', type: 'event', operator: 'exact', value: ['Card'] }] }, ev('order_completed_native')], dateRange: { date_from: '-30d' } } }, description: 'dashlint-demo pattern 4: step filter checks "Card"; the app always sends "card".' },
  { name: 'Review submissions', dash: 'growth', query: trends([ev('review_submitted')]), description: 'dashlint-demo pattern 5: only the web app sends this event.' },
  { name: 'Orders excluding gift wrap', dash: 'mobile', query: trends([ev('order_completed_native')], { properties: [{ key: 'gift_wrap', type: 'event', operator: 'is_not', value: 'false' }] }), description: 'dashlint-demo pattern 6: negative filter on "gift_wrap", never attached to this event.' },
  { name: 'Discount conversion', dash: 'checkout', query: trends([ev('checkout_started'), ev('discount_applied')], { trendsFilter: { formula: 'B/A' } }), description: 'dashlint-demo pattern 7: formula B/A over "discount_applied", whose call was deleted with the launch discount; the formula can only be zero.' },
  { name: 'Revenue per device', dash: 'mobile', query: hogql("select properties.$device_type as device, sum(toFloat(properties.total)) as revenue from events where event = 'order_completed_native' group by device"), description: 'dashlint-demo pattern 8: a SQL insight, not checked.' },
  { name: 'Added to cart (any platform)', dash: 'growth', query: null, description: 'dashlint-demo pattern 9: an action-based series over added_to_cart and added_to_cart_native.' },
  { name: 'Wishlist adds (current and legacy)', dash: 'growth', query: trends([{ kind: 'GroupNode', operator: 'OR', name: 'Wishlist adds', math: 'total', nodes: [ev('wishlist_added'), ev('wishlist_synced'), ev('wishlist_added_legacy')] }]), description: 'dashlint-demo pattern 10: an OR group of wishlist_added (web), wishlist_synced (mobile) and the dead wishlist_added_legacy; the group stays live.' },
  // created without the formula so the alert on index 2 can be saved (PostHog rejects an
  // out-of-range index on save), then brought to `query` in step 5, after the alert exists.
  { name: 'Checkout funnel health', dash: 'checkout', initialQuery: trends([ev('checkout_started'), ev('order_completed'), ev('added_to_cart')]), query: trends([ev('checkout_started'), ev('order_completed'), ev('added_to_cart')], { trendsFilter: { formulaNodes: [{ formula: 'B/A' }] } }), description: 'dashlint-demo pattern 11: the "Checkout funnel health" alert was built against series index 2; a formula was added later, and with formulas series_index counts formula results (one), so index 2 is out of range.' },
  { name: 'Book returns', dash: 'growth', query: trends([ev('book_returned')]), description: 'dashlint-demo pattern 12: coded and reachable, never driven by scripts/traffic.mjs.' },
  { name: 'Daily active users', dash: 'growth', query: trends([{ ...ev(null), math: 'dau' }]), description: 'dashlint-demo pattern 13: an all-events DAU denominator (only $pageview arrives on an otherwise silent session).' },
  { name: 'App opened funnel', dash: 'mobile', query: funnel(['Application Opened', 'Application Became Active']), description: 'dashlint-demo pattern 14: posthog-react-native lifecycle events with no call site in this app.' },
  // --- filler insights (realism, not individually numbered) ---
  { name: 'Books viewed', dash: 'growth', query: trends([ev('book_viewed')]) },
  { name: 'Searches performed', dash: 'growth', query: trends([ev('search_performed')]) },
  { name: 'Added to cart (web)', dash: 'growth', query: trends([ev('added_to_cart')]) },
  { name: 'Checkouts started', dash: 'growth', query: trends([ev('checkout_started')]) },
  { name: 'Orders completed (web)', dash: 'growth', query: trends([ev('order_completed')]) },
  { name: 'Revenue (web)', dash: 'growth', query: trends([{ ...ev('order_completed'), math: 'sum', math_property: 'total' }]) },
  { name: 'Newsletter signups', dash: 'growth', query: trends([ev('newsletter_signup')]) },
  { name: 'Shares via email', dash: 'growth', query: trends([ev('shared_via_email')]) },
  { name: 'Browse to cart', dash: 'growth', query: funnel(['book_viewed', 'added_to_cart']) },
  { name: 'Cart to order', dash: 'growth', query: funnel(['added_to_cart', 'order_completed']) },
  { name: 'Weekly active users', dash: 'growth', query: trends([{ ...ev(null), math: 'weekly_active' }]) },
  { name: 'Checkouts started (all platforms)', dash: 'checkout', query: trends([ev('checkout_started')]) },
  { name: 'Orders completed (mobile)', dash: 'checkout', query: trends([ev('order_completed_native')]) },
  { name: 'Checkout funnel (web)', dash: 'checkout', query: funnel(['checkout_started', 'order_completed']) },
  { name: 'Average order value (mobile)', dash: 'checkout', query: trends([{ ...ev('order_completed_native'), math: 'avg', math_property: 'total' }]) },
  { name: 'Wishlist synced (mobile)', dash: 'mobile', query: trends([ev('wishlist_synced')]) },
  { name: 'Added to cart (mobile)', dash: 'mobile', query: trends([ev('added_to_cart_native')]) },
  { name: 'Payment method selected', dash: 'mobile', query: trends([ev('payment_method_selected')]) },
];

const ACTION = { name: 'Added to cart (any platform)', steps: [{ event: 'added_to_cart' }, { event: 'added_to_cart_native' }] };

// The pattern-11 alert first; the other three are created only once the free-plan budget has room
// (after the V4-spike alerts are removed, ADR-009). The expected verdict of each is in
// expected/expected.json.
const ALERTS = [
  { name: 'Checkout funnel health', insight: 'Checkout funnel health', condition: 'relative_decrease', bounds: { upper: 1 }, series_index: 2 },
  { name: 'Gift card redemptions dropped', insight: 'Gift card redemptions', condition: 'relative_decrease', bounds: { upper: 1 }, series_index: 0 },
  { name: 'Gift card redemptions below one', insight: 'Gift card redemptions', condition: 'absolute_value', bounds: { lower: 1 }, series_index: 0 },
  { name: 'Web orders below one', insight: 'Orders completed (web)', condition: 'absolute_value', bounds: { lower: 1 }, series_index: 0 },
];
const FREE_PLAN_ALERT_LIMIT = 5; // research/posthog-limits.md (D5)

// PostHog creates this dashboard (and its 9 insights) in every new project; the demo's dashboards
// are the three above (spec 6.17.1), so setup moves it to PostHog's trash (soft delete, restorable).
const RETIRED_DASHBOARDS = ['Your starter dashboard'];

// The V4 spike (T0.6) held 4 of the 5 alert slots until T0.7 had read their states. With that
// reading recorded, setup deletes the spike alerts and moves their two insights to the trash, so the
// 3 alerts above can exist and the project holds only the demo's own objects.
const RETIRED_ALERTS = [
  'v4 spike: never-sent relative decrease',
  'v4 spike: never-sent absolute lower',
  'v4 spike: never-sent absolute upper',
  'v4 spike: daily relative decrease',
];
const RETIRED_INSIGHTS = ['v4 spike: v4_never_sent', 'v4 spike: v4_daily'];

// true when every key of `want` is in `have` with an equal value (PostHog adds defaults on save).
function covers(have, want) {
  if (want === null || typeof want !== 'object') return have === want;
  if (Array.isArray(want)) return Array.isArray(have) && have.length === want.length && want.every((w, i) => covers(have[i], w));
  return have !== null && typeof have === 'object' && Object.entries(want).every(([k, v]) => covers(have[k], v));
}

const record = { project: DEMO_PROJECT, host: HOST, ran_at: new Date().toISOString(), actions: [], insights: [], dashboards: [], alerts: [] };
let created = 0;
let failed = 0;

// 1. Dashboards.
const existingDashboards = await listAll('dashboards/?limit=100');
const dashboardIds = {};
for (const want of DASHBOARDS) {
  let found = existingDashboards.find((d) => d.name === want.name && !d.deleted);
  if (!found) {
    const r = await api('POST', 'dashboards/', { name: want.name });
    if (r.status !== 201) {
      console.log(`dashboard ${want.name}: POST -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
      failed++;
      continue;
    }
    found = r.json;
    created++;
    record.dashboards.push({ action: 'created', name: want.name, id: found.id });
    console.log(`dashboard ${want.name}: created id=${found.id}`);
  } else {
    record.dashboards.push({ action: 'found', name: want.name, id: found.id });
    console.log(`dashboard ${want.name}: found id=${found.id}`);
  }
  dashboardIds[want.key] = found.id;
}

// 2. Action (pattern 9).
const existingActions = await listAll('actions/?limit=100');
let actionId = existingActions.find((a) => a.name === ACTION.name && !a.deleted)?.id;
if (!actionId) {
  const r = await api('POST', 'actions/', ACTION);
  if (r.status === 201) {
    actionId = r.json.id;
    created++;
    record.actions.push({ action: 'created', name: ACTION.name, id: actionId });
    console.log(`action ${ACTION.name}: created id=${actionId}`);
  } else {
    console.log(`action ${ACTION.name}: POST -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
    failed++;
  }
} else {
  record.actions.push({ action: 'found', name: ACTION.name, id: actionId });
  console.log(`action ${ACTION.name}: found id=${actionId}`);
}

// 3. Insights, attached to their dashboard on create or patched on afterward.
const existingInsights = await listAll('insights/?limit=100&basic=true');
const insightIds = {};
let anyUser = null;
for (const want of INSIGHTS) {
  const dashboardId = dashboardIds[want.dash];
  let query = want.query;
  if (query === null) {
    // pattern 9: the action-based series, built once the action id is known.
    query = trends([{ kind: 'ActionsNode', id: actionId, name: ACTION.name, math: 'total' }]);
  }
  want.resolved = query;
  let found = existingInsights.find((i) => i.name === want.name && !i.deleted);
  if (!found) {
    const r = await api('POST', 'insights/', { name: want.name, query: want.initialQuery ?? query, description: want.description ?? 'dashlint demo (T9.3)', dashboards: dashboardId ? [dashboardId] : [] });
    if (r.status !== 201) {
      console.log(`insight ${want.name}: POST -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
      failed++;
      continue;
    }
    found = r.json;
    created++;
    console.log(`insight ${want.name}: created id=${found.id} short_id=${found.short_id}`);
  } else {
    const onDashboard = dashboardId && Array.isArray(found.dashboards) && found.dashboards.includes(dashboardId);
    if (dashboardId && !onDashboard) {
      const r = await api('PATCH', `insights/${found.id}/`, { dashboards: [...(found.dashboards ?? []), dashboardId] });
      if (r.status === 200) found = r.json;
    }
    console.log(`insight ${want.name}: found id=${found.id}`);
  }
  insightIds[want.name] = found.id;
  anyUser ??= userId(found.created_by);
  record.insights.push({ name: want.name, id: found.id, dash: want.dash });
}

// 4. Retire the V4-spike alerts and their insights, then create the alerts while the free plan's
// budget has room.
let retired = 0;
const existingAlerts = [];
for (const a of await listAll('alerts/?limit=100')) {
  if (!RETIRED_ALERTS.includes(a.name)) {
    existingAlerts.push(a);
    continue;
  }
  const r = await api('DELETE', `alerts/${a.id}/`);
  if (r.status === 204) {
    retired++;
    console.log(`alert ${a.name}: retired`);
  } else {
    existingAlerts.push(a);
    failed++;
    console.log(`alert ${a.name}: DELETE -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  }
}
for (const name of RETIRED_INSIGHTS) {
  const found = existingInsights.find((i) => i.name === name && !i.deleted);
  if (!found) continue;
  const r = await api('PATCH', `insights/${found.id}/`, { deleted: true });
  if (r.status === 200) {
    retired++;
    console.log(`insight ${name}: retired`);
  } else {
    failed++;
    console.log(`insight ${name}: PATCH -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  }
}
let alertCount = existingAlerts.length;
for (const ALERT of ALERTS) {
const alertFound = existingAlerts.find((a) => a.name === ALERT.name);
if (alertFound) {
  record.alerts.push({ action: 'found', name: ALERT.name, id: alertFound.id });
  console.log(`alert ${ALERT.name}: found id=${alertFound.id}`);
} else if (alertCount >= FREE_PLAN_ALERT_LIMIT) {
  record.alerts.push({ action: 'pending', name: ALERT.name });
  console.log(`alert ${ALERT.name}: pending, free-plan budget full (${alertCount}/${FREE_PLAN_ALERT_LIMIT}, ADR-009)`);
} else if (!insightIds[ALERT.insight] || !anyUser) {
  console.log(`alert ${ALERT.name}: skipped (no insight id or no subscriber id)`);
  failed++;
} else {
  const body = {
    name: ALERT.name,
    insight: insightIds[ALERT.insight],
    subscribed_users: [anyUser],
    enabled: true,
    calculation_interval: 'hourly',
    condition: { type: ALERT.condition },
    threshold: { configuration: { type: 'absolute', bounds: ALERT.bounds } },
    config: { type: 'TrendsAlertConfig', series_index: ALERT.series_index, check_ongoing_interval: false },
  };
  const r = await api('POST', 'alerts/', body);
  if (r.status === 201) {
    created++;
    alertCount++;
    record.alerts.push({ action: 'created', name: ALERT.name, id: r.json.id, state: r.json.state });
    console.log(`alert ${ALERT.name}: created id=${r.json.id} state=${r.json.state}`);
  } else {
    failed++;
    console.log(`alert ${ALERT.name}: POST -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  }
}
}

// 5. Bring every insight to its wanted query and description (after the alerts, see pattern 11).
const savedInsights = await listAll('insights/?limit=100');
let updated = 0;
for (const want of INSIGHTS) {
  const have = savedInsights.find((i) => i.id === insightIds[want.name]);
  if (!have) continue;
  const body = {};
  if (!covers(have.query, want.resolved)) body.query = want.resolved;
  if (want.description && have.description !== want.description) body.description = want.description;
  if (!Object.keys(body).length) continue;
  const r = await api('PATCH', `insights/${have.id}/`, body);
  if (r.status === 200) {
    updated++;
    console.log(`insight ${want.name}: updated ${Object.keys(body).join(', ')}`);
  } else {
    failed++;
    console.log(`insight ${want.name}: PATCH -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  }
}

// 6. Retire PostHog's starter dashboard and the insights that live only on it.
for (const name of RETIRED_DASHBOARDS) {
  const d = existingDashboards.find((x) => x.name === name && !x.deleted);
  if (!d) continue;
  const only = savedInsights.filter((i) => !i.deleted && Array.isArray(i.dashboards) && i.dashboards.length === 1 && i.dashboards[0] === d.id);
  for (const i of only) {
    const r = await api('PATCH', `insights/${i.id}/`, { deleted: true });
    if (r.status === 200) retired++;
    else failed++;
  }
  const r = await api('PATCH', `dashboards/${d.id}/`, { deleted: true });
  if (r.status === 200) {
    retired++;
    console.log(`dashboard ${name}: retired with ${only.length} insights`);
  } else {
    failed++;
    console.log(`dashboard ${name}: PATCH -> HTTP ${r.status} ${JSON.stringify(r.json).slice(0, 300)}`);
  }
}
record.updated = updated;
record.retired = retired;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'setup.json'), `${JSON.stringify(record, null, 2)}\n`);
console.log(`CREATED ${created} UPDATED ${updated} RETIRED ${retired} FAILED ${failed} (record: demo/.setup-posthog/setup.json)`);
process.exit(failed ? 1 : 0);
