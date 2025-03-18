import { View, Text, StyleSheet, Image } from 'react-native';

import {useState, useEffect} from 'react';

export default function About() {
  interface Pokemon { // Define the structure of the Pokemon object to avoid errors when accessing Poke data
    name: string;
    height: number;
    sprites: {
      front_default: string;
    };
  }

  const [poke, setPoke] = useState<Pokemon | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/1")
    .then(response => response.json())
    .then((pokeData) => {setPoke(pokeData)})
    .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <View>
      <Text style={styles.text}>About screen placeholder</Text>
      // Check to see if Poke data is null before rendering
      {poke ? (<View> 
        <Image source={{uri: poke.sprites.front_default}} style={{width: 300, height: 300}}/>
        <Text style = {styles.text}>{poke.name}{"\n"}{poke.height}</Text>
      </View>)
         : (<Text style={styles.text}>Pokemon data not available</Text>)}
    </View>
  );
}

const styles = StyleSheet.create({
  text : {
    color: 'blue',
    fontSize: 20,},
  });