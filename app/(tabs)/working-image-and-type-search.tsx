import React, { useState } from 'react';
import { Image, View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';

const HomeScreen = () => {
  const [pokemonName, setPokemonName] = useState(''); // State to store the input value
  const [pokemonData, setPokemonData] = useState(null); // State to store the fetched data

  const handleSearch = async () => {
    try {
      const data = await returnPokeApi(pokemonName); // Call the function with the current input value
      setPokemonData(data); // Update state with the fetched data
    } catch (error) {
      Alert.alert('Error', error.message); // Show an error message
    }
  };

  return (
    <View style={styles.container}>
      {/* Controlled TextInput */}
      <Text>Enter pokemon, example 'pikachu' then click 'Search'. Enter key does not work.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Pokémon name"
        value={pokemonName} // Controlled by state
        onChangeText={setPokemonName} // Update state when the user types
      />

      {/* Button to trigger the search */}
      <Button title="Search" onPress={handleSearch} />

      {/* Display the fetched Pokémon data */}
      {pokemonData && (
        <View style={styles.dataContainer}>
          <Text>{pokemonData.name}</Text>
          <Text>
            {pokemonData.types
              .map((typeInfo) => typeInfo.type.name) // Extract type names
              .join("/")} {/* Join multiple types with a comma */}
          </Text>
          <Image
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.id}.png` }}
            style={styles.image}
          />
        </View>
      )}
    </View>
  );
};

// Function to fetch Pokémon data
async function returnPokeApi(name) {
  const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    return json; // Return the JSON data
  } catch (error) {
    console.error(error.message);
    throw error; // Re-throw the error
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  dataContainer: {
    marginTop: 20,
  },
  image: {
    width:100,
    height:100
  }
});

export default HomeScreen; // Exporting HomeScreen as default
