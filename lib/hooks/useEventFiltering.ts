import { mockEvents } from '@/lib/data/mockEvents';
import { Event } from '@/lib/types/event';
import { useMemo, useState } from 'react';

interface UseEventFilteringProps {
  userLocation: any;
  currentCity: string;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const useEventFiltering = ({ userLocation, currentCity, calculateDistance }: UseEventFilteringProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [locationFilter, setLocationFilter] = useState<string>('all'); // 'all', 'nearby', 'current_city'
  const [distanceRadius, setDistanceRadius] = useState<number>(20); // km

  // Enhanced filtering with location-based search
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event: Event) => {
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
  }, [selectedCategory, searchQuery, locationFilter, distanceRadius, userLocation, currentCity, calculateDistance]);

  // Sort events based on user preference
  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
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
  }, [filteredEvents, sortBy, userLocation]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setSortBy('date');
  };

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    locationFilter,
    setLocationFilter,
    distanceRadius,
    setDistanceRadius,
    sortedEvents,
    clearFilters,
  };
};