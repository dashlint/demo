import { useMemo, useState } from 'react'
import { books, type Book } from './catalog'
import { track, trackDynamic } from './analytics'

const LAUNCH_DISCOUNT_ENABLED = false

function App() {
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<Book[]>([])
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const [giftCode, setGiftCode] = useState('')
  const [reviewRating, setReviewRating] = useState(5)

  const results = useMemo(
    () => books.filter((book) => book.title.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  function runSearch(next: string) {
    setQuery(next)
    track('search_performed', { query: next, result_count: results.length })
  }

  function viewBook(book: Book) {
    // dashlint-demo pattern 2: the code names this property "genre_id", not "genre"; a
    // dashboard filter written against "genre" never matches a real event.
    track('book_viewed', { book_id: book.id, genre_id: book.genreId, price: book.price })
  }

  function addToCart(book: Book) {
    setCart((current) => [...current, book])
    track('added_to_cart', { book_id: book.id, price: book.price })
  }

  function startCheckout() {
    const total = cart.reduce((sum, book) => sum + book.price, 0)
    track('checkout_started', { cart_total: total, item_count: cart.length })

    maybeApplyLaunchDiscount(total)
  }

  function maybeApplyLaunchDiscount(total: number) {
    // dashlint-demo pattern 7: this flag is permanently off, so "discount_applied" never
    // actually fires. A dashboard formula that divides by this series as its denominator is
    // dead, even though the event name is real and spelled correctly.
    if (LAUNCH_DISCOUNT_ENABLED) {
      track('discount_applied', { discount_pct: 10, cart_total: total })
    }
  }

  function completeOrder() {
    const orderId = `order-${Date.now()}`
    const total = cart.reduce((sum, book) => sum + book.price, 0)
    // dashlint-demo pattern 3: no "format" property is ever attached to this event (the shop
    // does not track physical vs. ebook), so a breakdown on "format" has nothing to split.
    track('order_completed', { order_id: orderId, total, item_count: cart.length })
    setLastOrderId(orderId)
    setCart([])
  }

  function returnBook() {
    if (!lastOrderId) return
    // dashlint-demo pattern 12: this path is wired and does fire from the browser, but
    // scripts/traffic.mjs never drives a return flow, so this event never shows up in the
    // demo project's real traffic.
    track('book_returned', { order_id: lastOrderId, reason: 'changed_mind' })
  }

  function submitReview(book: Book) {
    // dashlint-demo pattern 5: only the web app sends this event; the mobile app has no
    // review flow, so a cross-platform dashboard tile built on it covers one platform only.
    track('review_submitted', { book_id: book.id, rating: reviewRating })
  }

  function addToWishlist(book: Book) {
    // dashlint-demo pattern 10: a live series (paired, in the dashboard, with a dead
    // "wishlist_added_legacy" series in the same OR group; the group as a whole stays live).
    track('wishlist_added', { book_id: book.id })
  }

  function redeemGiftCard() {
    // dashlint-demo pattern 1: renamed from "gift_card_redeemed" to "giftcard_redeemed"; a
    // dashboard tile or alert still built against the old name can never see this event.
    track('giftcard_redeemed', { code: giftCode, amount: 10 })
    setGiftCode('')
  }

  function signUpForNewsletter(source: string) {
    track('newsletter_signup', { source })
  }

  function shareBook(book: Book, channel: string) {
    // the only call site for the open-world capture defined in analytics.ts (pattern 16)
    trackDynamic(`shared_via_${channel}`, { book_id: book.id })
  }

  return (
    <main>
      <h1>Thornwick &amp; Pages</h1>

      <section>
        <input
          placeholder="Search the shelves"
          value={query}
          onChange={(event) => runSearch(event.target.value)}
        />
        <ul>
          {results.map((book) => (
            <li key={book.id}>
              <button onClick={() => viewBook(book)}>{book.title}</button> by {book.author}
              <button onClick={() => addToCart(book)}>Add to cart</button>
              <button onClick={() => addToWishlist(book)}>Wishlist</button>
              <button onClick={() => shareBook(book, 'email')}>Share</button>
              <label>
                Rating
                <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button onClick={() => submitReview(book)}>Submit review</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Cart ({cart.length})</h2>
        <button onClick={startCheckout} disabled={cart.length === 0}>Checkout</button>
        <button onClick={completeOrder} disabled={cart.length === 0}>Complete order</button>
        {lastOrderId && <button onClick={returnBook}>Return last order</button>}
      </section>

      <section>
        <h2>Gift card</h2>
        <input value={giftCode} onChange={(e) => setGiftCode(e.target.value)} placeholder="Gift card code" />
        <button onClick={redeemGiftCard}>Redeem</button>
      </section>

      <section>
        <h2>Newsletter</h2>
        <button onClick={() => signUpForNewsletter('footer')}>Sign up</button>
      </section>
    </main>
  )
}

export default App
