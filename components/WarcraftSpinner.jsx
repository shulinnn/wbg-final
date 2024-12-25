import React from "react";
import { View, ActivityIndicator, StyleSheet,Platform } from "react-native";

const WarcraftSpinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
  },
});

export default WarcraftSpinner;