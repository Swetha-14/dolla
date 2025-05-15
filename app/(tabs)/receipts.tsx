import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Expense {
    id: string;
    amount: number;
    merchant: string;
    note: string;
    category: string;
    categoryIcon: string;
    paymentMethod?: string; // Add this line
    date: Date | string;
    type: string;
}

export default function AddExpenseScreen() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        loadExpenses();
    }, []);

    // Load expenses from storage
    const loadExpenses = async () => {
        try {
            const storedExpenses = await AsyncStorage.getItem('expenses');
            if (storedExpenses) {
                const parsedExpenses = JSON.parse(storedExpenses);
                setExpenses(parsedExpenses);
                return parsedExpenses;
            }
            return [];
        } catch (error) {
            console.error('Error loading expenses:', error);
            return [];
        }
    };

    // Save expenses to storage
    const saveExpenses = async (expensesToSave: Expense[]) => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(expensesToSave));
        } catch (error) {
            console.error('Error saving expenses:', error);
        }
    };

    // Handle new expense data from params
    useEffect(() => {
        if (params.newExpense) {
            try {
                const expenseData = typeof params.newExpense === 'string'
                    ? JSON.parse(params.newExpense)
                    : params.newExpense;

                // Load existing expenses first
                loadExpenses().then((existingExpenses) => {
                    // Check for duplicates
                    const isDuplicate = existingExpenses.some((exp: { id: any; }) => exp.id === expenseData.id);
                    if (!isDuplicate) {
                        const updatedExpenses = [expenseData, ...existingExpenses];
                        setExpenses(updatedExpenses);
                        saveExpenses(updatedExpenses); // Save to storage
                    }
                });
            } catch (error) {
                console.error('Error processing expense data:', error);
            }
        }
    }, [params.newExpense]);

    const openSimpleCamera = () => {
        router.push('/simple-camera');
    };

    const openManualEntry = () => {
        router.push('/manual-entry');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">Add Expense</ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.cardsContainer}>
                        {/* Scan Receipt Card */}
                        <TouchableOpacity
                            style={[styles.card, { borderColor: colors.border }]}
                            onPress={openSimpleCamera}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                                <IconSymbol name="camera.fill" size={32} color="#FFFFFF" />
                            </View>
                            <ThemedText style={styles.cardTitle}>Scan Receipt</ThemedText>
                            <ThemedText style={styles.cardDescription}>
                                Take a photo to auto-track expenses
                            </ThemedText>
                        </TouchableOpacity>

                        {/* Manual Entry Card */}
                        <TouchableOpacity
                            style={[styles.card, { borderColor: colors.border }]}
                            onPress={openManualEntry}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
                                <IconSymbol name="pencil" size={32} color="#FFFFFF" />
                            </View>
                            <ThemedText style={styles.cardTitle}>Manual Entry</ThemedText>
                            <ThemedText style={styles.cardDescription}>
                                Enter expense details manually
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView>
                        <ThemedText type="subtitle">Recent Expenses</ThemedText>

                        {expenses.length > 0 ? (
                            <View style={styles.expensesList}>
                                {expenses.map((expense) => (
                                    <ThemedView
                                        key={expense.id}
                                        style={[styles.expenseItem, { borderColor: colors.border }]}
                                    >
                                        <View style={styles.expenseLeft}>
                                            <View style={[styles.categoryIconContainer, { backgroundColor: colors.primary + '15' }]}>
                                                <IconSymbol name={expense.categoryIcon} size={24} color={colors.primary} />
                                            </View>
                                            <View style={styles.expenseInfo}>
                                                <ThemedText style={[styles.merchantName, { color: colors.text }]}>
                                                    {expense.merchant}
                                                </ThemedText>
                                                <ThemedText style={styles.expenseDate}>
                                                    {new Date(expense.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </ThemedText>
                                            </View>
                                        </View>
                                        <View style={styles.expenseRight}>
                                            <ThemedText style={[styles.expenseAmount, { color: colors.text }]}>
                                                ${expense.amount.toFixed(2)}
                                            </ThemedText>
                                            <View style={[styles.typeBadge, {
                                                backgroundColor: expense.type === 'manual' ? colors.secondary + '15' : colors.primary + '15'
                                            }]}>
                                                <ThemedText style={[styles.typeBadgeText, {
                                                    color: expense.type === 'manual' ? colors.secondary : colors.primary
                                                }]}>
                                                    {expense.type}
                                                </ThemedText>
                                            </View>
                                        </View>
                                    </ThemedView>
                                ))}
                            </View>
                        ) : (
                            <ThemedView style={[styles.emptyState, { borderColor: colors.border }]}>
                                <IconSymbol
                                    name="doc.text.magnifyingglass"
                                    size={48}
                                    color={colors.border}
                                />
                                <ThemedText style={styles.emptyStateText}>
                                    Your recent expenses will appear here
                                </ThemedText>
                            </ThemedView>
                        )}
                    </ThemedView>
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
    container: {
        gap: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    cardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.7,
    },
    emptyState: {
        marginTop: 16,
        padding: 32,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    emptyStateText: {
        opacity: 0.6,
        textAlign: 'center',
    },
    expensesList: {
        marginTop: 12,
        gap: 8,
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    categoryIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    merchantName: {
        fontWeight: '600',
        fontSize: 16
    },
    expenseAmount: {
        fontWeight: '700',
        fontSize: 18,
    },
    expenseInfo: {
        flex: 1,
        gap: 4,
    },
    expenseDate: {
        fontSize: 14,
        opacity: 0.6,
    },
    expenseRight: {
        alignItems: 'flex-end',
        gap: 4,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});