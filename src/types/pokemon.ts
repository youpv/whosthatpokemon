export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export interface GameState {
  currentPokemon: Pokemon | null;
  isRevealed: boolean;
  guesses: string[];
  score: number;
  highScore: number;
} 