import CategoryChips from '@/app/components/CategoryChips';
import EventCard from '@/app/components/EventCard';
import { Colors } from '@/app/constants/colors';
import { mockCategories, mockEvents } from '@/app/data/mockEvents';
import { Event } from '@/app/types/event';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [currentCity, setCurrentCity] = useState<string>('Loading...');
  const [sortBy, setSortBy] = useState<string>('date');
  const [locationFilter, setLocationFilter] = useState<string>('all'); // 'all', 'nearby', 'current_city'
  const [distanceRadius, setDistanceRadius] = useState<number>(20); // km

  // Animation for header collapse
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [180, 60],
    extrapolate: 'clamp',
  });

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setCurrentCity('Stockholm'); // Default fallback
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
      setCurrentCity('Stockholm'); // Default fallback
    }
  };

  // Distance calculation function
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Enhanced filtering with location-based search
  const filteredEvents = mockEvents.filter((event: Event) => {
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase());

    // Location-based filtering
    let matchesLocation = true;
    if (locationFilter === 'nearby' && userLocation) {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        event.location.latitude,
        event.location.longitude
      );
      matchesLocation = distance <= distanceRadius;
    } else if (locationFilter === 'current_city') {
      matchesLocation = event.location.address.toLowerCase().includes(currentCity.toLowerCase());
    }

    return matchesCategory && matchesSearch && matchesLocation;
  });

  // Sort events based on user preference
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'price') {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'popularity') {
      return b.attendeeCount - a.attendeeCount;
    } else if (sortBy === 'distance' && userLocation) {
      // Simple distance calculation (in real app, use proper distance formula)
      const distanceA = Math.abs(userLocation.coords.latitude - a.location.latitude);
      const distanceB = Math.abs(userLocation.coords.latitude - b.location.latitude);
      return distanceA - distanceB;
    }
    return 0;
  });

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('date');
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <EventCard event={item} />
  );

  return (
    <View style={styles.container}>
      {/* VIPMonkey-style Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.primary + '90']}
        style={styles.headerSection}
      >
        <SafeAreaView>
          {/* Top Header with Title and Filter */}
          <View style={styles.topHeader}>
            <Text style={styles.headerTitle}>Events</Text>
            <Pressable
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <View style={styles.filterIconContainer}>
                <View style={styles.filterLine} />
                <View style={[styles.filterLine, styles.filterLineMiddle]} />
                <View style={styles.filterLine} />
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Collapsible Search + Categories */}
      <Animated.View
        style={[
          styles.scrollableSection,
          {
            height: scrollY.interpolate({
              inputRange: [0, 200],
              outputRange: [120, 0],
              extrapolate: 'clamp',
            }),
            opacity: scrollY.interpolate({
              inputRange: [0, 120, 200],
              outputRange: [1, 0.6, 0],
              extrapolate: 'clamp',
            }),
          }
        ]}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textSecondary}
          />
        </View>

        {/* Category Chips */}
        <CategoryChips
          categories={mockCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </Animated.View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />

      {/* Enhanced Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header with Gradient */}
          <LinearGradient
            colors={[Colors.primary, Colors.primary + '90']}
            style={styles.modalHeader}
          >
            <SafeAreaView>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.modalTitle}>Filter Events</Text>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setShowFilterModal(false)}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </LinearGradient>
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Location Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>📍 Location</Text>
              <View style={styles.filterGrid}>
                {[
                  { key: 'all', label: 'All Locations', icon: '🌍' },
                  { key: 'current_city', label: `Current City (${currentCity})`, icon: '🏙️' },
                  { key: 'nearby', label: `Within ${distanceRadius}km`, icon: '📍' }
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.filterCard,
                      locationFilter === option.key && styles.filterCardActive
                    ]}
                    onPress={() => setLocationFilter(option.key)}
                  >
                    <Text style={styles.filterCardIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.filterCardText,
                      locationFilter === option.key && styles.filterCardTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Distance Radius */}
            {locationFilter === 'nearby' && (
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>📏 Distance Radius</Text>
                <View style={styles.radiusContainer}>
                  {[5, 10, 20, 50].map((distance) => (
                    <Pressable
                      key={distance}
                      style={[
                        styles.radiusButton,
                        distanceRadius === distance && styles.radiusButtonActive
                      ]}
                      onPress={() => setDistanceRadius(distance)}
                    >
                      <Text style={[
                        styles.radiusButtonText,
                        distanceRadius === distance && styles.radiusButtonTextActive
                      ]}>
                        {distance}km
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>🔄 Sort By</Text>
              <View style={styles.sortGrid}>
                {[
                  { key: 'date', label: 'Date', icon: '📅' },
                  { key: 'price', label: 'Price', icon: '💰' },
                  { key: 'popularity', label: 'Popularity', icon: '⭐' },
                  { key: 'distance', label: 'Distance', icon: '📍' }
                ].map((option) => (
                  <Pressable
                    key={option.key}
                    style={[
                      styles.sortCard,
                      sortBy === option.key && styles.sortCardActive
                    ]}
                    onPress={() => setSortBy(option.key)}
                  >
                    <Text style={styles.sortCardIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.sortCardText,
                      sortBy === option.key && styles.sortCardTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <Pressable
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primary + 'CC']}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </Pressable>

              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All Filters</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Simplified Header Styles (VIPMonkey-like)
  headerSection: {
    paddingBottom: 8,
  },
  scrollableSection: {
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  headerWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  headerGradient: {
    paddingBottom: 0,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },

  // Filter Icon (VIPMonkey style)
  filterIconContainer: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  filterLine: {
    height: 3,
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  filterLineMiddle: {
    width: '70%',
    alignSelf: 'flex-end',
  },

  // Search + Categories Container
  searchCategoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
  },

  // Compact Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
    marginHorizontal: 20,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
    color: Colors.textSecondary,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },

  // Categories Wrapper
  categoriesWrapper: {
    marginTop: 5,
  },

  // Events List with proper margins
  headerContainer: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
    overflow: 'hidden',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
    marginBottom: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.white + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  advancedFilters: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sortButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  sortButtonTextActive: {
    color: Colors.white,
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearFiltersText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16, // VIPMonkey-like reduced margins
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  locationButtons: {
    gap: 12,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  locationButtonActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  locationButtonText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  locationButtonTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  distanceButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  distanceButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  distanceButtonActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  distanceButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  distanceButtonTextActive: {
    color: Colors.primary,
  },
  applyButtonContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  applyButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },

  // Modern Hero Section Styles
  heroSection: {
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.white + 'CC',
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 10,
    color: Colors.white + '99',
    fontWeight: '400',
  },
  filterIcon: {
    fontSize: 18,
  },

  // Hero Content
  heroContent: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: Colors.white + 'CC',
    lineHeight: 24,
  },

  // Search Styles
  searchWrapper: {
    paddingHorizontal: 20,
  },

  // Categories Section
  categoriesSection: {
    paddingVertical: 20,
    backgroundColor: Colors.surface,
  },

  // Results Section
  resultsSection: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },

  // Modal Header Content
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },

  // Filter Grid/Cards
  filterGrid: {
    gap: 12,
  },
  filterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterCardActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  filterCardIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  filterCardText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
    flex: 1,
  },
  filterCardTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Radius Buttons
  radiusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  radiusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  radiusButtonActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  radiusButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  radiusButtonTextActive: {
    color: Colors.primary,
  },

  // Sort Grid
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sortCard: {
    width: (width - 64) / 2,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  sortCardActive: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  sortCardIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  sortCardText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  sortCardTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Modal Actions
  modalActions: {
    paddingTop: 20,
    paddingBottom: 40,
    gap: 16,
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
