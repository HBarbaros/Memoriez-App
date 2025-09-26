import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useLocationFilter = () => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('Loading...');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentCity('Stockholm');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
      
      // Get city name from coordinates
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (reverseGeocode.length > 0) {
        const city = reverseGeocode[0].city || reverseGeocode[0].district || 'Unknown';
        setCurrentCity(city);
      }
    } catch (error) {
      console.log('Error getting location:', error);
      setCurrentCity('Stockholm');
    }
  };

  // Distance calculation function
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return {
    userLocation,
    currentCity,
    calculateDistance,
  };
};