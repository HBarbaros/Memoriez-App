import { addToCartAtom } from '@/app/store/paymentStore';
import { IconSymbol } from '@/lib/components/ui/icon-symbol';
import { Colors } from '@/lib/constants/colors';
import { Colors as ThemeColors } from '@/lib/constants/theme';
import { mockEvents } from '@/lib/data/mockEvents';
import { useColorScheme } from '@/lib/hooks/use-color-scheme';
import { Event } from '@/lib/types/event';
import { router, useLocalSearchParams } from 'expo-router';
import { useSetAtom } from 'jotai';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const addToCart = useSetAtom(addToCartAtom);
    const colorScheme = useColorScheme();
    const [imageError, setImageError] = useState(false);

    const event: Event | undefined = mockEvents.find(e => e.id === id);

    if (!event) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Event not found</Text>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    };

    const [quantity, setQuantity] = React.useState(1);

    const handleQuantityDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityIncrease = () => {
        setQuantity(quantity + 1);
    };

    const handlePurchase = () => {
        // Add to cart and navigate to payment
        addToCart({ eventId: event.id, quantity });
        setQuantity(1); // Reset quantity

        Alert.alert(
            'Added to Payment',
            `${quantity} ticket(s) added to payment queue. Redirecting to payment page...`,
            [
                {
                    text: 'Go to Payment',
                    onPress: () => {
                        router.push('/(tabs)/payment');
                    }
                }
            ]
        );
    };

    const getCategoryColor = (category: string): string => {
        const categoryColors: { [key: string]: string } = {
            'Music': Colors.categories.music,
            'Party': Colors.categories.party,
            'Conference': Colors.categories.conference,
            'Sports': Colors.categories.sports,
            'Food': Colors.categories.food,
            'Culture': Colors.categories.culture,
        };
        return categoryColors[category] || Colors.primary;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Compact Header */}
                <View style={styles.headerContainer}>
                    <Pressable style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>
                    <Text style={styles.headerTitle}>Event Details</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Event Image Card */}
                    <View style={styles.imageCard}>
                        <Image
                            source={{ uri: imageError ? 'https://picsum.photos/400/200' : (event.imageUrl || 'https://picsum.photos/400/200') }}
                            style={styles.cardImage}
                            resizeMode="cover"
                            onError={() => setImageError(true)}
                        />
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                            <Text style={styles.categoryBadgeText}>{event.category}</Text>
                        </View>
                    </View>
                    {/* Event Title and Basic Info */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{event.title}</Text>
                        <Text style={styles.organizer}>{event.organizer}</Text>
                        <Text style={styles.date}>{formatDate(event.date)}</Text>
                    </View>

                    {/* Price Display */}
                    {event.price && (
                        <View style={styles.priceSection}>
                            <Text style={styles.priceValue}>${event.price}</Text>
                        </View>
                    )}



                    {/* Event Details Cards */}
                    <View style={styles.detailsSection}>
                        {/* Age restriction - only show if exists */}
                        {event.ageRestriction && (
                            <View style={styles.detailCard}>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Age Restriction</Text>
                                    <Text style={styles.detailValue}>{event.ageRestriction}</Text>
                                </View>
                            </View>
                        )}

                        {/* Price info */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Price</Text>
                                <Text style={styles.detailValue}>
                                    {event.price ? `$${event.price}` : 'Free Entry'}
                                </Text>
                            </View>
                        </View>

                        {/* Location */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Venue</Text>
                                <Text style={styles.detailValue}>{event.location.name}</Text>
                                <Text style={styles.detailSubValue}>{event.location.address}</Text>
                            </View>
                        </View>

                        {/* Date and Time */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Date & Time</Text>
                                <Text style={styles.detailValue}>{formatDate(event.date)}</Text>
                                <Text style={styles.detailSubValue}>
                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </Text>
                            </View>
                        </View>

                        {/* Organizer */}
                        <View style={styles.detailCard}>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Organizer</Text>
                                <Text style={styles.detailValue}>{event.organizer}</Text>
                            </View>
                        </View>

                        {/* Description if exists */}
                        {event.description && (
                            <View style={styles.descriptionCard}>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>About This Event</Text>
                                    <Text style={styles.descriptionText}>{event.description}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Bottom Action Section - Quantity + Buttons */}
                    <View style={styles.bottomActionSection}>
                        {/* Quantity Selector */}
                        <View style={styles.quantitySelector}>
                            <Pressable style={styles.quantityButton} onPress={handleQuantityDecrease}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </Pressable>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <Pressable style={styles.quantityButton} onPress={handleQuantityIncrease}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </Pressable>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <Pressable style={styles.addButton} onPress={() => {
                                addToCart({ eventId: event.id, quantity });
                                Alert.alert('Added!', `${quantity} ticket(s) added to cart.`);
                                setQuantity(1); // Reset quantity to 1 after adding
                            }}>
                                <Text style={styles.addButtonText}>ADD</Text>
                            </Pressable>

                            {event.price && (
                                <Pressable style={styles.buyButton} onPress={handlePurchase}>
                                    <Text style={styles.buyButtonText}>
                                        BUY - ${event.price * quantity}
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Tab Navigation - Same icons as Home/Settings */}
            <View style={[styles.tabBar, { backgroundColor: ThemeColors[colorScheme ?? 'light'].background }]}>
                <Pressable style={styles.tabItem} onPress={() => router.push('/(tabs)')}>
                    <IconSymbol
                        name="house.fill"
                        size={28}
                        color={ThemeColors[colorScheme ?? 'light'].tabIconDefault}
                    />
                    <Text style={[styles.tabText, { color: ThemeColors[colorScheme ?? 'light'].tabIconDefault }]}>
                        Home
                    </Text>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/(tabs)/payment')}>
                    <IconSymbol
                        name="creditcard.fill"
                        size={28}
                        color={ThemeColors[colorScheme ?? 'light'].tabIconDefault}
                    />
                    <Text style={[styles.tabText, { color: ThemeColors[colorScheme ?? 'light'].tabIconDefault }]}>
                        Payment
                    </Text>
                </Pressable>
                <Pressable style={styles.tabItem} onPress={() => router.push('/(tabs)/explore')}>
                    <IconSymbol
                        name="gearshape.fill"
                        size={28}
                        color={ThemeColors[colorScheme ?? 'light'].tabIconDefault}
                    />
                    <Text style={[styles.tabText, { color: ThemeColors[colorScheme ?? 'light'].tabIconDefault }]}>
                        Settings
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: Colors.text,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.white + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: Colors.white,
        fontWeight: '600',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: Colors.primary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.white,
    },
    headerSpacer: {
        width: 40,
    },
    backIcon: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 0,
        marginBottom: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    cardImage: {
        width: '100%',
        height: 160, // Smaller inside card
        borderRadius: 12,
    },
    categoryBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryBadgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
        paddingTop: 20,
        paddingBottom: 100, // Extra space for tab bar
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 5,
    },
    organizer: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    // Price Section
    priceSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    priceValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: Colors.text,
    },
    // Bottom Action Section
    bottomActionSection: {
        marginTop: 25,
        marginBottom: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
    },
    quantityText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginHorizontal: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    addButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.primary,
    },
    buyButton: {
        flex: 2,
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
    buyButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.white,
    },
    // Details Section - Modern Card Style matching Settings
    detailsSection: {
        marginTop: 10,
    },
    detailCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 2,
    },
    detailSubValue: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    descriptionCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 2,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.text,
    },


    // Tab Navigation Styles - Exactly matching native tab bar
    tabBar: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopWidth: 0.5,
        borderTopColor: 'rgba(0, 0, 0, 0.3)',
        paddingBottom: 34,
        paddingTop: 5,
        height: 83,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 7,
        paddingBottom: 5,
    },
    tabText: {
        fontSize: 10,
        fontWeight: '500',
        marginTop: 1,
        textAlign: 'center',
    },
});