import { Colors } from '@/lib/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import { Dimensions, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    currentCity: string;
    locationFilter: string;
    onLocationFilterChange: (filter: string) => void;
    distanceRadius: number;
    onDistanceRadiusChange: (radius: number) => void;
    sortBy: string;
    onSortByChange: (sort: string) => void;
    onClearFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    currentCity,
    locationFilter,
    onLocationFilterChange,
    distanceRadius,
    onDistanceRadiusChange,
    sortBy,
    onSortByChange,
    onClearFilters,
}) => {
    const [selectedDateFilter, setSelectedDateFilter] = useState('all');
    const [customDateRange, setCustomDateRange] = useState({ from: '', to: '' });
    const [selectedPriceRange, setSelectedPriceRange] = useState('all');
    const [customPriceRange, setCustomPriceRange] = useState({ min: '', max: '' });
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [customCity, setCustomCity] = useState('');

    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    // Get display text for current selections
    const getDateDisplayText = () => {
        if (selectedDateFilter === 'custom' && customDateRange.from && customDateRange.to) {
            return `${customDateRange.from} - ${customDateRange.to}`;
        }
        const dateOptions: { [key: string]: string } = {
            all: 'Any Date',
            today: 'Today',
            tomorrow: 'Tomorrow',
            this_week: 'This Week'
        };
        return dateOptions[selectedDateFilter] || 'Any Date';
    };

    const getPriceDisplayText = () => {
        if (selectedPriceRange === 'custom' && customPriceRange.min && customPriceRange.max) {
            return `$${customPriceRange.min} - $${customPriceRange.max}`;
        }
        const priceOptions: { [key: string]: string } = {
            all: 'Any Price',
            free: 'Free Events',
            under_50: 'Under $50',
            '50_100': '$50 - $100',
            over_100: 'Over $100'
        };
        return priceOptions[selectedPriceRange] || 'Any Price';
    };

    const getLocationDisplayText = () => {
        if (locationFilter === 'custom' && customCity) {
            return customCity;
        }
        const locationOptions: { [key: string]: string } = {
            all: 'Any Location',
            stockholm: 'Stockholm',
            gothenburg: 'Gothenburg',
            malmö: 'Malmö'
        };
        return locationOptions[locationFilter] || 'Any Location';
    };

    const getSortDisplayText = () => {
        const sortOptions: { [key: string]: string } = {
            date: 'Date',
            price: 'Price',
            distance: 'Distance'
        };
        return sortOptions[sortBy] || 'Date';
    };

    const handleClearFilters = () => {
        // Reset local states
        setSelectedDateFilter('all');
        setCustomDateRange({ from: '', to: '' });
        setSelectedPriceRange('all');
        setCustomPriceRange({ min: '', max: '' });
        setSelectedCategory('all');
        setCustomCity('');
        setExpandedSection(null);

        onLocationFilterChange('all');

        onClearFilters();
    };
    const handleModalClose = () => {
        // Reset expanded sections when modal closes
        setExpandedSection(null);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleModalClose}
        >
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={120}
            >
                {/* Header */}
                <LinearGradient
                    colors={[Colors.primary, Colors.primary + '90']}
                    style={styles.modalHeader}
                >
                    <SafeAreaView>
                        <View style={styles.modalHeaderContent}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <Pressable style={styles.closeButton} onPress={handleModalClose}>
                                <Text style={styles.closeButtonText}>×</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </LinearGradient>

                <ScrollView
                    ref={scrollViewRef}
                    style={styles.modalContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    {/* Date Selector - Modern */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Date</Text>
                        <Pressable
                            style={[styles.modernCard, expandedSection === 'date' && styles.modernCardExpanded]}
                            onPress={() => setExpandedSection(expandedSection === 'date' ? null : 'date')}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View>
                                        <Text style={styles.cardTitle}>Date</Text>
                                        <Text style={styles.cardSubtitle}>{getDateDisplayText()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.modernArrow, expandedSection === 'date' && styles.modernArrowExpanded]}>
                                    <Text style={styles.arrowIcon}>›</Text>
                                </View>
                            </View>
                        </Pressable>

                        {expandedSection === 'date' && (
                            <View style={styles.modernExpandedContent}>
                                <View style={styles.optionsGrid}>
                                    {[
                                        { key: 'all', label: 'Any Date', desc: 'All events' },
                                        { key: 'today', label: 'Today', desc: 'Events today' },
                                        { key: 'tomorrow', label: 'Tomorrow', desc: 'Next day' },
                                        { key: 'this_week', label: 'This Week', desc: 'Next 7 days' },
                                        { key: 'custom', label: 'Custom Range', desc: 'Pick dates' }
                                    ].map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.modernOption,
                                                selectedDateFilter === option.key && styles.modernOptionActive
                                            ]}
                                            onPress={() => {
                                                setSelectedDateFilter(option.key);
                                                if (option.key !== 'custom') {
                                                    setExpandedSection(null);
                                                }
                                            }}
                                        >
                                            <View style={[
                                                styles.optionIndicator,
                                                selectedDateFilter === option.key && styles.optionIndicatorActive
                                            ]}>
                                                {selectedDateFilter === option.key && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                                <Text style={[
                                                    styles.optionTitle,
                                                    selectedDateFilter === option.key && styles.optionTitleActive
                                                ]}>
                                                    {option.label}
                                                </Text>
                                                <Text style={[
                                                    styles.optionDesc,
                                                    selectedDateFilter === option.key && styles.optionDescActive
                                                ]}>
                                                    {option.desc}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>

                                {selectedDateFilter === 'custom' && (
                                    <View style={styles.modernCustomInput}>
                                        <Text style={styles.customInputTitle}>Select Date Range</Text>
                                        <View style={styles.customInputRow}>
                                            <View style={styles.modernInputField}>
                                                <Text style={styles.modernInputLabel}>From Date</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="DD/MM/YYYY"
                                                    value={customDateRange.from}
                                                    onChangeText={(text) => setCustomDateRange({ ...customDateRange, from: text })}
                                                    placeholderTextColor="#94a3b8"
                                                    returnKeyType="next"
                                                    blurOnSubmit={false}
                                                    onFocus={() => {
                                                        setTimeout(() => {
                                                            scrollViewRef.current?.scrollTo({ y: 200, animated: true });
                                                        }, 100);
                                                    }}
                                                />
                                            </View>
                                            <View style={styles.modernInputField}>
                                                <Text style={styles.modernInputLabel}>To Date</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="DD/MM/YYYY"
                                                    value={customDateRange.to}
                                                    onChangeText={(text) => setCustomDateRange({ ...customDateRange, to: text })}
                                                    placeholderTextColor="#94a3b8"
                                                    returnKeyType="done"
                                                    onSubmitEditing={Keyboard.dismiss}
                                                    onFocus={() => {
                                                        setTimeout(() => {
                                                            scrollViewRef.current?.scrollTo({ y: 200, animated: true });
                                                        }, 100);
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Categories - Modern */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <Pressable
                            style={[styles.modernCard, expandedSection === 'category' && styles.modernCardExpanded]}
                            onPress={() => setExpandedSection(expandedSection === 'category' ? null : 'category')}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View>
                                        <Text style={styles.cardTitle}>Categories</Text>
                                        <Text style={styles.cardSubtitle}>
                                            {selectedCategory === 'all' ? 'All Categories' :
                                                selectedCategory === 'music' ? 'Music' :
                                                    selectedCategory === 'sports' ? 'Sports' :
                                                        selectedCategory === 'arts' ? 'Arts & Culture' :
                                                            selectedCategory === 'food' ? 'Food & Drink' :
                                                                selectedCategory === 'nightlife' ? 'Nightlife' :
                                                                    selectedCategory === 'business' ? 'Business' :
                                                                        selectedCategory === 'outdoors' ? 'Outdoors' :
                                                                            'All Categories'}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.modernArrow, expandedSection === 'category' && styles.modernArrowExpanded]}>
                                    <Text style={styles.arrowIcon}>›</Text>
                                </View>
                            </View>
                        </Pressable>

                        {expandedSection === 'category' && (
                            <View style={styles.modernExpandedContent}>
                                <View style={styles.optionsGrid}>
                                    {[
                                        { key: 'all', label: 'All Categories', desc: 'Every type' },
                                        { key: 'music', label: 'Music', desc: 'Concerts & shows' },
                                        { key: 'sports', label: 'Sports', desc: 'Games & matches' },
                                        { key: 'arts', label: 'Arts & Culture', desc: 'Museums & galleries' },
                                        { key: 'food', label: 'Food & Drink', desc: 'Restaurants & bars' },
                                        { key: 'nightlife', label: 'Nightlife', desc: 'Clubs & parties' },
                                        { key: 'business', label: 'Business', desc: 'Networking & meetings' },
                                        { key: 'outdoors', label: 'Outdoors', desc: 'Nature & activities' }
                                    ].map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.modernOption,
                                                selectedCategory === option.key && styles.modernOptionActive
                                            ]}
                                            onPress={() => {
                                                setSelectedCategory(option.key);
                                                setExpandedSection(null);
                                            }}
                                        >
                                            <View style={[
                                                styles.optionIndicator,
                                                selectedCategory === option.key && styles.optionIndicatorActive
                                            ]}>
                                                {selectedCategory === option.key && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                                <Text style={[
                                                    styles.optionTitle,
                                                    selectedCategory === option.key && styles.optionTitleActive
                                                ]}>
                                                    {option.label}
                                                </Text>
                                                <Text style={[
                                                    styles.optionDesc,
                                                    selectedCategory === option.key && styles.optionDescActive
                                                ]}>
                                                    {option.desc}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Price Selector - Modern */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price Range</Text>
                        <Pressable
                            style={[styles.modernCard, expandedSection === 'price' && styles.modernCardExpanded]}
                            onPress={() => setExpandedSection(expandedSection === 'price' ? null : 'price')}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View>
                                        <Text style={styles.cardTitle}>Price</Text>
                                        <Text style={styles.cardSubtitle}>{getPriceDisplayText()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.modernArrow, expandedSection === 'price' && styles.modernArrowExpanded]}>
                                    <Text style={styles.arrowIcon}>›</Text>
                                </View>
                            </View>
                        </Pressable>

                        {expandedSection === 'price' && (
                            <View style={styles.modernExpandedContent}>
                                <View style={styles.optionsGrid}>
                                    {[
                                        { key: 'all', label: 'Any Price', desc: 'All events' },
                                        { key: 'free', label: 'Free Events', desc: 'No cost' },
                                        { key: 'under_50', label: 'Under $50', desc: 'Budget friendly' },
                                        { key: '50_100', label: '$50 - $100', desc: 'Mid range' },
                                        { key: 'over_100', label: 'Over $100', desc: 'Premium' },
                                        { key: 'custom', label: 'Custom Range', desc: 'Set your own' }
                                    ].map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.modernOption,
                                                selectedPriceRange === option.key && styles.modernOptionActive
                                            ]}
                                            onPress={() => {
                                                setSelectedPriceRange(option.key);
                                                if (option.key !== 'custom') {
                                                    setExpandedSection(null);
                                                }
                                            }}
                                        >
                                            <View style={[
                                                styles.optionIndicator,
                                                selectedPriceRange === option.key && styles.optionIndicatorActive
                                            ]}>
                                                {selectedPriceRange === option.key && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                                <Text style={[
                                                    styles.optionTitle,
                                                    selectedPriceRange === option.key && styles.optionTitleActive
                                                ]}>
                                                    {option.label}
                                                </Text>
                                                <Text style={[
                                                    styles.optionDesc,
                                                    selectedPriceRange === option.key && styles.optionDescActive
                                                ]}>
                                                    {option.desc}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>

                                {selectedPriceRange === 'custom' && (
                                    <View style={styles.modernCustomInput}>
                                        <Text style={styles.customInputTitle}>Set Your Price Range</Text>
                                        <View style={styles.customInputRow}>
                                            <View style={styles.modernInputField}>
                                                <Text style={styles.modernInputLabel}>Min ($)</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="0"
                                                    value={customPriceRange.min}
                                                    onChangeText={(text) => setCustomPriceRange({ ...customPriceRange, min: text })}
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#94a3b8"
                                                    returnKeyType="next"
                                                    blurOnSubmit={false}
                                                />
                                            </View>
                                            <View style={styles.modernInputField}>
                                                <Text style={styles.modernInputLabel}>Max ($)</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="999"
                                                    value={customPriceRange.max}
                                                    onChangeText={(text) => setCustomPriceRange({ ...customPriceRange, max: text })}
                                                    keyboardType="numeric"
                                                    placeholderTextColor="#94a3b8"
                                                    returnKeyType="done"
                                                    onSubmitEditing={Keyboard.dismiss}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Location Selector - Modern */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <Pressable
                            style={[styles.modernCard, expandedSection === 'location' && styles.modernCardExpanded]}
                            onPress={() => setExpandedSection(expandedSection === 'location' ? null : 'location')}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View>
                                        <Text style={styles.cardTitle}>Location</Text>
                                        <Text style={styles.cardSubtitle}>{getLocationDisplayText()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.modernArrow, expandedSection === 'location' && styles.modernArrowExpanded]}>
                                    <Text style={styles.arrowIcon}>›</Text>
                                </View>
                            </View>
                        </Pressable>

                        {expandedSection === 'location' && (
                            <View style={styles.modernExpandedContent}>
                                <View style={styles.optionsGrid}>
                                    {[
                                        { key: 'all', label: 'Any Location', desc: 'All cities' },
                                        { key: 'stockholm', label: 'Stockholm', desc: 'Capital city' },
                                        { key: 'gothenburg', label: 'Gothenburg', desc: 'West coast' },
                                        { key: 'malmö', label: 'Malmö', desc: 'Southern city' },
                                        { key: 'custom', label: 'Other City', desc: 'Custom location' }
                                    ].map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.modernOption,
                                                locationFilter === option.key && styles.modernOptionActive
                                            ]}
                                            onPress={() => {
                                                onLocationFilterChange(option.key);
                                                if (option.key !== 'custom') {
                                                    setExpandedSection(null);
                                                }
                                            }}
                                        >
                                            <View style={[
                                                styles.optionIndicator,
                                                locationFilter === option.key && styles.optionIndicatorActive
                                            ]}>
                                                {locationFilter === option.key && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                                <Text style={[
                                                    styles.optionTitle,
                                                    locationFilter === option.key && styles.optionTitleActive
                                                ]}>
                                                    {option.label}
                                                </Text>
                                                <Text style={[
                                                    styles.optionDesc,
                                                    locationFilter === option.key && styles.optionDescActive
                                                ]}>
                                                    {option.desc}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>

                                {locationFilter === 'custom' && (
                                    <View style={styles.modernCustomInput}>
                                        <Text style={styles.customInputTitle}>Enter City Name</Text>
                                        <View style={styles.customInputRow}>
                                            <View style={[styles.modernInputField, { flex: 1 }]}>
                                                <Text style={styles.modernInputLabel}>City</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="Copenhagen, Oslo, Helsinki..."
                                                    value={customCity}
                                                    onChangeText={setCustomCity}
                                                    placeholderTextColor="#94a3b8"
                                                    returnKeyType="done"
                                                    onSubmitEditing={Keyboard.dismiss}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>

                    {/* Sort Selector - Modern */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sort By</Text>
                        <Pressable
                            style={[styles.modernCard, expandedSection === 'sort' && styles.modernCardExpanded]}
                            onPress={() => setExpandedSection(expandedSection === 'sort' ? null : 'sort')}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.cardLeft}>
                                    <View>
                                        <Text style={styles.cardTitle}>Sort</Text>
                                        <Text style={styles.cardSubtitle}>{getSortDisplayText()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.modernArrow, expandedSection === 'sort' && styles.modernArrowExpanded]}>
                                    <Text style={styles.arrowIcon}>›</Text>
                                </View>
                            </View>
                        </Pressable>

                        {expandedSection === 'sort' && (
                            <View style={styles.modernExpandedContent}>
                                <View style={styles.optionsGrid}>
                                    {[
                                        { key: 'date', label: 'Date', desc: 'Newest events first' },
                                        { key: 'price', label: 'Price', desc: 'Lowest price first' },
                                        { key: 'distance', label: 'Distance', desc: 'Closest events first' }
                                    ].map((option) => (
                                        <Pressable
                                            key={option.key}
                                            style={[
                                                styles.modernOption,
                                                sortBy === option.key && styles.modernOptionActive
                                            ]}
                                            onPress={() => {
                                                onSortByChange(option.key);
                                                setExpandedSection(null);
                                            }}
                                        >
                                            <View style={[
                                                styles.optionIndicator,
                                                sortBy === option.key && styles.optionIndicatorActive
                                            ]}>
                                                {sortBy === option.key && (
                                                    <Text style={styles.checkmark}>✓</Text>
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                                <Text style={[
                                                    styles.optionTitle,
                                                    sortBy === option.key && styles.optionTitleActive
                                                ]}>
                                                    {option.label}
                                                </Text>
                                                <Text style={[
                                                    styles.optionDesc,
                                                    sortBy === option.key && styles.optionDescActive
                                                ]}>
                                                    {option.desc}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actions}>
                        <Pressable style={styles.applyButton} onPress={handleModalClose}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </Pressable>

                        <Pressable style={styles.clearButton} onPress={handleClearFilters}>
                            <Text style={styles.clearButtonText}>Clear All</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        paddingBottom: 8,
    },
    modalHeaderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.white + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.white,
    },
    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    // Cards matching Explore.tsx style
    modernCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: Colors.white,
        marginBottom: 2,
        borderRadius: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    modernCardExpanded: {
        marginBottom: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    cardLeft: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    modernArrow: {
        padding: 4,
    },
    modernArrowExpanded: {
        transform: [{ rotate: '90deg' }],
    },
    arrowIcon: {
        fontSize: 18,
        color: Colors.textSecondary,
    },
    modernExpandedContent: {
        backgroundColor: Colors.white,
        marginTop: 0,
        marginBottom: 2,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionsGrid: {
        paddingTop: 8,
    },
    modernOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderRadius: 0,
        marginBottom: 0,
    },
    modernOptionActive: {
        backgroundColor: 'transparent',
    },
    optionIndicator: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'transparent',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#d1d1d6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionIndicatorActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: Colors.text,
        letterSpacing: -0.1,
    },
    optionTitleActive: {
        color: Colors.text,
        fontWeight: '500',
    },
    optionDesc: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '400',
        marginTop: 1,
    },
    optionDescActive: {
        color: Colors.textSecondary,
    },
    checkmark: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    // Icon containers for cards
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    modernCardIcon: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748b',
    },
    categoryIcon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#64748b',
    },
    modernCustomInput: {
        marginTop: 12,
        padding: 16,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 0,
    },
    customInputTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 12,
        letterSpacing: -0.1,
    },
    customInputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    modernInputField: {
        flex: 1,
    },
    modernInputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
        letterSpacing: -0.1,
    },
    modernInput: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        fontWeight: '400',
    },
    chipsContainer: {
        paddingRight: 20,
        gap: 12,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    categoryChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.25,
    },
    chipIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    chipText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
        letterSpacing: -0.1,
    },
    chipTextActive: {
        color: '#ffffff',
        fontWeight: '700',
    },
    // Modern Selector Cards
    selectorCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorCardExpanded: {
        borderColor: Colors.primary,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        shadowColor: Colors.primary,
        shadowOpacity: 0.15,
    },
    selectorText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    selectorArrow: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
    },
    selectorArrowExpanded: {
        color: Colors.primary,
    },
    expandedContent: {
        backgroundColor: '#ffffff',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderTopWidth: 0,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginTop: -2,
        paddingVertical: 8,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    expandedOption: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 2,
    },
    expandedOptionActive: {
        backgroundColor: `${Colors.primary}15`,
    },
    expandedOptionText: {
        fontSize: 15,
        color: '#475569',
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    expandedOptionTextActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    expandedOptionDescription: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '400',
        marginTop: 3,
        letterSpacing: -0.05,
    },
    expandedOptionDescriptionActive: {
        color: `${Colors.primary}cc`,
    },
    customInputContainer: {
        margin: 14,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    dateInputs: {
        flexDirection: 'row',
        gap: 14,
    },
    inputField: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 10,
        letterSpacing: -0.1,
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
        fontSize: 16,
        color: '#334155',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        fontWeight: '500',
    },
    actions: {
        paddingTop: 24,
        paddingBottom: 40,
        gap: 12,
    },
    applyButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    applyButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
    clearButton: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#FF6B6B',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    clearButtonText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '500',
    },
});