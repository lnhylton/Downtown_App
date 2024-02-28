import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Location from 'expo-location';

export default function LocationTracker() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const updateLocation = async () => {
        try {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          setErrorMsg(null);
        } catch (error) {
          setErrorMsg(error.message);
        }
      };

      // Update location initially
      updateLocation();

      // Poll for location every 5 seconds
      const intervalId = setInterval(updateLocation, 1000);

      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    })();
  }, []);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = "Longitude: " + location.coords.longitude + "\n" + "Latitude: " + location.coords.latitude;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
