import axios from 'axios';
import { Pokemon } from '../types/pokemon';

const POKEMON_COUNT = 151; // First generation only

export async function getRandomPokemon(): Promise<Pokemon> {
  const id = Math.floor(Math.random() * POKEMON_COUNT) + 1;
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.data;
}

export function checkGuess(guess: string, pokemon: Pokemon): boolean {
  return guess.toLowerCase() === pokemon.name.toLowerCase();
}

export function getLocalHighScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('highScore') || '0', 10);
}

export function setLocalHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('highScore', score.toString());
} 