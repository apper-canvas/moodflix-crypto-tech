import movieData from '../mockData/movies.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class MovieService {
  constructor() {
    this.movies = [...movieData]
  }

  async getAll() {
    await delay(300)
    return [...this.movies]
  }

  async getById(id) {
    await delay(200)
    const movie = this.movies.find(m => m.id === id)
    return movie ? { ...movie } : null
  }

  async getMoviesByMood(mood) {
    await delay(400)
    const filtered = this.movies.filter(movie => 
      movie.moods.includes(mood)
    )
    return [...filtered]
  }

  async searchMovies(query) {
    await delay(350)
    const filtered = this.movies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
    )
    return [...filtered]
  }

  async create(movieData) {
    await delay(400)
    const newMovie = {
      ...movieData,
      id: Date.now().toString(),
      isInWatchlist: false
    }
    this.movies.push(newMovie)
    return { ...newMovie }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.movies.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Movie not found')
    
    this.movies[index] = { ...this.movies[index], ...updateData }
    return { ...this.movies[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.movies.findIndex(m => m.id === id)
    if (index === -1) throw new Error('Movie not found')
    
    this.movies.splice(index, 1)
    return true
  }
}

export default new MovieService()