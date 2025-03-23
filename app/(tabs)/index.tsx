import { useRouter } from 'expo-router';
import React, { useState, useEffect } from "react";
import { Dimensions, Platform, View, Text, Image, FlatList, StyleSheet, Pressable, ImageBackground } from "react-native";
import { plateMap, typeFormat } from '../about';
import * as Font from 'expo-font';

export function findBackgroundColor(type: string): string {
  const typeColors: { [type: string]: string } = {
    normal: "#A8A878",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
  };
  return typeColors[type];
}

export default function PokemonList(){
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const router = useRouter();


  type pokeType = {
    type : {
      name : string
    }
  }

  interface Pokemon {
    name : string;
    id : string
    sprites: {
      front_default: string;
    };
    types : pokeType[]
  }


  // Appends the json of each pokemon, in the range startId-endId, to pokemonList
  async function fetchPokemon(startId : number, endId : number){
    setLoading(true);
    const newPokemon : Pokemon[] = [];
    for (let id = startId; id <= endId && id <= 1025; id++) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data : Pokemon = await response.json();
        newPokemon.push(data);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    }
    setPokemonList((prev : Pokemon[]) => [...prev, ...newPokemon]);
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

  function findSecondBackground(types: Array<pokeType>) {
    if (types.length == 1) {
      return findBackgroundColor(types[0].type.name);
    } else {
      return findBackgroundColor(types[1].type.name);
    }
  }

  function touch(id : string){
    router.push({
      pathname: '/about',
      params: { query: `${id}`},
    });
  }
  

  type p = {
    item : Pokemon
  }

  // Render each Pokémon item
  const renderPokemon = ({ item } : {item : Pokemon}) => (
    <Pressable style={styles.dataContainer} onPress={()=>touch(item.id)}>
        <View style={[styles.mybackground,{borderLeftColor: findBackgroundColor(item.types[0].type.name), borderBottomColor: findSecondBackground(item.types)}]}></View>
        <Text style={styles.id}>#{String(item.id).padStart(4, '0')}</Text>
        <View style={styles.descriptionContainer}>
          <Image
            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
            style={styles.image}
          />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.type}>
            {typeFormat(item.types).map((plate) => {
                return (<Image key={plate} source={plateMap[plate]}/>)
              })}

            {/* {item.types
              .map((typeInfo) => typeInfo.type.name) // Extract type names
              .join(" / ")}  */}
          </Text>
        </View>
    </Pressable>
  );

    // Fit to mobile devices 
    let numColumns = 3;//first assume it's desktop
    let isWeb = false;
    if (Platform.OS === 'web') isWeb = true;

    if (isWeb){
      let windowWidth = Dimensions.get('window').width;
      if (windowWidth < 750) numColumns = 1;//mobile web
    } else {
      numColumns = 1;//ios or android
    }

    // grab font
    useEffect(() => {
      Font.loadAsync({
        'pokeFontMain': require('../../assets/fonts/pokeFontMain.ttf'),
      });
    }, []);

  return (
    <ImageBackground source={require('../../assets/images/pokeBack.png')} style={styles.pokeContainer}>
      <Text style={styles.title}>Pokédex ◓</Text>
      <FlatList
        numColumns={numColumns}
        data={pokemonList}
        renderItem={renderPokemon}
        keyExtractor={(item) => item.id.toString()} // Use Pokémon ID as the key
        onEndReached={loadMorePokemon} // Load more Pokémon when the user scrolls to the end
        onEndReachedThreshold={0.5} // Trigger loadMorePokemon when the user is halfway through the list
        ListFooterComponent={() => loading && <Text>Loading...</Text>} // Show a loading indicator
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  title: {
       fontSize: 80,
       fontWeight: 'bold',
       fontFamily: 'pokeFontMain'
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
  mybackground:{
    position: 'absolute',
    borderRadius: 0,
    borderLeftWidth: 250,
    borderBottomWidth: 250,
    bottom: 0,
  },
  dataContainer: {
    width: 250,
    height: 250,
    padding: 5,
    margin: 5,
    alignItems: "center",
    borderRadius: 0,
  },
  image: {
    width: 150,
    height: 150,
    padding: 0,
    margin: 0
  },
  id:{
    fontSize: 24,
    textAlign: 'left',
    width: 210,
    paddingTop: 10,
    fontFamily: 'pokeFontMain'
  },
  name:{
    textTransform: 'uppercase',
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: 'pokeFontMain'
  },
  type:{
    fontSize: 28,
    flexDirection: 'row',
    gap: 5
  }
});
