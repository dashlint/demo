import { Pressable, Share, Text } from 'react-native'
import type { Book } from './catalog'

// Platform-suffixed override: iOS gets the native share sheet's tint color, an option the
// Android share intent has no equivalent for.
export function ShareSheet({ book }: { book: Book }) {
  function share(): void {
    Share.share({ message: `${book.title} by ${book.author}` }, { tintColor: '#2b2117' })
  }

  return (
    <Pressable onPress={share}>
      <Text>Share</Text>
    </Pressable>
  )
}
