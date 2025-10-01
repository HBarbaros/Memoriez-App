
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Category } from '../types/event';

interface CategoryChipsProps {
    categories: Category[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
    categories,
    selectedCategory,
    onCategorySelect
}) => {
    const handleCategoryPress = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            onCategorySelect('');
        } else {
            onCategorySelect(categoryName);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                <Pressable
                    style={[
                        styles.chip,
                        selectedCategory === '' && styles.selectedChip
                    ]}
                    onPress={() => onCategorySelect('')}
                >
                    <Text style={[
                        styles.chipText,
                        selectedCategory === '' && styles.selectedChipText
                    ]}>
                        All
                    </Text>
                </Pressable>

                {categories.map((category) => {
                    const isSelected = selectedCategory === category.name;
                    return (
                        <Pressable
                            key={category.id}
                            style={[
                                styles.chip,
                                isSelected && styles.selectedChip,
                                isSelected && { backgroundColor: category.color }
                            ]}
                            onPress={() => handleCategoryPress(category.name)}
                        >
                            <Text style={styles.chipIcon}>{category.icon}</Text>
                            <Text style={[
                                styles.chipText,
                                isSelected && styles.selectedChipText
                            ]}>
                                {category.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
    },
    scrollContainer: {
        paddingHorizontal: 20,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    selectedChip: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    chipText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.text,
    },
    selectedChipText: {
        color: Colors.white,
    },
});

export default CategoryChips;