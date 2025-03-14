import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, FlatList, StyleSheet } from "react-native";

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1); // Start fetching from ID 1

  // Function to fetch Pokémon data
  const fetchPokemon = async (startId, endId) => {
    setLoading(true);
    const newPokemon = [];
    for (let id = startId; id <= endId; id++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        newPokemon.push(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    }
    setPokemonList((prev) => [...prev, ...newPokemon]); // Append new Pokémon to the list
    setLoading(false);
  };

  // Initial fetch (first 20 Pokémon)
  useEffect(() => {
    fetchPokemon(nextPage, nextPage + 19);
    setNextPage(nextPage + 20);
  }, []);

  // Load more Pokémon when the user scrolls to the end
  const loadMorePokemon = () => {
    if (!loading) {
      fetchPokemon(nextPage, nextPage + 19);
      setNextPage(nextPage + 20);
    }
  };

  // Render each Pokémon item
  const renderPokemon = ({ item }) => (
    <View style={styles.dataContainer}>
      <Text>#{item.id} {item.name}</Text>
      <Image
        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
        style={styles.image}
      />
      <Text>
        {item.types
          .map((typeInfo) => typeInfo.type.name) // Extract type names
          .join("/")} {/* Join multiple types with a slash */}
      </Text>
    </View>
  );

  return (
    //Question: How to get this centered with either View or ScrollView?
    //<ScrollView /*style={{alignItems:'center'}}*/>
    <FlatList
      numColumns={3}
      data={pokemonList}
      renderItem={renderPokemon}
      keyExtractor={(item) => item.id.toString()} // Use Pokémon ID as the key
      onEndReached={loadMorePokemon} // Load more Pokémon when the user scrolls to the end
      onEndReachedThreshold={0.5} // Trigger loadMorePokemon when the user is halfway through the list
      ListFooterComponent={() => loading && <Text>Loading...</Text>} // Show a loading indicator
    />
    //</ScrollView>
  );
};

const styles = StyleSheet.create({
  dataContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default PokemonList;
