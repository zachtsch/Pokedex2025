import React from "react";
import { useLocalSearchParams } from "expo-router";
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

  // let id = "1"; id = whatever we're given by another page. Change to switch pokemon
  const { id } = useLocalSearchParams();

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

  return (
    <View style={styles.aboutContainer}>
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
        <Text style={styles.text}>Loading. . .</Text>
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