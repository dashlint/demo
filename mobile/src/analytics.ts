import PostHog from 'posthog-react-native'

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY
const apiHost = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

// dashlint-demo pattern 8: "Revenue per device" is a SQL insight queried directly against the
// PostHog events table, not through event or property definitions. dashlint cannot read SQL, so
// this insight always reports "not checked", regardless of what happens to the events it
// actually depends on.

export const posthog = apiKey
  ? new PostHog(apiKey, {
      host: apiHost,
      // dashlint-demo pattern 14: posthog-react-native captures "Application Opened" and
      // "Application Became Active" on its own (captureAppLifecycleEvents defaults to true); a
      // funnel built on these lifecycle events has no call site anywhere in this app to find,
      // only this SDK default.
      captureAppLifecycleEvents: true,
    })
  : null

type ShopEventName =
  | 'book_viewed_native'
  | 'added_to_cart_native'
  | 'payment_method_selected'
  | 'order_completed_native'
  | 'wishlist_synced'

export function track(event: ShopEventName, props?: Record<string, string | number | boolean>): void {
  posthog?.capture(event, props)
}
