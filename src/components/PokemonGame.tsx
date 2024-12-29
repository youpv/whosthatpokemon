'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomPokemon, checkGuess, getLocalHighScore, setLocalHighScore } from '../utils/pokemon';
import type { Pokemon, GameState } from '../types/pokemon';

export default function PokemonGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentPokemon: null,
    isRevealed: false,
    guesses: [],
    score: 0,
    highScore: getLocalHighScore(),
  });
  const [guess, setGuess] = useState('');
  const [loading, setLoading] = useState(true);
  const [showRevealAnimation, setShowRevealAnimation] = useState(false);

  async function loadNewPokemon() {
    setLoading(true);
    try {
      const pokemon = await getRandomPokemon();
      setGameState(prev => ({
        ...prev,
        currentPokemon: pokemon,
        isRevealed: false,
        guesses: [],
      }));
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadNewPokemon();
  }, []);

  function handleGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!gameState.currentPokemon || gameState.isRevealed) return;

    const isCorrect = checkGuess(guess, gameState.currentPokemon);
    const newGuesses = [...gameState.guesses, guess];

    if (isCorrect) {
      setShowRevealAnimation(true);
      const newScore = gameState.score + 1;
      const newHighScore = Math.max(newScore, gameState.highScore);
      setLocalHighScore(newHighScore);
      
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isRevealed: true,
          guesses: newGuesses,
          score: newScore,
          highScore: newHighScore,
        }));
        setShowRevealAnimation(false);
      }, 1500);

      setTimeout(loadNewPokemon, 4000);
    } else {
      setGameState(prev => ({
        ...prev,
        guesses: newGuesses,
        isRevealed: newGuesses.length >= 5,
        score: prev.isRevealed ? 0 : prev.score,
      }));
    }
    setGuess('');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400" 
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-4"
    >
      <motion.div 
        className="text-center mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <p className="text-xl font-bold text-gray-900 dark:text-white">Score: {gameState.score}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">High Score: {gameState.highScore}</p>
      </motion.div>

      {gameState.currentPokemon && (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square mb-4 bg-white dark:bg-gray-800 rounded-lg p-4 overflow-hidden"
          >
            <AnimatePresence>
              {showRevealAnimation && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 bg-yellow-400 z-10"
                />
              )}
            </AnimatePresence>
            <motion.img
              src={gameState.currentPokemon.sprites.other['official-artwork'].front_default}
              alt="Pokemon"
              className={`w-full ${!gameState.isRevealed ? 'brightness-0' : ''}`}
              initial={false}
              animate={gameState.isRevealed ? {
                filter: "brightness(1)",
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0],
              } : {
                filter: "brightness(0)",
                scale: 1,
                rotate: 0,
              }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      )}

      <motion.form 
        onSubmit={handleGuess} 
        className="space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Who's that Pokemon?"
          className="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          disabled={gameState.isRevealed}
        />
        <motion.button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600"
          disabled={gameState.isRevealed || !guess}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Guess!
        </motion.button>
      </motion.form>

      <motion.div 
        className="mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Previous Guesses:</h3>
        <ul className="space-y-1">
          {gameState.guesses.map((g, i) => (
            <motion.li 
              key={i} 
              className="text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {g}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <AnimatePresence>
        {gameState.isRevealed && (
          <motion.div 
            className="mt-4 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.p 
              className="text-xl font-bold text-gray-900 dark:text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
            >
              It was {gameState.currentPokemon?.name.toUpperCase()}!
            </motion.p>
            <motion.button
              onClick={loadNewPokemon}
              className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Pokemon
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 