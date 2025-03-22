import React, { useState } from 'react';
import { View, Image, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const RandomPokemonButton: React.FC = () => {
  const [pokemon, setPokemon] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchRandomPokemon = async () => {
    setLoading(true);
    const randomId = Math.floor(Math.random() * 898) + 1; 
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      setPokemon({ id: data.id, name: data.name });
    } catch (error) {
      console.error('Error fetching Pokémon:', error);
      alert("Couldn't fetch Pokémon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#6c757d" />} {/* Neutral color for loading indicator */}

      {pokemon ? (
        <>
          <Pressable onPress={() => router.push({ pathname: '/about', params: { query: `${pokemon.id}` } })}>
            <Image
              source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png` }}
              style={styles.image}
            />
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
          </Pressable>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.bigButton} onPress={() => setPokemon(null)}>
              <Text style={styles.buttonText}>Back</Text>
            </Pressable>
            <Pressable style={styles.bigButton} onPress={fetchRandomPokemon}>
              <Text style={styles.buttonText}>New Random Pokémon</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Pressable style={styles.button} onPress={fetchRandomPokemon}>
          <Text style={styles.buttonText}>Get Random Pokémon</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  button: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
  },
  bigButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'pokeFontMain',  
  },
  image: {
    width: 300,  
    height: 300, 
    marginTop: 10,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 5,
  },
});

export default RandomPokemonButton;
