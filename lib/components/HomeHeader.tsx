import { Colors } from '@/lib/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';

interface HomeHeaderProps {
    onFilterPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onFilterPress }) => {
    return (
        <LinearGradient
            colors={[Colors.primary, Colors.primary + '90']}
            style={styles.headerSection}
        >
            <SafeAreaView>
                <View style={styles.topHeader}>
                    <Text style={styles.headerTitle}>Events</Text>
                    <Pressable
                        style={styles.filterButton}
                        onPress={onFilterPress}
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
    );
};

const styles = {
    headerSection: {
        paddingBottom: 8,
    },
    topHeader: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        color: Colors.white,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.white + '15',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    filterIconContainer: {
        width: 24,
        height: 18,
        justifyContent: 'space-between' as const,
    },
    filterLine: {
        height: 3,
        backgroundColor: Colors.white,
        borderRadius: 2,
    },
    filterLineMiddle: {
        width: 17, // 70% of 24
        alignSelf: 'flex-end' as const,
    },
};