'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      const newScore = gameState.score + 1;
      const newHighScore = Math.max(newScore, gameState.highScore);
      setLocalHighScore(newHighScore);
      
      setGameState(prev => ({
        ...prev,
        isRevealed: true,
        guesses: newGuesses,
        score: newScore,
        highScore: newHighScore,
      }));

      setTimeout(loadNewPokemon, 2000);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="text-center mb-4">
        <p className="text-xl font-bold">Score: {gameState.score}</p>
        <p className="text-sm">High Score: {gameState.highScore}</p>
      </div>

      {gameState.currentPokemon && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square mb-4"
        >
          <img
            src={gameState.currentPokemon.sprites.other['official-artwork'].front_default}
            alt="Pokemon"
            className={`w-full ${!gameState.isRevealed ? 'brightness-0' : ''}`}
          />
        </motion.div>
      )}

      <form onSubmit={handleGuess} className="space-y-4">
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Who's that Pokemon?"
          className="w-full p-2 border rounded"
          disabled={gameState.isRevealed}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
          disabled={gameState.isRevealed || !guess}
        >
          Guess!
        </button>
      </form>

      <div className="mt-4">
        <h3 className="font-bold mb-2">Previous Guesses:</h3>
        <ul className="space-y-1">
          {gameState.guesses.map((g, i) => (
            <li key={i} className="text-gray-600">{g}</li>
          ))}
        </ul>
      </div>

      {gameState.isRevealed && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold">
            It was {gameState.currentPokemon?.name.toUpperCase()}!
          </p>
          <button
            onClick={loadNewPokemon}
            className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Next Pokemon
          </button>
        </div>
      )}
    </div>
  );
} 