import { View, Text, StyleSheet } from "react-native";

export default function Evolution() {
  return (
    <View style={styles.evocontainer}>
      <Text style={styles.text}>What? Evolution page is evolving!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  evocontainer: {
    height: "100%",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 20,
  },
});
