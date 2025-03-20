import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { findBackgroundColor } from "./(tabs)";

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

  // let id = "1"; id = whatever we're given by another page. Change to switch pokemon
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
  function typeFormat(types: any[]): string[] {
    types = types.map((item) => item.type.name);
    return types;
  }

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
            <Text style={styles.text}>{typeFormat(poke.types).join(" / ")}</Text>
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
            onPress={() => touch(id[0])}
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

const styles = StyleSheet.create({
  aboutScreen: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  aboutContainer: {
    width: 300,
    gap: 40,
    justifyContent: "center",
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
