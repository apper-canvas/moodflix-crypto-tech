import movieService from './movieService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class WatchlistService {
  constructor() {
    this.watchlist = {
      movieIds: ['1', '3', '5'], // Pre-populate with some movies
      addedAt: [new Date('2024-01-15'), new Date('2024-01-10'), new Date('2024-01-05')]
    }
  }

  async getWatchlist() {
    await delay(200)
    return { ...this.watchlist, movieIds: [...this.watchlist.movieIds] }
  }

  async getWatchlistMovies() {
    await delay(350)
    const movies = []
    
    for (const movieId of this.watchlist.movieIds) {
      const movie = await movieService.getById(movieId)
      if (movie) {
        movies.push({ ...movie, isInWatchlist: true })
      }
    }
    
    return movies
  }

  async addToWatchlist(movieId) {
    await delay(250)
    
    if (this.watchlist.movieIds.includes(movieId)) {
      throw new Error('Movie already in watchlist')
    }
    
    this.watchlist.movieIds.push(movieId)
    this.watchlist.addedAt.push(new Date())
    
    return true
  }

  async removeFromWatchlist(movieId) {
    await delay(250)
    
    const index = this.watchlist.movieIds.indexOf(movieId)
    if (index === -1) {
      throw new Error('Movie not in watchlist')
    }
    
    this.watchlist.movieIds.splice(index, 1)
    this.watchlist.addedAt.splice(index, 1)
    
    return true
  }

  async isInWatchlist(movieId) {
    await delay(100)
    return this.watchlist.movieIds.includes(movieId)
  }
}

export default new WatchlistService()