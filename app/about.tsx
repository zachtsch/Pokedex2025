import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { findBackgroundColor } from "./(tabs)";


//formats the type data from an object to useable strings
export function typeFormat(types: any[]): string[] {
  types = types.map((item) => item.type.name);
  return types;
}


export default function About() {
  interface Pokemon {
    // Define the structure of the Pokemon object to avoid errors when accessing Poke data
    name: string;
    height: number;
    weight: number;
    types: string[];
    sprites: {
      front_default: string;
    };
  }

  //id grab from index
  const { blank, query } = useLocalSearchParams();
  const id = query;

  const [poke, setPoke] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((pokeData) => {
        setPoke(pokeData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  //formats the type data from an object to useable strings
  // function typeFormat(types: any[]): string[] {
  //   types = types.map((item) => item.type.name);
  //   return types;
  // }

  //route to evolution page
  const router = useRouter();
  function touch(id: string) {
    router.push({
      pathname: "/evolution",
      params: { query: `${id}` },
    });
  }

  return (
    <View style={styles.aboutScreen}>
      {poke ? (
        <View style={styles.aboutContainer}>
          <View>
            <Text style={styles.name}>
              {poke.name
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
            <View style={{flexDirection: 'row', gap: 5}}>
              {typeFormat(poke.types).map((plate) => {
                return (<Image source={plateMap[plate]} />);
              })}
            </View>
          </View>
          <Image
            source={{ uri: poke.sprites.front_default }}
            style={{ width: 300, height: 300 }}
          />
          <Text>
            <Text style={styles.infotext}>About:</Text>
            {"\n"}
            <ScrollView style={{height: 110}}>
              <Text style={{fontSize: 16}}>Pokemon Info goes here! 
                Sometimes pokedex entries can be quite long.
                The longest flavor text entry on record is from the alolan pokedex,
                which is notorious in the series for having very long entries.
              </Text>
            </ScrollView>
          </Text>
          <View style={styles.info}>
            <Text style={[styles.text, { textAlign: "center" }]}>
              <Text style={styles.infotext}>Height:</Text>
              {"\n"}
              {poke.height / 10 + " m"}
            </Text>
            <Text style={[styles.text, { textAlign: "center" }]}>
              <Text style={styles.infotext}>Weight:</Text>
              {"\n"}
              {poke.weight / 10 + " kg"}
            </Text>
          </View>
          <Pressable
            style={[
              styles.evobutton,
              {
                backgroundColor: findBackgroundColor(typeFormat(poke.types)[0]),
              },
            ]}
            onPress={() => touch(id+'')}
          >
            <Text style={styles.buttontext}>Evolution</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.text}>Loading. . .</Text>
      )}
    </View>
  );
}

//image mapping for type plate assets
export const plateMap : Record<string, any> = {
  bug: require('../assets/images/types/bug.png'),
  dark: require('../assets/images/types/dark.png'),
  dragon: require('../assets/images/types/dragon.png'),
  electric: require('../assets/images/types/electric.png'),
  fairy: require('../assets/images/types/fairy.png'),
  fighting: require('../assets/images/types/fighting.png'),
  fire: require('../assets/images/types/fire.png'),
  flying: require('../assets/images/types/flying.png'),
  ghost: require('../assets/images/types/ghost.png'),
  grass: require('../assets/images/types/grass.png'),
  ground: require('../assets/images/types/ground.png'),
  ice: require('../assets/images/types/ice.png'),
  normal: require('../assets/images/types/normal.png'),
  poison: require('../assets/images/types/poison.png'),
  psychic: require('../assets/images/types/psychic.png'),
  rock: require('../assets/images/types/rock.png'),
  steel: require('../assets/images/types/steel.png'),
  water: require('../assets/images/types/water.png'),
};

const styles = StyleSheet.create({
  aboutScreen: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  aboutContainer: {
    width: 300,
    height: "90%",
    justifyContent: "space-evenly"
  },
  info: {
    paddingLeft: "10%",
    paddingRight: "10%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infotext: {
    fontSize: 20,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  text: {
    color: "black",
    fontSize: 20,
  },
  buttontext: {
    fontSize: 18,
    userSelect: "none"
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
  },
  evobutton: {
    height: 50,
    width: "auto",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
