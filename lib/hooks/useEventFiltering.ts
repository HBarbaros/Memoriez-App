import { mockEvents } from '@/lib/data/mockEvents';
import { Event } from '@/lib/types/event';
import { useMemo, useState } from 'react';

interface UseEventFilteringProps {
  userLocation: any;
  currentCity: string;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

export const useEventFiltering = ({ userLocation, currentCity, calculateDistance }: UseEventFilteringProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [locationFilter, setLocationFilter] = useState<string>('all'); // 'all', 'nearby', 'current_city'
  const [distanceRadius, setDistanceRadius] = useState<number>(20); // km
  
  // Additional filter states
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [customPriceRange, setCustomPriceRange] = useState({ min: '', max: '' });
  const [customCity, setCustomCity] = useState<string>('');

  // Enhanced filtering with location-based search
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event: Event) => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || 
        event.category.toLowerCase() === selectedCategory.toLowerCase();
        
      // Search filter
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (selectedDateFilter !== 'all') {
        const eventDate = new Date(event.date);
        const today = new Date();
        
        if (selectedDateFilter === 'today') {
          matchesDate = eventDate.toDateString() === today.toDateString();
        } else if (selectedDateFilter === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);
          matchesDate = eventDate.toDateString() === tomorrow.toDateString();
        } else if (selectedDateFilter === 'this_week') {
          const weekLater = new Date(today);
          weekLater.setDate(today.getDate() + 7);
          matchesDate = eventDate >= today && eventDate <= weekLater;
        } else if (selectedDateFilter === 'custom' && customDateRange.from && customDateRange.to) {
          const fromDate = new Date(customDateRange.from);
          const toDate = new Date(customDateRange.to);
          matchesDate = eventDate >= fromDate && eventDate <= toDate;
        }
      }
      
      // Price filter
      let matchesPrice = true;
      if (selectedPriceRange !== 'all') {
        const eventPrice = event.price || 0;
        
        if (selectedPriceRange === 'free') {
          matchesPrice = eventPrice === 0;
        } else if (selectedPriceRange === 'under_50') {
          matchesPrice = eventPrice > 0 && eventPrice < 50;
        } else if (selectedPriceRange === '50_100') {
          matchesPrice = eventPrice >= 50 && eventPrice <= 100;
        } else if (selectedPriceRange === 'over_100') {
          matchesPrice = eventPrice > 100;
        } else if (selectedPriceRange === 'custom' && customPriceRange.min && customPriceRange.max) {
          const minPrice = parseFloat(customPriceRange.min);
          const maxPrice = parseFloat(customPriceRange.max);
          matchesPrice = eventPrice >= minPrice && eventPrice <= maxPrice;
        }
      }
      
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
      } else if (locationFilter === 'stockholm') {
        matchesLocation = event.location.address.toLowerCase().includes('stockholm');
      } else if (locationFilter === 'gothenburg') {
        matchesLocation = event.location.address.toLowerCase().includes('gothenburg');
      } else if (locationFilter === 'malmö') {
        matchesLocation = event.location.address.toLowerCase().includes('malmö');
      } else if (locationFilter === 'custom' && customCity) {
        matchesLocation = event.location.address.toLowerCase().includes(customCity.toLowerCase());
      }
      
      return matchesCategory && matchesSearch && matchesDate && matchesPrice && matchesLocation;
    });
  }, [selectedCategory, searchQuery, selectedDateFilter, customDateRange, selectedPriceRange, customPriceRange, locationFilter, customCity, distanceRadius, userLocation, currentCity, calculateDistance]);

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
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('date');
    setLocationFilter('all');
    setSelectedDateFilter('all');
    setCustomDateRange({ from: '', to: '' });
    setSelectedPriceRange('all');
    setCustomPriceRange({ min: '', max: '' });
    setCustomCity('');
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
    selectedDateFilter,
    setSelectedDateFilter,
    customDateRange,
    setCustomDateRange,
    selectedPriceRange,
    setSelectedPriceRange,
    customPriceRange,
    setCustomPriceRange,
    customCity,
    setCustomCity,
    sortedEvents,
    clearFilters,
  };
};