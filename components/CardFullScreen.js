import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

const Card = props => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10
  },
  card: {
    height: (SCREEN_WIDTH - 40) * 1.4,
    width: SCREEN_WIDTH - 40,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: '#dbd8ce',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  }
});

export default Card;
