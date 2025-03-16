import React, { useState, useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";


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


  function findBackgroundColor(type : string){
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

  function findSecondBackground(types : Array<any>){
    if (types.length == 1){
      return findBackgroundColor(types[0].type.name)}
    else {
      return findBackgroundColor(types[1].type.name)
    }
  }
  

  // Render each Pokémon item
  const renderPokemon = ({ item } : any) => (
    <View style={[styles.dataContainer, {backgroundColor: findBackgroundColor(item.types[0].type.name)}]}>
        <View style={[styles.otherHalf,{borderBottomColor: findSecondBackground(item.types)}]}></View>
        <Text style={styles.id}>#{String(item.id).padStart(4, '0')}</Text>
        <View style={styles.descriptionContainer}>
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
    </View>
  );


  return (
    <View style={styles.pokeContainer}>
      <Text style={styles.title}>Pokédex</Text>
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
  title: {
       fontSize: 40,
       fontWeight: 'bold'
  },
  pokeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherHalf:{
    position: 'absolute',
    borderRadius: 40,
    borderLeftWidth: 250,
    borderBottomWidth: 250,
    borderLeftColor: 'transparent',
    bottom: 0,
  },
  dataContainer: {
    width: 250,
    height: 250,
    padding: 5,
    margin: 5,
    alignItems: "center",
    borderRadius: 40,
  },
  image: {
    width: 150,
    height: 150,
    padding: 0,
    margin: 0
  },
  id:{
    fontSize: 18,
    textAlign: 'left',
    width: 210,
    paddingTop: 10,
  },
  name:{
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 'bold'
  },
  type:{
    fontSize: 18,
  }
});