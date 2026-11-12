import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { books, type Book } from './catalog'
import { track } from './analytics'
import { ShareSheet } from './ShareSheet'

// dashlint-demo pattern 11: the "Checkout funnel health" alert targets series index 2 (the
// completion step). A formula series was later inserted at index 1, shifting every series after
// it along by one; the alert still reads index 2, which is now the formula, not the completion
// step it was built to watch. No app code produces or fixes this: the bookkeeping lives entirely
// in the dashboard's alert config.

export default function App() {
  const [cart, setCart] = useState<Book[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card')

  function viewBook(book: Book): void {
    track('book_viewed_native', { book_id: book.id, genre_id: book.genreId })
  }

  function addToCart(book: Book): void {
    setCart((current) => [...current, book])
    // dashlint-demo pattern 9: the "Added to cart (any platform)" dashboard series is built from
    // a PostHog Action that matches both this event and the web app's "added_to_cart" event, not
    // from either event name alone.
    track('added_to_cart_native', { book_id: book.id })
  }

  function selectPaymentMethod(method: 'card' | 'cash'): void {
    setPaymentMethod(method)
    // dashlint-demo pattern 4: the checkout funnel's step filter checks payment_method == "Card"
    // (capitalized); the app always sends the lowercase value below, so the filter never matches
    // until the step-value case rule ships (V3). Until then this pattern is not checked.
    track('payment_method_selected', { payment_method: method })
  }

  function completeOrder(): void {
    const total = cart.reduce((sum, book) => sum + book.price, 0)
    // dashlint-demo pattern 6: a dashboard tile excludes orders where "gift_wrap" is false, but
    // the app never attaches a gift_wrap property to this event at all. The negative filter has
    // nothing to exclude, so the tile is degraded (not dead): the underlying event still arrives.
    track('order_completed_native', { total, payment_method: paymentMethod })
    setCart([])
  }

  function syncWishlist(book: Book): void {
    track('wishlist_synced', { book_id: book.id })
  }

  return (
    <ScrollView>
      <Text>Thornwick & Pages (mobile)</Text>
      {books.map((book) => (
        <View key={book.id}>
          <Pressable onPress={() => viewBook(book)}>
            <Text>{book.title}</Text>
          </Pressable>
          <Pressable onPress={() => addToCart(book)}>
            <Text>Add to cart</Text>
          </Pressable>
          <Pressable onPress={() => syncWishlist(book)}>
            <Text>Save for later</Text>
          </Pressable>
          <ShareSheet book={book} />
        </View>
      ))}
      <Text>Cart ({cart.length})</Text>
      <Pressable onPress={() => selectPaymentMethod('card')}>
        <Text>Pay with card</Text>
      </Pressable>
      <Pressable onPress={() => selectPaymentMethod('cash')}>
        <Text>Pay with cash on pickup</Text>
      </Pressable>
      <Pressable onPress={completeOrder}>
        <Text>Complete order</Text>
      </Pressable>
    </ScrollView>
  )
}
