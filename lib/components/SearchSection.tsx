import CategoryChips from '@/lib/components/CategoryChips';
import { Colors } from '@/lib/constants/colors';
import React from 'react';
import { Animated, Text, TextInput, View } from 'react-native';

interface SearchSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: any[];
    searchSectionHeight: Animated.AnimatedInterpolation<string | number>;
    searchSectionOpacity: Animated.AnimatedInterpolation<string | number>;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    searchSectionHeight,
    searchSectionOpacity,
}) => {
    return (
        <Animated.View
            style={[
                styles.scrollableSection,
                {
                    height: searchSectionHeight,
                    opacity: searchSectionOpacity,
                }
            ]}
        >

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


            <CategoryChips
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
            />
        </Animated.View>
    );
};

const styles = {
    scrollableSection: {
        backgroundColor: Colors.surface,
        paddingVertical: 12,
        overflow: 'hidden' as const,
    },
    searchContainer: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
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
        fontWeight: '500' as const,
    },
};