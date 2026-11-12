export interface Book {
  id: string
  title: string
  author: string
  genreLabel: string
  genreId: string
  price: number
}

export const books: Book[] = [
  { id: 'b-1', title: 'The Quiet Spine', author: 'Rosa Fenwick', genreLabel: 'Mystery', genreId: 'mystery', price: 14.5 },
  { id: 'b-2', title: 'Tide Ledger', author: 'Owen Marsh', genreLabel: 'Fiction', genreId: 'fiction', price: 12 },
  { id: 'b-3', title: 'Paper Lantern Nights', author: 'Imogen Veck', genreLabel: 'Romance', genreId: 'romance', price: 11.25 },
  { id: 'b-4', title: 'Cartography of Small Towns', author: 'Dev Okonkwo', genreLabel: 'Nonfiction', genreId: 'nonfiction', price: 18 },
  { id: 'b-5', title: 'The Moth Keeper', author: 'Saoirse Lund', genreLabel: 'Fantasy', genreId: 'fantasy', price: 15.75 },
]
