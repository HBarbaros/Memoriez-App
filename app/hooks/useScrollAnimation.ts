import { useRef } from 'react';
import { Animated } from 'react-native';

export const useScrollAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 60],
    extrapolate: 'clamp',
  });

  const searchSectionHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [120, 0],
    extrapolate: 'clamp',
  });

  const searchSectionOpacity = scrollY.interpolate({
    inputRange: [0, 120, 200],
    outputRange: [1, 0.6, 0],
    extrapolate: 'clamp',
  });

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return {
    scrollY,
    headerHeight,
    searchSectionHeight,
    searchSectionOpacity,
    scrollHandler,
  };
};