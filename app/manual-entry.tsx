import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    Animated,
    Platform,
    Alert
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define interface for Toast props
interface ToastProps {
    visible: boolean;
    message: string;
    onHide: () => void;
}

// Sample category data - in a real app, this would come from your data store
const defaultCategories = [
    { id: '1', name: 'food', icon: 'cart.fill' },
    { id: '2', name: 'transport', icon: 'car.fill' },
    { id: '3', name: 'shopping', icon: 'bag.fill' },
    { id: '4', name: 'bills', icon: 'doc.text.fill' },
    { id: '5', name: 'entertainment', icon: 'tv.fill' },
    { id: 'new', name: 'add new', icon: 'plus.circle.fill' }
];

const paymentMethods = [
    { id: 'cash', name: 'Cash', icon: 'dollarsign.circle.fill' },
    { id: 'credit', name: 'Credit Card', icon: 'creditcard.fill' },
    { id: 'debit', name: 'Debit Card', icon: 'creditcard.fill' },
    { id: 'venmo', name: 'Venmo', icon: 'v.circle.fill' },
    { id: 'zelle', name: 'Zelle', icon: 'z.circle.fill' },
    { id: 'other', name: 'Other', icon: 'ellipsis.circle.fill' }
];

// Icons for category selection
const categoryIcons = [
    { id: 'cart.fill', name: 'cart.fill' },
    { id: 'car.fill', name: 'car.fill' },
    { id: 'bag.fill', name: 'bag.fill' },
    { id: 'doc.text.fill', name: 'doc.text.fill' },
    { id: 'tv.fill', name: 'tv.fill' },
    { id: 'creditcard.fill', name: 'creditcard.fill' },
    { id: 'house.fill', name: 'house.fill' },
    { id: 'gift.fill', name: 'gift.fill' },
    { id: 'heart.fill', name: 'heart.fill' },
    { id: 'tshirt.fill', name: 'tshirt.fill' },
];

// Toast component for success messages
const Toast: React.FC<ToastProps> = ({ visible, message, onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onHide();
            });
        }
    }, [visible, opacity, onHide]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.toast, { opacity }]}>
            <ThemedText style={styles.toastText}>{message}</ThemedText>
        </Animated.View>
    );
};

export default function ManualEntryScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    // Form state
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('Coffee Shop'); // Default value
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('1'); // Default to first category
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [categories, setCategories] = useState(defaultCategories);

    // UI state
    const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(categoryIcons[0].id);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showPaymentMethodPicker, setShowPaymentMethodPicker] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash'); // Default to Cash

    // Show toast message
    const showToast = (message: any) => {
        setToastMessage(message);
        setToastVisible(true);
    };

    // Format date for display
    const formatDate = (date: any) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    // Handle category selection
    const handleCategorySelect = (categoryId: any) => {
        if (categoryId === 'new') {
            setShowNewCategoryModal(true);
        } else {
            setSelectedCategory(categoryId);
        }
    };

    // Create a new category
    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        const newId = `custom-${Date.now()}`;
        const newCategory = {
            id: newId,
            name: newCategoryName.toLowerCase(),
            icon: selectedIcon
        };

        // Add new category to list (in a real app, you'd save this to storage)
        setCategories(prevCategories => {
            const newCategories = [...prevCategories.filter(c => c.id !== 'new'), newCategory, { id: 'new', name: 'add new', icon: 'plus.circle.fill' }];
            return newCategories;
        });

        // Select the new category
        setSelectedCategory(newId);

        // Reset and close modal
        setNewCategoryName('');
        setShowNewCategoryModal(false);
    };

    // Increment/decrement date
    const changeDate = (days: any) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);

        // Don't allow future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

        const proposedDate = new Date(newDate);
        proposedDate.setHours(0, 0, 0, 0); // Reset time for comparison

        if (proposedDate <= today) {
            setSelectedDate(newDate);
        }
    };

    // Validate form before saving
    const validateForm = () => {
        if (!amount || parseFloat(amount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount (at least $1)');
            return false;
        }
        if (!merchant.trim()) {
            Alert.alert('Error', 'Please enter a merchant name');
            return false;
        }
        if (!selectedCategory) {
            Alert.alert('Error', 'Please select a category');
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        // Find the selected category safely
        const selectedCategoryObj = categories.find(c => c.id === selectedCategory);

        // If category not found (should never happen, but TypeScript wants a check)
        if (!selectedCategoryObj) {
            Alert.alert('Error', 'Selected category not found. Please try again.');
            return;
        }

        // Create expense data with safely accessed properties
        const expenseData = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            merchant,
            note,
            category: selectedCategoryObj.name,
            categoryIcon: selectedCategoryObj.icon,
            paymentMethod: selectedPaymentMethod,
            date: selectedDate,
            type: 'manual'
        };

        console.log('Saving expense:', expenseData);

        // Show success toast
        showToast('Manual expense added!');

        // Pass the expense data back as a stringified param to avoid serialization issues
        setTimeout(() => {
            router.push({
                pathname: '/(tabs)/receipts',
                params: { newExpense: JSON.stringify(expenseData) }
            });
        }, 1500); // Give the toast time to show before going back
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <Toast
                visible={toastVisible}
                message={toastMessage}
                onHide={() => setToastVisible(false)}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <IconSymbol name="xmark" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <ThemedText type="title">Add Expense</ThemedText>
                    <TouchableOpacity onPress={handleSave}>
                        <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>Save</ThemedText>
                    </TouchableOpacity>
                </View>

                <ThemedView style={styles.container}>
                    {/* Amount Input */}
                    <ThemedView style={[styles.inputContainer, { borderColor: colors.border }]}>
                        <View style={styles.currencyContainer}>
                            <ThemedText style={styles.currencySymbol}>$</ThemedText>
                            <TextInput
                                style={[styles.amountInput, { color: colors.text }]}
                                placeholder="0.00"
                                placeholderTextColor={colors.border}
                                keyboardType="decimal-pad"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>
                    </ThemedView>

                    {/* Merchant Input */}
                    <ThemedView style={[styles.textInputContainer, { borderColor: colors.border }]}>
                        <IconSymbol name="storefront" size={20} color={colors.text} />
                        <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            placeholder="Merchant or Payee"
                            placeholderTextColor={colors.border}
                            value={merchant}
                            onChangeText={setMerchant}
                        />
                    </ThemedView>

                    {/* Categories */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedText type="subtitle">Category</ThemedText>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesContainer}
                        >
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={[
                                        styles.categoryItem,
                                        selectedCategory === category.id && {
                                            backgroundColor: colors.primary,
                                            borderColor: colors.primary
                                        },
                                        { borderColor: colors.border }
                                    ]}
                                    onPress={() => handleCategorySelect(category.id)}
                                >
                                    <IconSymbol
                                        name={category.icon}
                                        size={24}
                                        color={selectedCategory === category.id ? '#FFFFFF' : colors.text}
                                    />
                                    <ThemedText
                                        style={[
                                            styles.categoryName,
                                            selectedCategory === category.id && { color: '#FFFFFF' }
                                        ]}
                                    >
                                        {category.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </ThemedView>

                    {/* Payment Method */}
                    <ThemedView style={styles.sectionContainer}>
                        <ThemedText type="subtitle">Payment Method</ThemedText>
                        <ThemedView style={[styles.textInputContainer, { borderColor: colors.border }]}>
                            <IconSymbol name="creditcard.fill" size={20} color={colors.text} />
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowPaymentMethodPicker(!showPaymentMethodPicker)}
                            >
                                <ThemedText>{paymentMethods.find(p => p.id === selectedPaymentMethod)?.name || 'Cash'}</ThemedText>
                                <IconSymbol name="chevron.down" size={16} color={colors.text} />
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>

                    {/* Notes Input */}
                    <ThemedView style={[styles.noteContainer, { borderColor: colors.border }]}>
                        <IconSymbol name="text.bubble" size={20} color={colors.text} />
                        <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            placeholder="Add a note (optional)"
                            placeholderTextColor={colors.border}
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                    </ThemedView>

                    {/* Date Picker Button */}
                    <TouchableOpacity
                        style={[styles.datePickerButton, { borderColor: colors.border }]}
                        onPress={() => setShowDatePicker(!showDatePicker)}
                    >
                        <View style={styles.dateInfo}>
                            <IconSymbol name="calendar" size={20} color={colors.text} />
                            <ThemedText>{formatDate(selectedDate)}</ThemedText>
                        </View>
                        <IconSymbol name={showDatePicker ? "chevron.up" : "chevron.down"} size={16} color={colors.text} />
                    </TouchableOpacity>

                    {/* Date Picker Controls */}
                    {showDatePicker && (
                        <ThemedView style={[styles.datePickerControls, { borderColor: colors.border }]}>
                            <TouchableOpacity onPress={() => changeDate(-1)}>
                                <IconSymbol name="chevron.left" size={24} color={colors.text} />
                            </TouchableOpacity>

                            <ThemedText style={styles.dateText}>
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </ThemedText>

                            <TouchableOpacity
                                onPress={() => changeDate(1)}
                                disabled={selectedDate.toDateString() === new Date().toDateString()}
                            >
                                <IconSymbol
                                    name="chevron.right"
                                    size={24}
                                    color={selectedDate.toDateString() === new Date().toDateString() ? colors.border : colors.text}
                                />
                            </TouchableOpacity>
                        </ThemedView>
                    )}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                    >
                        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>

            {/* New Category Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showNewCategoryModal}
                onRequestClose={() => setShowNewCategoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText type="title" style={{ fontSize: 26 }}>New Category</ThemedText>
                            <TouchableOpacity onPress={() => setShowNewCategoryModal(false)}>
                                <IconSymbol name="xmark" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ThemedView style={[styles.textInputContainer, { borderColor: colors.border }]}>
                            <IconSymbol name="tag" size={20} color={colors.text} />
                            <TextInput
                                style={[styles.textInput, { color: colors.text }]}
                                placeholder="Category Name"
                                placeholderTextColor={colors.border}
                                value={newCategoryName}
                                onChangeText={setNewCategoryName}
                                autoFocus
                            />
                        </ThemedView>

                        <ThemedText style={styles.iconSelectorLabel}>Choose an Icon</ThemedText>
                        <View style={styles.iconSelector}>
                            {categoryIcons.map((icon) => (
                                <TouchableOpacity
                                    key={icon.id}
                                    style={[
                                        styles.iconItem,
                                        selectedIcon === icon.id && {
                                            backgroundColor: colors.primary,
                                        }
                                    ]}
                                    onPress={() => setSelectedIcon(icon.id)}
                                >
                                    <IconSymbol
                                        name={icon.id}
                                        size={24}
                                        color={selectedIcon === icon.id ? '#FFFFFF' : colors.text}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: colors.primary }]}
                            onPress={handleCreateCategory}
                        >
                            <ThemedText style={styles.saveButtonText}>Create Category</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPaymentMethodPicker}
                onRequestClose={() => setShowPaymentMethodPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <ThemedView style={[styles.modalContent, { backgroundColor: colors.background }]}>
                        <View style={styles.modalHeader}>
                            <ThemedText type="title" style={{ fontSize: 26 }}>Select Payment Method</ThemedText>
                            <TouchableOpacity onPress={() => setShowPaymentMethodPicker(false)}>
                                <IconSymbol name="xmark" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.paymentMethodsList}>
                            {paymentMethods.map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.paymentMethodItem,
                                        selectedPaymentMethod === method.id && {
                                            backgroundColor: colors.primary + '10',
                                            borderColor: colors.primary,
                                        },
                                        { borderColor: colors.border }
                                    ]}
                                    onPress={() => {
                                        setSelectedPaymentMethod(method.id);
                                        setShowPaymentMethodPicker(false);
                                    }}
                                >
                                    <IconSymbol
                                        name={method.icon}
                                        size={24}
                                        color={selectedPaymentMethod === method.id ? colors.primary : colors.text}
                                    />
                                    <ThemedText style={[
                                        styles.paymentMethodName,
                                        selectedPaymentMethod === method.id && { color: colors.primary }
                                    ]}>
                                        {method.name}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    container: {
        gap: 24,
    },
    inputContainer: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    currencyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: 'bold',
        marginRight: 8,
        lineHeight: 40,
        textAlignVertical: 'center',
    },
    amountInput: {
        fontSize: 32,
        fontWeight: 'bold',
        flex: 1,
        padding: 0,
        lineHeight: 40,
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    sectionContainer: {
        gap: 12,
    },
    categoriesContainer: {
        gap: 12,
        paddingVertical: 8,
    },
    categoryItem: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 12,
        alignItems: 'center',
        minWidth: 80,
    },
    categoryName: {
        marginTop: 8,
        fontSize: 14,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        gap: 12,
        minHeight: 100,
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    dateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    datePickerControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
    saveButton: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    toast: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    toastText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconSelectorLabel: {
        fontWeight: '600',
        marginBottom: 10,
    },
    iconSelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    iconItem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    paymentMethodsList: {
        gap: 12,
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    paymentMethodName: {
        fontSize: 16,
        flex: 1,
    },
});