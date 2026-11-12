import posthog from 'posthog-js'

const apiKey = import.meta.env.VITE_POSTHOG_KEY
const apiHost = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

export function initAnalytics(): void {
  if (!apiKey) return
  // dashlint-demo pattern 13: no custom "app loaded" event is sent here, so a DAU tile built
  // on "all events" (including the autocaptured $pageview this call sends) is the only
  // denominator that ever has data for a session with no other activity.
  posthog.init(apiKey, { api_host: apiHost, person_profiles: 'identified_only' })
}

type ShopEventName =
  | 'book_viewed'
  | 'search_performed'
  | 'added_to_cart'
  | 'checkout_started'
  | 'order_completed'
  | 'review_submitted'
  | 'wishlist_added'
  | 'newsletter_signup'
  | 'book_returned'
  | 'giftcard_redeemed'
  | 'discount_applied'

// dashlint-demo pattern 15: a track() wrapper whose event parameter is a literal union, so the
// catalog of names it can send is closed and knowable from the type alone.
export function track(event: ShopEventName, props?: Record<string, unknown>): void {
  posthog.capture(event, props)
}

// dashlint-demo pattern 16: a capture() call whose event name is an open string, not a literal
// union; the name cannot be enumerated statically and must count as "open world".
export function trackDynamic(eventName: string, props?: Record<string, unknown>): void {
  posthog.capture(eventName, props)
}
