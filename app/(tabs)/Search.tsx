import React, { useState, useEffect } from 'react';
import {
  Image,
  View,
  TextInput,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { plateMap, typeFormat } from '../about'; // Adjust path if needed

// Move this to a utils file if you want to reuse it across files
export function findBackgroundColor(type) {
  const typeColors = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
  };
  return typeColors[type] || '#AAA';
}

function HomeScreen() {
  const [pokemonName, setPokemonName] = useState('');
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pokemonNames, setPokemonNames] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAllPokemonNames = async () => {
      try {
        const response = await fetch(
          'https://pokeapi.co/api/v2/pokemon?limit=10000'
        );
        const json = await response.json();
        const names = json.results.map((p) => p.name);
        setPokemonNames(names);
      } catch (err) {
        console.error('Failed to fetch Pokémon list:', err);
      }
    };
    fetchAllPokemonNames();
  }, []);

  // Load the Pokémon font
  useEffect(() => {
    Font.loadAsync({
      pokeFontMain: require('../../assets/fonts/pokeFontMain.ttf'),
    });
  }, []);

  const isValidInput = (input) => /^[a-zA-Z0-9]+$/.test(input.trim());

  const handleSearch = async () => {
    Keyboard.dismiss();
    const trimmedName = pokemonName.trim().toLowerCase();

    if (!trimmedName || !isValidInput(trimmedName)) {
      setErrorMessage('Please enter a valid Pokémon name or ID.');
      setPokemonData(null);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const data = await returnPokeApi(trimmedName);
      setPokemonData(data);
    } catch (error) {
      // Smart fallback: find close match
      const fallback = pokemonNames.find((name) =>
        name.startsWith(trimmedName)
      );

      if (fallback) {
        try {
          const smartData = await returnPokeApi(fallback);
          setPokemonData(smartData);
          return;
        } catch {
          // fallback failed too
        }
      }

      setPokemonData(null);
      setErrorMessage(
        'Pokémon not found. Please check your input or try another name or ID.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePressResult = () => {
    if (pokemonData?.id) {
      router.push({
        pathname: '/about',
        params: { query: `${pokemonData.id}` },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a Pokémon by name or ID</Text>
      <TextInput
        style={styles.input}
        placeholder='e.g. Pikachu or 25'
        value={pokemonName}
        onChangeText={setPokemonName}
        onSubmitEditing={handleSearch}
        returnKeyType='search'
      />
      <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
        <Text style={styles.btnText}>Search</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size='large'
          color='#888'
          style={{ marginTop: 20 }}
        />
      )}

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {pokemonData && !loading && (
        <TouchableOpacity onPress={handlePressResult}>
          <View style={styles.dataContainer}>
            <View
              style={[
                styles.mybackground,
                {
                  borderLeftColor: findBackgroundColor(
                    pokemonData.types[0].type.name
                  ),
                  borderBottomColor:
                    pokemonData.types.length > 1
                      ? findBackgroundColor(pokemonData.types[1].type.name)
                      : findBackgroundColor(pokemonData.types[0].type.name),
                },
              ]}
            />
            <Text style={styles.id}>
              #{String(pokemonData.id).padStart(4, '0')}
            </Text>
            <View style={styles.descriptionContainer}>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png`,
                }}
                style={styles.image}
              />
              <Text style={styles.name}>{pokemonData.name}</Text>
              <View style={styles.type}>
                {typeFormat(pokemonData.types).map((plate) => (
                  <Image
                    key={plate}
                    source={plateMap[plate]}
                    style={{ width: 75, height: 30 }}
                    resizeMode='contain'
                  />
                ))}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

async function returnPokeApi(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Pokémon not found`);
  }
  const json = await response.json();
  return json;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'pokeFontMain',
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchBtn: {
    backgroundColor: '#4a90e2',
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 15,
    textAlign: 'center',
  },
  dataContainer: {
    width: 250,
    height: 250,
    padding: 5,
    marginTop: 25,
    alignItems: 'center',
    borderRadius: 0,
    alignSelf: 'center',
  },
  mybackground: {
    position: 'absolute',
    borderRadius: 0,
    borderLeftWidth: 250,
    borderBottomWidth: 250,
    bottom: 0,
  },
  id: {
    fontSize: 24,
    textAlign: 'left',
    width: 210,
    paddingTop: 10,
    fontFamily: 'pokeFontMain',
  },
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    padding: 0,
    margin: 0,
  },
  name: {
    textTransform: 'uppercase',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'pokeFontMain',
  },
  type: {
    fontSize: 28,
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
});

export default HomeScreen;
