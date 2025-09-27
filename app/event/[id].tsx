import { addToCartAtom } from '@/app/store/paymentStore';
import { Colors } from '@/lib/constants/colors';
import { mockEvents } from '@/lib/data/mockEvents';
import { Event } from '@/lib/types/event';
import { router, useLocalSearchParams } from 'expo-router';
import { useSetAtom } from 'jotai';
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

    const handleRSVP = () => {
        if (!event.price) {
            Alert.alert('Success!', 'You have been added to the attendee list for this free event.');
            return;
        }

        Alert.alert(
            'RSVP Confirmation',
            `"${event.title}" costs $${event.price}. How would you like to proceed?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => {
                        Alert.alert('Payment Successful!', 'Your payment has been processed and you\'re registered for the event.');
                    }
                },
                {
                    text: 'Pay Later',
                    onPress: () => {
                        addToCart(event.id);
                        Alert.alert(
                            'Added to Payment Queue',
                            'Event has been added to your payment list. You can pay later from the Payment tab.',
                            [
                                { text: 'OK', style: 'default' },
                                {
                                    text: 'Go to Payment',
                                    onPress: () => router.push('/(tabs)/payment')
                                }
                            ]
                        );
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
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x300' }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    <Pressable style={styles.backButtonOverlay} onPress={() => router.back()}>
                        <Text style={styles.backIcon}>←</Text>
                    </Pressable>

                    <View style={[styles.categoryBadgeOverlay, { backgroundColor: getCategoryColor(event.category) }]}>
                        <Text style={styles.categoryBadgeText}>{event.category}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{event.title}</Text>
                        <Text style={styles.organizer}>Organized by {event.organizer}</Text>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📅</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Date & Time</Text>
                                <Text style={styles.infoValue}>
                                    {formatDate(event.date)}
                                </Text>
                                <Text style={styles.infoSubValue}>
                                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📍</Text>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Location</Text>
                                <Text style={styles.infoValue}>{event.location.name}</Text>
                                <Text style={styles.infoSubValue}>{event.location.address}</Text>
                            </View>
                        </View>
                    </View>

                    {event.price && (
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>💰</Text>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Price</Text>
                                    <Text style={styles.priceValue}>${event.price}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>About This Event</Text>
                        <Text style={styles.description}>{event.description}</Text>
                    </View>

                    <View style={styles.attendeesSection}>
                        <Text style={styles.sectionTitle}>Attendees</Text>
                        <View style={styles.attendeesInfo}>
                            <Text style={styles.attendeesCount}>
                                {event.attendeeCount} people attending
                            </Text>
                            {event.maxAttendees && (
                                <Text style={styles.attendeesMax}>
                                    {event.maxAttendees - event.attendeeCount} spots left
                                </Text>
                            )}
                        </View>
                    </View>

                    {event.tags && event.tags.length > 0 && (
                        <View style={styles.tagsSection}>
                            <Text style={styles.sectionTitle}>Tags</Text>
                            <View style={styles.tagsContainer}>
                                {event.tags.map((tag, index) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>#{tag}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.buttonSection}>
                        <Pressable style={styles.rsvpButton} onPress={handleRSVP}>
                            <Text style={styles.rsvpButtonText}>RSVP - I'll Attend</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backButtonText: {
        color: Colors.white,
        fontWeight: '600',
    },
    imageContainer: {
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 300,
    },
    backButtonOverlay: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        color: Colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    categoryBadgeOverlay: {
        position: 'absolute',
        top: 50,
        right: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    categoryBadgeText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    titleSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    organizer: {
        fontSize: 16,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        fontSize: 20,
        marginRight: 12,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    infoSubValue: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    descriptionSection: {
        marginTop: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
    },
    attendeesSection: {
        marginBottom: 24,
    },
    attendeesInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    attendeesCount: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    attendeesMax: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '500',
    },
    tagsSection: {
        marginBottom: 24,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: Colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tagText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    buttonSection: {
        marginTop: 32,
        marginBottom: 32,
    },
    rsvpButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    rsvpButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});