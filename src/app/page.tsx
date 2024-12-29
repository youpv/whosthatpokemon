import PokemonGame from '../components/PokemonGame';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Who&apos;s That Pokémon?</h1>
        <PokemonGame />
      </div>
    </main>
  );
}
