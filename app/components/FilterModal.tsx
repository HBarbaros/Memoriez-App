import { Colors } from '@/app/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

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
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                {/* Modal Header */}
                <LinearGradient
                    colors={[Colors.primary, Colors.primary + '90']}
                    style={styles.modalHeader}
                >
                    <SafeAreaView>
                        <View style={styles.modalHeaderContent}>
                            <Text style={styles.modalTitle}>Filter Events</Text>
                            <Pressable style={styles.closeButton} onPress={onClose}>
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
                                    onPress={() => onLocationFilterChange(option.key)}
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
                                        onPress={() => onDistanceRadiusChange(distance)}
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
                                    onPress={() => onSortByChange(option.key)}
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
                        <Pressable style={styles.applyButton} onPress={onClose}>
                            <LinearGradient
                                colors={[Colors.primary, Colors.primary + 'CC']}
                                style={styles.applyButtonGradient}
                            >
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </LinearGradient>
                        </Pressable>

                        <Pressable style={styles.clearButton} onPress={onClearFilters}>
                            <Text style={styles.clearButtonText}>Clear All Filters</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = {
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        paddingBottom: 20,
    },
    modalHeaderContent: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: Colors.white,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.white + '20',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold' as const,
        color: Colors.white,
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
        fontWeight: '700' as const,
        color: Colors.text,
        marginBottom: 16,
    },
    filterGrid: {
        gap: 12,
    },
    filterCard: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
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
        fontWeight: '500' as const,
        flex: 1,
    },
    filterCardTextActive: {
        color: Colors.primary,
        fontWeight: '600' as const,
    },
    radiusContainer: {
        flexDirection: 'row' as const,
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
        alignItems: 'center' as const,
    },
    radiusButtonActive: {
        backgroundColor: Colors.primary + '10',
        borderColor: Colors.primary,
    },
    radiusButtonText: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600' as const,
    },
    radiusButtonTextActive: {
        color: Colors.primary,
    },
    sortGrid: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: 12,
    },
    sortCard: {
        width: (width - 64) / 2,
        alignItems: 'center' as const,
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
        fontWeight: '500' as const,
        textAlign: 'center' as const,
    },
    sortCardTextActive: {
        color: Colors.primary,
        fontWeight: '600' as const,
    },
    modalActions: {
        paddingTop: 20,
        paddingBottom: 40,
        gap: 16,
    },
    applyButton: {
        borderRadius: 16,
        overflow: 'hidden' as const,
    },
    applyButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center' as const,
    },
    applyButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: '700' as const,
    },
    clearButton: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center' as const,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    clearButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: '600' as const,
    },
};