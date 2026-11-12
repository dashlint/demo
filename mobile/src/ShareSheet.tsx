import { Pressable, Share, Text } from 'react-native'
import type { Book } from './catalog'

export function ShareSheet({ book }: { book: Book }) {
  function share(): void {
    Share.share({ message: `${book.title} by ${book.author}` })
  }

  return (
    <Pressable onPress={share}>
      <Text>Share</Text>
    </Pressable>
  )
}
