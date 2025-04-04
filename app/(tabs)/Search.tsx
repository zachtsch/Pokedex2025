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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { plateMap, typeFormat } from '../about';

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
  const [matchedPokemonData, setMatchedPokemonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pokemonNames, setPokemonNames] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);
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

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        pokeFontMain: require('../../assets/fonts/pokeFontMain.ttf'),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  const isValidInput = (input) => /^[a-zA-Z0-9]+$/.test(input.trim());

  const handleSearch = async () => {
    Keyboard.dismiss();
    const trimmedName = pokemonName.trim().toLowerCase();

    if (!trimmedName || !isValidInput(trimmedName)) {
      setErrorMessage('Please enter a valid Pokémon name or ID.');
      setMatchedPokemonData([]);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setMatchedPokemonData([]);

    try {
      if (!isNaN(trimmedName)) {
        // Search by numeric ID
        const data = await returnPokeApi(trimmedName);
        setMatchedPokemonData([data]);
      } else {
        // Search by name prefix
        const filteredNames = pokemonNames.filter((name) =>
          name.startsWith(trimmedName)
        );

        if (filteredNames.length === 0) {
          throw new Error('No matches found');
        }

        const results = await Promise.allSettled(
          filteredNames.map((name) => returnPokeApi(name))
        );

        const successful = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value);

        if (successful.length === 0) {
          throw new Error('All Pokémon fetches failed.');
        }

        setMatchedPokemonData(successful);
      }
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
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

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {matchedPokemonData.length > 0 && !loading &&
          matchedPokemonData.map((pokemon) => {
            const primaryType = pokemon.types?.[0]?.type?.name ?? 'normal';
            const secondaryType =
              pokemon.types?.[1]?.type?.name ?? primaryType;

            return (
              <TouchableOpacity
                key={pokemon.id}
                onPress={() =>
                  router.push({
                    pathname: '/about',
                    params: { query: `${pokemon.id}` },
                  })
                }
              >
                <View style={styles.dataContainer}>
                  <View
                    style={[
                      styles.mybackground,
                      {
                        borderLeftColor: findBackgroundColor(primaryType),
                        borderBottomColor: findBackgroundColor(secondaryType),
                      },
                    ]}
                  />
                  <Text style={styles.id}>
                    #{String(pokemon.id).padStart(4, '0')}
                  </Text>
                  <View style={styles.descriptionContainer}>
                    <Image
                      source={{
                        uri: pokemon.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
                      }}
                      style={styles.image}
                    />
                    <Text style={styles.name}>{pokemon.name}</Text>
                    <View style={styles.type}>
                      {typeFormat(pokemon.types).map((plate) =>
                        plateMap[plate] ? (
                          <Image
                            key={plate}
                            source={plateMap[plate]}
                            style={{ width: 75, height: 30 }}
                            resizeMode='contain'
                          />
                        ) : null
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

async function returnPokeApi(name) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Pokémon not found`);
    }
    return await response.json();
  } catch (e) {
    throw e;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  name: {
    textTransform: 'uppercase',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'pokeFontMain',
  },
  type: {
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default HomeScreen; //updated code