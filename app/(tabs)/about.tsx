import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useEffect } from "react";

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

  let id = "1"; //id = whatever we're given by another page. Change to switch pokemon

  const [poke, setPoke] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/" + id)
      .then((response) => response.json())
      .then((pokeData) => {
        setPoke(pokeData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  //formats the type data from an object to useable strings
  function typeFormat(types: any[]): string[] {
    types = types.map((item) => item.type.name);
    return types;
  }

  return (
    <View style={styles.aboutContainer}>
      <Text style={styles.text}>About screen placeholder</Text>
      {/* Check to see if Poke data is null before rendering*/}
      {poke ? (
        <View>
          <Image
            source={{ uri: poke.sprites.front_default }}
            style={{ width: 300, height: 300 }}
          />
          <Text style={styles.text}>
            {typeFormat(poke.types).join(" / ")}
            {"\n"}
            {poke.name
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            {"\n"}
            {poke.height / 10 + " m"}
            {"\n"}
            {poke.weight / 10 + " kg"}
          </Text>
        </View>
      ) : (
        <Text style={styles.text}>Pokemon data not available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aboutContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "blue",
    fontSize: 20,
  },
});
