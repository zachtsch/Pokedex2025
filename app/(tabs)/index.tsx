import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, FlatList, StyleSheet } from "react-native";


export default function PokemonList(){
  const [pokemonList, setPokemonList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);


  // Appends the json of each pokemon, in the range startId-endId, to pokemonList
  async function fetchPokemon(startId : number, endId : number){
    setLoading(true);
    const newPokemon : any[] = [];
    for (let id = startId; id <= endId; id++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        newPokemon.push(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    }
    setPokemonList((prev : any[]) => [...prev, ...newPokemon]);
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

  function findBackground(type : string){
    const typeColors : any = {
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
      fairy: '#EE99AC'
                      }
    return typeColors[type]
  }
  

  // Render each Pokémon item
  const renderPokemon = ({ item } : any) => (
    <View style={{width: 250, height: 250, padding: 5, margin: 5,
      alignItems: "center", borderWidth: 3, borderRadius: 30, backgroundColor: findBackground(item.types[0].type.name)}}>
        <Text style={styles.id}>#{item.id}</Text>
        <Image
          source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
          style={styles.image}
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.type}>
          {item.types
            .map((typeInfo : any) => typeInfo.type.name) // Extract type names
            .join(" / ")} 
        </Text>
    </View>
  );


  return (
    <View style={styles.pokeContainer}>
      <FlatList
        numColumns={3}
        data={pokemonList}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()} // Use Pokémon ID as the key
        onEndReached={loadMorePokemon} // Load more Pokémon when the user scrolls to the end
        onEndReachedThreshold={0.5} // Trigger loadMorePokemon when the user is halfway through the list
        ListFooterComponent={() => loading && <Text>Loading...</Text>} // Show a loading indicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pokeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dataContainer: {
    width: 250,
    height: 250,
    padding: 5,
    margin: 5,
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 30,
    backgroundColor: 'green'
    
  },
  image: {
    width: 150,
    height: 150,
  },
  id:{
    fontSize: 18,
    fontWeight: 'bold'
  },
  name:{
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold'
  },
  type:{
    color: 'white',
    fontSize: 18
  }
});