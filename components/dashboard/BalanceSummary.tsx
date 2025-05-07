import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function BalanceSummary() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    // This would come from your actual data in the real app
    const totalBalance = 3520.75;
    const inflow = 2750.00;
    const outflow = 1230.25;

    return (
        <ThemedView style={[styles.container, { borderColor: colors.border }]}>
            <ThemedText type="subtitle">Total Balance</ThemedText>
            <ThemedText style={styles.balanceText}>${totalBalance.toFixed(2)}</ThemedText>

            <View style={styles.flowContainer}>
                <ThemedView style={styles.flowItem}>
                    <View style={styles.iconContainer}>
                        <IconSymbol
                            name="arrow.down"
                            size={16}
                            color={colors.success}
                        />
                    </View>
                    <ThemedText type="defaultSemiBold" style={{ color: colors.success }}>
                        ${inflow.toFixed(2)}
                    </ThemedText>
                    <ThemedText>Income</ThemedText>
                </ThemedView>

                <ThemedView style={styles.flowItem}>
                    <View style={styles.iconContainer}>
                        <IconSymbol
                            name="arrow.up"
                            size={16}
                            color={colors.error}
                        />
                    </View>
                    <ThemedText type="defaultSemiBold" style={{ color: colors.error }}>
                        ${outflow.toFixed(2)}
                    </ThemedText>
                    <ThemedText>Spending</ThemedText>
                </ThemedView>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
        width: '100%',
    },
    balanceText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,

    },
    flowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    flowItem: {
        alignItems: 'center',
        gap: 4,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    }
});