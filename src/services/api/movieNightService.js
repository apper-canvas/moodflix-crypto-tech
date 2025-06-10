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
      shareCode: generateShareCode(),
      votes: movieNightData.votes || {},
      winningMovieId: movieNightData.winningMovieId || null,
      votingComplete: movieNightData.votingComplete || false
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

  async vote(movieNightId, movieId, memberId, voteType) {
    await delay(200)
    const movieNight = this.movieNights.find(mn => mn.id === movieNightId)
    if (!movieNight) throw new Error('Movie night not found')
    
    if (!movieNight.votes) movieNight.votes = {}
    if (!movieNight.votes[movieId]) {
      movieNight.votes[movieId] = { votes: 0, voters: [] }
    }
    
    const movieVotes = movieNight.votes[movieId]
    if (movieVotes.voters.includes(memberId)) {
      throw new Error('Member has already voted for this movie')
    }
    
    movieVotes.votes += (voteType === 'up' ? 1 : -1)
    movieVotes.voters.push(memberId)
    
    movieNight.updatedAt = new Date().toISOString()
    return { ...movieNight }
  }

  async getVotingResults(movieNightId) {
    await delay(150)
    const movieNight = this.movieNights.find(mn => mn.id === movieNightId)
    if (!movieNight) throw new Error('Movie night not found')
    
    return movieNight.votes || {}
  }

  async completeVoting(movieNightId) {
    await delay(250)
    const movieNight = this.movieNights.find(mn => mn.id === movieNightId)
    if (!movieNight) throw new Error('Movie night not found')
    
    // Determine winner
    let maxVotes = -Infinity
    let winningMovieId = null
    
    if (movieNight.votes) {
      Object.entries(movieNight.votes).forEach(([movieId, voteData]) => {
        if (voteData.votes > maxVotes) {
          maxVotes = voteData.votes
          winningMovieId = movieId
        }
      })
    }
    
    movieNight.votingComplete = true
    movieNight.winningMovieId = winningMovieId
    movieNight.updatedAt = new Date().toISOString()
    
    return { ...movieNight }
  }
}

export default new MovieNightService()