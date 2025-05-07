import React, { useState } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Sample category data
const categories = [
    { id: '1', name: 'Food', icon: 'cart.fill' },
    { id: '2', name: 'Transport', icon: 'car.fill' },
    { id: '3', name: 'Shopping', icon: 'bag.fill' },
    { id: '4', name: 'Bills', icon: 'doc.text.fill' },
    { id: '5', name: 'Add New', icon: 'plus.circle.fill' }
];

export default function ManualEntryScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleSave = () => {
        // Save the expense data
        console.log({ amount, merchant, note, category: selectedCategory });

        // Return to previous screen
        router.back();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
                                    onPress={() => setSelectedCategory(category.id)}
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

                    {/* Notes Input */}
                    <ThemedView style={[styles.noteContainer, { borderColor: colors.border }]}>
                        <IconSymbol name="text.bubble" size={20} color={colors.text} />
                        <TextInput
                            style={[styles.textInput, { color: colors.text }]}
                            placeholder="Add a note"
                            placeholderTextColor={colors.border}
                            value={note}
                            onChangeText={setNote}
                            multiline
                        />
                    </ThemedView>

                    {/* Date Picker - simplified for this example */}
                    <TouchableOpacity style={[styles.datePickerButton, { borderColor: colors.border }]}>
                        <View style={styles.dateInfo}>
                            <IconSymbol name="calendar" size={20} color={colors.text} />
                            <ThemedText>Today</ThemedText>
                        </View>
                        <IconSymbol name="chevron.right" size={16} color={colors.text} />
                    </TouchableOpacity>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                    >
                        <ThemedText style={styles.saveButtonText}>Save Expense</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </ScrollView>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginRight: 8,
    },
    amountInput: {
        fontSize: 32,
        fontWeight: 'bold',
        flex: 1,
        padding: 0,
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
});