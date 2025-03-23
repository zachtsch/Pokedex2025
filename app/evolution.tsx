import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


type RootStackParamList = {
  About: { id: string }; 
};

// Define the navigation prop type
type EvolutionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "About">;

// Define types for the evolution chain data
type EvolutionChain = {
  name: string;
  url: string;
  id: string;
};

type EvolutionChainLink = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
};

type EvolutionChainResponse = {
  chain: EvolutionChainLink;
};

const Evolution = () => {
  const route = useRoute();
  const navigation = useNavigation<EvolutionScreenNavigationProp>();

  
  const { id } = (route.params as { id?: string }) || {};
  const [evolutionData, setEvolutionData] = useState<EvolutionChain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to parse the evolution chain
  const parseEvolutionChain = useCallback((chain: EvolutionChainLink): EvolutionChain[] => {
    const evolutionChain: EvolutionChain[] = [];
    let current: EvolutionChainLink | null = chain;

    while (current) {
      const pokemonIdFromUrl = current.species.url.split("/").slice(-2, -1)[0];
      evolutionChain.push({
        name: current.species.name,
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonIdFromUrl}`,
        id: pokemonIdFromUrl,
      });

      // Handle multiple evolution paths (e.g., Eevee)
      if (current.evolves_to.length > 1) {
        current.evolves_to.forEach((evolution) => {
          const pokemonId = evolution.species.url.split("/").slice(-2, -1)[0];
          evolutionChain.push({
            name: evolution.species.name,
            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            id: pokemonId,
          });
        });
        break; // Stop after handling multiple paths
      }

      current = current.evolves_to.length ? current.evolves_to[0] : null;
    }

    return evolutionChain;
  }, []);

  // Fetch evolution data
  const fetchEvolutionData = useCallback(async () => {
    if (!id) {
      setError("No Pokémon ID provided");
      setLoading(false);
      return;
    }

    try {
      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      if (!speciesResponse.ok) throw new Error("Failed to fetch species data");
      const speciesData = await speciesResponse.json();
      const evolutionChainUrl = speciesData.evolution_chain.url;

      const evolutionResponse = await fetch(evolutionChainUrl);
      if (!evolutionResponse.ok) throw new Error("Failed to fetch evolution chain");
      const evolutionData: EvolutionChainResponse = await evolutionResponse.json();

      const chain = parseEvolutionChain(evolutionData.chain);
      setEvolutionData(chain);
    } catch (error) {
      console.error("Error fetching evolution data:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, [id, parseEvolutionChain]);

  useEffect(() => {
    fetchEvolutionData();
  }, [fetchEvolutionData]);

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (!id) {
    return <Text style={styles.errorText}>Error: No Pokémon ID provided</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Evolution Chain</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFCC00" />
      ) : evolutionData.length === 0 ? (
        <Text style={styles.noEvolutionText}>This Pokémon does not evolve.</Text>
      ) : (
        <FlatList
          data={evolutionData}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.evolutionItem}>
              <TouchableOpacity
                style={[styles.pokemonContainer, id === item.id ? styles.highlight : null]}
                onPress={() => navigation.navigate("About", { id: item.id })}
              >
                <Image
                  source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png` }}
                  style={styles.image}
                  onError={(e) => console.log("Image failed to load", e.nativeEvent.error)}
                />
                <Text style={styles.pokemonName}>{item.name}</Text>
              </TouchableOpacity>
              {index < evolutionData.length - 1 && <Text style={styles.arrow}>➡</Text>}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  errorText: { fontSize: 18, color: "red" },
  noEvolutionText: { fontSize: 18, color: "#666" },
  evolutionItem: { flexDirection: "row", alignItems: "center" },
  pokemonContainer: { alignItems: "center", marginHorizontal: 10 },
  highlight: { backgroundColor: "#FFEB3B", borderRadius: 10, padding: 5 },
  image: { width: 60, height: 60 },
  pokemonName: { fontSize: 18, textTransform: "capitalize", marginTop: 5 },
  arrow: { fontSize: 20, marginHorizontal: 10 },
});

export default React.memo(Evolution);