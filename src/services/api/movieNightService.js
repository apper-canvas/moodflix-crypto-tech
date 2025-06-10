import movieNightData from '../mockData/movieNights.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateShareCode = () => {
  return Math.random().toString(36).substr(2, 9)
}

class MovieNightService {
  constructor() {
    this.movieNights = [...movieNightData]
  }

  async getAll() {
    await delay(300)
    return [...this.movieNights]
  }

  async getById(id) {
    await delay(200)
    const movieNight = this.movieNights.find(mn => mn.id === id)
    return movieNight ? { ...movieNight } : null
  }

  async getByShareCode(shareCode) {
    await delay(250)
    const movieNight = this.movieNights.find(mn => mn.shareCode === shareCode)
    return movieNight ? { ...movieNight } : null
  }

  async create(movieNightData) {
    await delay(400)
    const newMovieNight = {
      ...movieNightData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      shareCode: generateShareCode()
    }
    this.movieNights.unshift(newMovieNight)
    return { ...newMovieNight }
  }

  async update(id, updateData) {
    await delay(300)
    const index = this.movieNights.findIndex(mn => mn.id === id)
    if (index === -1) throw new Error('Movie night not found')
    
    this.movieNights[index] = { 
      ...this.movieNights[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.movieNights[index] }
  }

  async delete(id) {
    await delay(300)
    const index = this.movieNights.findIndex(mn => mn.id === id)
    if (index === -1) throw new Error('Movie night not found')
    
    this.movieNights.splice(index, 1)
    return true
  }
}

export default new MovieNightService()