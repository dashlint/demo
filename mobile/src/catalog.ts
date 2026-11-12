export interface Book {
  id: string
  title: string
  author: string
  genreId: string
  price: number
}

export const books: Book[] = [
  { id: 'b-1', title: 'The Quiet Spine', author: 'Rosa Fenwick', genreId: 'mystery', price: 14.5 },
  { id: 'b-2', title: 'Tide Ledger', author: 'Owen Marsh', genreId: 'fiction', price: 12 },
  { id: 'b-3', title: 'Paper Lantern Nights', author: 'Imogen Veck', genreId: 'romance', price: 11.25 },
]
