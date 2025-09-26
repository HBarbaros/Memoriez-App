import EventCard from '@/lib/components/EventCard';
import { Event } from '@/lib/types/event';
import React from 'react';
import { FlatList } from 'react-native';

interface EventsListProps {
    events: Event[];
    scrollHandler: (...args: any[]) => void;
}

export const EventsList: React.FC<EventsListProps> = ({ events, scrollHandler }) => {
    const renderEventItem = ({ item }: { item: Event }) => (
        <EventCard event={item} />
    );

    return (
        <FlatList
            data={events}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
        />
    );
};

const styles = {
    listContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 20,
    },
};