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
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

export default function PaymentScreen() {
    const cartItems = useAtomValue(cartItemsAtom);
    const removeCartItem = useSetAtom(removeFromCartAtom);
    const markAsPaid = useSetAtom(markAsPaidAtom);

    const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    // Payment form states
    const [paymentForm, setPaymentForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        address: '',
        city: '',
        zipCode: ''
    });

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

        // Show payment form instead of direct payment
        setShowPaymentForm(true);
    };

    const handlePaymentSubmit = () => {
        // Validate form
        if (!paymentForm.firstName || !paymentForm.lastName || !paymentForm.email ||
            !paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
            Alert.alert('Missing Information', 'Please fill in all required fields.');
            return;
        }

        // Process payment
        Alert.alert('Payment Successful!', 'Your payment has been processed.');
        markAsPaid(selectedEvents);
        setSelectedEvents([]);
        setShowPaymentForm(false);

        // Reset form
        setPaymentForm({
            firstName: '',
            lastName: '',
            email: '',
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            address: '',
            city: '',
            zipCode: ''
        });
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

            {/* Payment Form Modal */}
            <Modal
                visible={showPaymentForm}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowPaymentForm(false)}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Payment Information</Text>
                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setShowPaymentForm(false)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </Pressable>
                        </View>

                        <ScrollView
                            style={styles.formContainer}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            keyboardDismissMode="on-drag"
                            contentContainerStyle={styles.formContentContainer}
                        >
                            {/* Personal Information */}
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>Personal Information</Text>

                                <View style={styles.inputRow}>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>First Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.firstName}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, firstName: text })}
                                            placeholder="John"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>Last Name *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.lastName}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, lastName: text })}
                                            placeholder="Doe"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>Email *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={paymentForm.email}
                                        onChangeText={(text) => setPaymentForm({ ...paymentForm, email: text })}
                                        placeholder="john.doe@email.com"
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            {/* Payment Information */}
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>Payment Information</Text>

                                <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>Card Number *</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={paymentForm.cardNumber}
                                        onChangeText={(text) => setPaymentForm({ ...paymentForm, cardNumber: text })}
                                        placeholder="1234 5678 9012 3456"
                                        keyboardType="numeric"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                </View>

                                <View style={styles.inputRow}>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>Expiry Date *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.expiryDate}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, expiryDate: text })}
                                            placeholder="MM/YY"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>CVV *</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.cvv}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, cvv: text })}
                                            placeholder="123"
                                            keyboardType="numeric"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Billing Address */}
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>Billing Address</Text>

                                <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>Address</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={paymentForm.address}
                                        onChangeText={(text) => setPaymentForm({ ...paymentForm, address: text })}
                                        placeholder="123 Main Street"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                    />
                                </View>

                                <View style={styles.inputRow}>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>City</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.city}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, city: text })}
                                            placeholder="Stockholm"
                                            returnKeyType="next"
                                            blurOnSubmit={false}
                                        />
                                    </View>
                                    <View style={styles.inputField}>
                                        <Text style={styles.inputLabel}>Zip Code</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={paymentForm.zipCode}
                                            onChangeText={(text) => setPaymentForm({ ...paymentForm, zipCode: text })}
                                            placeholder="12345"
                                            keyboardType="numeric"
                                            returnKeyType="done"
                                            onSubmitEditing={Keyboard.dismiss}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Order Summary */}
                            <View style={styles.formSection}>
                                <Text style={styles.sectionTitle}>Order Summary</Text>
                                <View style={styles.summaryCard}>
                                    <Text style={styles.summaryText}>
                                        {selectedEvents.length} event(s) selected
                                    </Text>
                                    <Text style={styles.summaryAmountModal}>
                                        Total: ${totalAmount}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <Pressable style={styles.cancelButton} onPress={() => setShowPaymentForm(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.submitButton} onPress={handlePaymentSubmit}>
                                <Text style={styles.submitButtonText}>Complete Payment</Text>
                            </Pressable>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </Modal>
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
    // Payment Form Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.textSecondary,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    formContentContainer: {
        paddingBottom: 20,
    },
    formSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    inputField: {
        flex: 1,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 16,
        color: Colors.text,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    summaryCard: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    summaryText: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    summaryAmountModal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    modalActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.textSecondary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: '500',
    },
    submitButton: {
        flex: 2,
        backgroundColor: Colors.primary,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '500',
    },
});