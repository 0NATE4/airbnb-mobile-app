import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListingsMap, { Listing } from './components/ListingsMap';
import listings from './assets/sample-listings.json';

export default function App() {
  return (
    <View style={styles.container}>
      <ListingsMap listingData={listings as Listing[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
