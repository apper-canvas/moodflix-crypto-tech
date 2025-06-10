import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MovieCard from '@/components/molecules/MovieCard';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import { movieService } from '@/services';

const CreateMovieNightModal = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [availableMovies, setAvailableMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [votes, setVotes] = useState({});
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [currentMember] = useState('user-1'); // Simulated current user
  const [votingComplete, setVotingComplete] = useState(false);
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const result = await movieService.getAll();
      setAvailableMovies(result);
    } catch (err) {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = availableMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovieToggle = (movie) => {
    setSelectedMovies(prev => {
      const isSelected = prev.some(m => m.id === movie.id);
      if (isSelected) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
};

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Please enter a name for your movie night');
      return;
    }
    if (step === 2 && selectedMovies.length === 0) {
      toast.error('Please select at least one movie');
      return;
    }
    if (step === 2) {
      // Initialize voting for selected movies
      const initialVotes = {};
      selectedMovies.forEach(movie => {
        initialVotes[movie.id] = { votes: 0, voters: [] };
      });
      setVotes(initialVotes);
      setVotingEnabled(true);
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handleVote = async (movieId, voteType) => {
    if (!votingEnabled || votingComplete) {
      toast.error('Voting is not currently available');
      return;
    }

    const currentVotes = votes[movieId];
    if (currentVotes.voters.includes(currentMember)) {
      toast.error('You have already voted for this movie');
      return;
    }

    try {
      const newVotes = {
        ...votes,
        [movieId]: {
          votes: currentVotes.votes + (voteType === 'up' ? 1 : -1),
          voters: [...currentVotes.voters, currentMember]
        }
      };
      setVotes(newVotes);
      toast.success(`Vote ${voteType === 'up' ? 'added' : 'recorded'}!`);
    } catch (err) {
      toast.error('Failed to record vote');
    }
  };

  const getWinningMovie = () => {
    if (Object.keys(votes).length === 0) return null;
    
    let maxVotes = -Infinity;
    let winningMovieId = null;
    
    Object.entries(votes).forEach(([movieId, voteData]) => {
      if (voteData.votes > maxVotes) {
        maxVotes = voteData.votes;
        winningMovieId = movieId;
      }
    });
    
    return selectedMovies.find(m => m.id === winningMovieId);
  };

  const completeVoting = () => {
    setVotingComplete(true);
    setVotingEnabled(false);
    const winner = getWinningMovie();
    if (winner) {
      toast.success(`"${winner.title}" won the vote!`);
    }
  };

  const handleCreate = () => {
    if (selectedMovies.length === 0) {
      toast.error('Please select at least one movie');
      return;
    }

    const winningMovie = getWinningMovie();
    const movieNightData = {
      name: name.trim(),
      movieIds: selectedMovies.map(m => m.id),
      votes: votes,
      winningMovieId: winningMovie?.id || null,
      votingComplete: votingComplete
    };

    onCreate(movieNightData);
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return 'Name your collection';
      case 2: return 'Select movies';
      case 3: return 'Vote on movies';
      default: return '';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-card rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary">
<div>
              <h2 className="text-2xl font-heading text-accent">
                Create Movie Night
              </h2>
              <p className="text-accent/70">
                Step {step} of 3: {getStepTitle()}
              </p>
            </div>
            <Button
              onClick={onClose}
              className="p-2 text-accent/50 hover:text-accent bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="X" size={24} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6">
<AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label htmlFor="movieNightName" className="block text-accent font-medium mb-2">
                      Movie Night Name
                    </label>
                    <Input
                      id="movieNightName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Action Movie Marathon, Rom-Com Night..."
                      autoFocus
                      className="bg-background"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      onClick={onClose}
                      className="px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Next
                    </Button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Search */}
                  <div className="relative">
                    <ApperIcon 
                      name="Search" 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent/50 w-5 h-5" 
                    />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="pl-10 pr-4 py-3 bg-background"
                    />
                  </div>

                  {/* Selected Movies */}
                  {selectedMovies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-accent mb-3">
                        Selected Movies ({selectedMovies.length})
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedMovies.map(movie => (
                          <motion.div
                            key={movie.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full"
                          >
                            <span className="text-sm">{movie.title}</span>
                            <Button
                              onClick={() => handleMovieToggle(movie)}
                              className="hover:bg-primary/20 rounded-full p-1 bg-transparent"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <ApperIcon name="X" size={12} />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Movies */}
                  <div className="max-h-96 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-accent mb-3">
                      Available Movies
                    </h3>
                    {loading ? (
                      <div className="grid grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="aspect-poster bg-secondary animate-pulse rounded-lg" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {filteredMovies.map(movie => {
                          const isSelected = selectedMovies.some(m => m.id === movie.id);
                          return (
                            <motion.div
                              key={movie.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMovieToggle(movie)}
                              className={`cursor-pointer relative rounded-lg overflow-hidden ${
                                isSelected ? 'ring-2 ring-primary' : ''
                              }`}
                            >
                              <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full aspect-poster object-cover"
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                  <div className="bg-primary text-white rounded-full p-1">
                                    <ApperIcon name="Check" size={16} />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      disabled={selectedMovies.length === 0}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Voting
                    </Button>
                  </div>
                </motion.div>
              ) : step === 3 ? (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Voting Header */}
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-accent mb-2">
                      Vote for Your Favorite Movies
                    </h3>
                    <p className="text-accent/70">
                      {votingComplete ? 'Voting complete! See results below.' : 'Cast your vote for each movie. You can only vote once per movie.'}
                    </p>
                  </div>

                  {/* Voting Results Summary */}
                  {votingComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Trophy" className="text-primary w-5 h-5" />
                        <h4 className="text-lg font-semibold text-primary">Winner</h4>
                      </div>
                      {(() => {
                        const winner = getWinningMovie();
                        return winner ? (
                          <p className="text-accent">
                            <span className="font-medium">{winner.title}</span> won with {votes[winner.id]?.votes || 0} votes!
                          </p>
                        ) : (
                          <p className="text-accent/70">No clear winner yet</p>
                        );
                      })()}
                    </motion.div>
                  )}

                  {/* Movies with Voting */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {selectedMovies.map(movie => {
                      const movieVotes = votes[movie.id] || { votes: 0, voters: [] };
                      const hasVoted = movieVotes.voters.includes(currentMember);
                      const isWinner = votingComplete && getWinningMovie()?.id === movie.id;
                      
                      return (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`bg-background rounded-lg p-4 border ${
                            isWinner ? 'border-primary bg-primary/5' : 'border-secondary'
                          }`}
                        >
                          <div className="flex space-x-4">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-16 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-accent line-clamp-2">
                                  {movie.title}
                                </h4>
                                {isWinner && (
                                  <div className="flex items-center space-x-1 text-primary">
                                    <ApperIcon name="Trophy" size={16} />
                                    <span className="text-sm font-medium">Winner</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    onClick={() => handleVote(movie.id, 'up')}
                                    disabled={!votingEnabled || hasVoted || votingComplete}
                                    className={`p-2 rounded-lg transition-colors ${
                                      hasVoted || !votingEnabled || votingComplete
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }`}
                                    whileHover={votingEnabled && !hasVoted && !votingComplete ? { scale: 1.05 } : {}}
                                    whileTap={votingEnabled && !hasVoted && !votingComplete ? { scale: 0.95 } : {}}
                                  >
                                    <ApperIcon name="ThumbsUp" size={16} />
                                  </Button>
                                  
                                  <Button
                                    onClick={() => handleVote(movie.id, 'down')}
                                    disabled={!votingEnabled || hasVoted || votingComplete}
                                    className={`p-2 rounded-lg transition-colors ${
                                      hasVoted || !votingEnabled || votingComplete
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                    whileHover={votingEnabled && !hasVoted && !votingComplete ? { scale: 1.05 } : {}}
                                    whileTap={votingEnabled && !hasVoted && !votingComplete ? { scale: 0.95 } : {}}
                                  >
                                    <ApperIcon name="ThumbsDown" size={16} />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <span className="text-accent font-medium">
                                    {movieVotes.votes} votes
                                  </span>
                                  {hasVoted && (
                                    <div className="text-primary">
                                      <ApperIcon name="Check" size={16} />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {hasVoted && (
                                <p className="text-sm text-accent/70 mt-2">
                                  You've voted for this movie
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Voting Actions */}
                  <div className="flex justify-between">
                    <Button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-card border border-secondary text-accent rounded-lg font-medium hover:bg-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back to Movies
                    </Button>
                    
                    <div className="flex space-x-3">
                      {!votingComplete && votingEnabled && (
                        <Button
                          onClick={completeVoting}
                          className="px-6 py-3 bg-warning text-black rounded-lg font-medium hover:bg-warning/90"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          End Voting
                        </Button>
                      )}
                      
                      <Button
                        onClick={handleCreate}
                        disabled={!votingComplete}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Create Movie Night
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CreateMovieNightModal;