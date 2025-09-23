
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';
import { Event } from '../types/event';

interface EventCardProps {
    event: Event;
    onPress: () => void;
}

// EventCard component for displaying event info
const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5); // Remove seconds from HH:MM:SS
    };

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Image
                source={{ uri: event.imageUrl || 'https://via.placeholder.com/300x200' }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title} numberOfLines={2}>
                        {event.title}
                    </Text>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
                        <Text style={styles.categoryText}>{event.category}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {event.description}
                </Text>

                <View style={styles.details}>
                    <Text style={styles.date}>
                        📅 {formatDate(event.date)} • {formatTime(event.startTime)}
                    </Text>
                    <Text style={styles.location}>
                        📍 {event.location.name}
                    </Text>
                    {event.price && (
                        <Text style={styles.price}>
                            💰 ${event.price}
                        </Text>
                    )}
                </View>

                <View style={styles.footer}>
                    <Text style={styles.attendees}>
                        {event.attendeeCount} attending
                    </Text>
                    <Text style={styles.organizer}>
                        by {event.organizer}
                    </Text>
                </View>
            </View>
        </Pressable>
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        flex: 1,
        marginRight: 8,
    },
    categoryBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    details: {
        marginBottom: 12,
    },
    date: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    attendees: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    organizer: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
});

export default EventCard;