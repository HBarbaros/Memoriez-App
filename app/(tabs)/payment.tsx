import {
    cartItemsAtom,
    markAsPaidAtom,
    removeFromCartAtom
} from '@/app/store/paymentStore';
import { Colors } from '@/lib/constants/colors';
import { mockEvents } from '@/lib/data/mockEvents';
import { Event } from '@/lib/types/event';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function PaymentScreen() {
    const cartItems = useAtomValue(cartItemsAtom);
    const removeCartItem = useSetAtom(removeFromCartAtom);
    const markAsPaid = useSetAtom(markAsPaidAtom);

    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

    const getCartEventsWithDetails = () => {
        return cartItems.map(cartItem => {
            const event = mockEvents.find(e => e.id === cartItem.eventId);
            return event ? { ...event, addedDate: cartItem.addedDate, quantity: cartItem.quantity } : null;
        }).filter(Boolean) as (Event & { addedDate: string; quantity: number })[];
    };

    const cartEventsWithDetails = getCartEventsWithDetails();

    const totalAmount = selectedEvents.reduce((total, eventId) => {
        const event = cartEventsWithDetails.find(e => e.id === eventId);
        return total + ((event?.price || 0) * (event?.quantity || 1));
    }, 0);

    const toggleEventSelection = (eventId: string) => {
        setSelectedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const removeFromCart = (eventId: string) => {
        Alert.alert(
            'Remove Event',
            'Are you sure you want to remove this event from your payment list?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        removeCartItem(eventId);
                        setSelectedEvents(prev => prev.filter(id => id !== eventId));
                    }
                }
            ]
        );
    };

    const processPayment = () => {
        if (selectedEvents.length === 0) {
            Alert.alert('No Events Selected', 'Please select events to pay for.');
            return;
        }

        Alert.alert(
            'Confirm Payment',
            `Pay $${totalAmount} for ${selectedEvents.length} event(s)?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay Now',
                    onPress: () => {
                        Alert.alert('Payment Successful!', 'Your payment has been processed.');
                        markAsPaid(selectedEvents);
                        setSelectedEvents([]);
                    }
                }
            ]
        );
    };

    const renderCartItem = ({ item }: { item: Event & { addedDate: string; quantity: number } }) => {
        const isSelected = selectedEvents.includes(item.id);

        return (
            <View style={styles.cartItem}>
                <Pressable
                    style={styles.cartItemContent}
                    onPress={() => toggleEventSelection(item.id)}
                >
                    <View style={styles.checkbox}>
                        {isSelected && <View style={styles.checkboxChecked} />}
                    </View>

                    <Image
                        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80x60' }}
                        style={styles.eventImage}
                    />

                    <View style={styles.eventInfo}>
                        <Text style={styles.eventTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                        <Text style={styles.eventDate}>
                            {new Date(item.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.eventPrice}>
                                ${item.price || 0} × {item.quantity}
                            </Text>
                            <Text style={styles.totalPrice}>
                                = ${((item.price || 0) * item.quantity)}
                            </Text>
                        </View>
                        <Text style={styles.addedDate}>
                            Added: {new Date(item.addedDate).toLocaleDateString()}
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Payment</Text>
                <Text style={styles.subtitle}>Events waiting for payment</Text>
            </View>

            {cartEventsWithDetails.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyIcon}>💳</Text>
                    <Text style={styles.emptyTitle}>No Pending Payments</Text>
                    <Text style={styles.emptyMessage}>
                        When you RSVP to paid events, they'll appear here for payment.
                    </Text>
                </View>
            ) : (
                <>

                    <FlatList
                        data={cartEventsWithDetails}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.paymentSummary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Selected Events: {selectedEvents.length}
                            </Text>
                            <Text style={styles.summaryAmount}>
                                ${totalAmount}
                            </Text>
                        </View>

                        <Pressable
                            style={[
                                styles.payButton,
                                selectedEvents.length === 0 && styles.payButtonDisabled
                            ]}
                            onPress={processPayment}
                            disabled={selectedEvents.length === 0}
                        >
                            <Text style={[
                                styles.payButtonText,
                                selectedEvents.length === 0 && styles.payButtonTextDisabled
                            ]}>
                                Pay ${totalAmount}
                            </Text>
                        </Pressable>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    cartItem: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartItemContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    eventImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    eventInfo: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    eventPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginRight: 8,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    addedDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
    removeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    removeButtonText: {
        fontSize: 20,
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    paymentSummary: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.white,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    summaryAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    payButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    payButtonDisabled: {
        backgroundColor: Colors.gray[300],
    },
    payButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    payButtonTextDisabled: {
        color: Colors.gray[500],
    },
});