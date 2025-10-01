import { EventsList } from '@/lib/components/EventsList';
import { FilterModal } from '@/lib/components/FilterModal';
import { HomeHeader } from '@/lib/components/HomeHeader';
import { SearchSection } from '@/lib/components/SearchSection';
import { useEventFiltering } from '@/lib/hooks/useEventFiltering';
import { useLocationFilter } from '@/lib/hooks/useLocationFilter';
import { useScrollAnimation } from '@/lib/hooks/useScrollAnimation';
import { mockCategories } from '@/lib/data/mockEvents';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  // Custom hooks
  const { searchSectionHeight, searchSectionOpacity, scrollHandler } = useScrollAnimation();
  const { userLocation, currentCity, calculateDistance } = useLocationFilter();
  const {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    locationFilter, setLocationFilter,
    distanceRadius, setDistanceRadius,
    sortedEvents,
    clearFilters
  } = useEventFiltering({ userLocation, currentCity, calculateDistance });

  return (
    <View style={styles.container}>

      <HomeHeader onFilterPress={() => setShowFilterModal(true)} />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={mockCategories}
        searchSectionHeight={searchSectionHeight}
        searchSectionOpacity={searchSectionOpacity}
      />

      <EventsList
        events={sortedEvents}
        scrollHandler={scrollHandler}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentCity={currentCity}
        locationFilter={locationFilter}
        onLocationFilterChange={setLocationFilter}
        distanceRadius={distanceRadius}
        onDistanceRadiusChange={setDistanceRadius}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onClearFilters={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
