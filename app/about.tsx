import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable, ScrollView, ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import { findBackgroundColor } from "./(tabs)";
import { useFonts } from "expo-font";

export default function About() {
  interface Pokemon {
    name: string;
    height: number;
    weight: number;
    types: string[];
    info: string;
    sprites: {
      front_default: string;
    };
  }

  //id grab from index
  const { blank, query } = useLocalSearchParams();
  const id = query;

  const [poke, setPoke] = useState<Pokemon | null>(null);

  const [fontsLoaded] = useFonts({
    'pokefont': require('../assets/fonts/Pokemon.ttf'),
  });

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((pokeData) => {
        return fetch("https://pokeapi.co/api/v2/pokemon-species/" + id)
        .then((response) => response.json())
        .then((speciesData) => {
          setPoke({...pokeData, 
            types: pokeData.types.map((item: { type: { name: string; }; }) => item.type.name),
            info: speciesData.flavor_text_entries.find((entry: any) => 
              entry.language.name == "en")
            .flavor_text.replace(/[\n\f]/g, ' ').replace('POKéMON', 'Pokémon'), 
            //flavor text has really ugly default formatting, tried to clean it up a little
          })
        })
        .catch((error) => console.error("Error fetching data:", error));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [id]);

  //route to evolution page
  const router = useRouter();
  function touch(id: string) {
    router.push({
      pathname: "/evolution",
      params: { query: `${id}` },
    });
  }


  return (
    <ImageBackground source = {require('../assets/images/pokemonbackground-blur.png')} style ={styles.aboutScreen}>
      {poke ? (
        <View style={[styles.aboutContainer,{borderColor: findBackgroundColor(poke.types[0])}]}>
          <View>
            <View style={styles.namebar}>
              <Text style={styles.name}>
                {poke.name
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
              <Text style={[styles.infotext, {fontSize: 16}]}>{'#'+ id}</Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5}}>
              {poke.types.map((plate) => {
                return (<Image source={plateMap[plate]} />);
              })}
            </View>
          </View>
          <ImageBackground source = {require('../assets/images/pokemonbackground-blur.png')} style={{alignItems: 'center', height: 300, width: 330, justifyContent: 'center'}}>
          <Image
            source={{ uri: poke.sprites.front_default }}
            style={{ width: 300, height: 300, resizeMode: "contain" }}
          />
          </ImageBackground>
          <Text>
            <Text style={styles.infotext}>About:</Text>
            {"\n"}
            <ScrollView>
              <Text style={{fontSize: 13, fontFamily: 'pokefont'}}>{poke.info}
              </Text>
            </ScrollView>
          </Text>
          <View style={styles.info}>
            <Text style={[styles.text, { textAlign: "center" }]}>
              <Text style={styles.infotext}>Height:</Text>
              {"\n"}
              <Text style={{fontSize: 18}}>{poke.height / 10 + " m"}</Text>
            </Text>
            <Text style={[styles.text, { textAlign: "center" }]}>
              <Text style={styles.infotext}>Weight:</Text>
              {"\n"}
              <Text style={{fontSize: 18}}>{poke.weight / 10 + " kg"}</Text>
            </Text>
          </View>
          <Pressable
            style={[styles.evobutton,
              {backgroundColor: findBackgroundColor(poke.types[0])}]} 
                onPress={() => touch(id+'')}>
            <Text style={styles.buttontext}>EVOLUTION</Text>
          </Pressable>         
        </View>
      ) : (
        <Text style={styles.text}>Loading. . .</Text>
      )}
    </ImageBackground>
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
  },
  aboutContainer: {
    width: 400,
    height: "90%",
    justifyContent: "space-evenly",
    backgroundColor:"white",
    paddingHorizontal: 20,
    borderWidth: 15,
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
    fontFamily: 'pokefont',
  },
  text: {
    color: "black",
    fontSize: 20,
    fontFamily: 'pokefont',
  },
  buttontext: {
    fontSize: 18,
    userSelect: "none",
    fontFamily: 'pokefont',
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: 28,
    fontFamily: 'pokefont',
  },
  namebar:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  evobutton: {
    height: 50,
    width: "auto",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
