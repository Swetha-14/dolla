import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Sample transaction data - would come from API or state in real app
const transactions = [
    {
        id: '1',
        merchant: 'Grocery Store',
        date: '2025-04-28',
        amount: -82.45,
        category: 'Food',
        icon: 'cart.fill',
    },
    {
        id: '2',
        merchant: 'Coffee Shop',
        date: '2025-04-27',
        amount: -4.95,
        category: 'Food',
        icon: 'cup.and.saucer.fill',
    },
    {
        id: '3',
        merchant: 'Gas Station',
        date: '2025-04-27',
        amount: -45.30,
        category: 'Transportation',
        icon: 'fuelpump.fill',
    },
    {
        id: '4',
        merchant: 'Salary',
        date: '2025-04-25',
        amount: 2750.00,
        category: 'Income',
        icon: 'dollarsign.square.fill',
    },
];

export function RecentTransactions() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const renderTransaction = ({ item }: { item: typeof transactions[0] }) => {
        const isIncome = item.amount > 0;
        const amountColor = isIncome ? colors.incomeGreen : colors.expenseRed;
        const amountPrefix = isIncome ? '+' : '';


        return (
            <ThemedView style={[styles.transactionItem, { borderColor: colors.border }]}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
                    <IconSymbol name={item.icon} size={20} color="#FFFFFF" />
                </View>

                <View style={styles.transactionDetails}>
                    <ThemedText type="defaultSemiBold">{item.merchant}</ThemedText>
                    <ThemedText style={styles.categoryText}>{item.category} • {formatDate(item.date)}</ThemedText>
                </View>

                <ThemedText style={[styles.amount, { color: amountColor }]}>
                    {amountPrefix}${Math.abs(item.amount).toFixed(2)}
                </ThemedText>
            </ThemedView>
        );
    };

    return (
        <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        gap: 8,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
        gap: 2,
    },
    categoryText: {
        fontSize: 14,
        opacity: 0.7,
    },
    amount: {
        fontWeight: '600',
        fontSize: 16,
    },
});