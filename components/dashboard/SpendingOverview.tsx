import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import PieChart from 'react-native-pie-chart';

export function SpendingOverview() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    // Sample spending data
    const categories = [
        { name: 'Food', amount: 450.75, color: colors.primary },
        { name: 'Shopping', amount: 325.50, color: colors.secondary },
        { name: 'Trans', amount: 175.30, color: colors.accent },
        { name: 'Bills', amount: 230.25, color: colors.error },
    ];

    // Calculate the total spent
    const totalSpent = categories.reduce((sum, category) => sum + category.amount, 0);

    // Format data for PieChart
    const series = categories.map(category => ({
        value: category.amount,
        color: category.color,
        // Add labels with category name and percentage
        label: {
            text: `${category.name}\n${((category.amount / totalSpent) * 100).toFixed(0)}%`,
            fontSize: 12,
            fontWeight: 'bold',
            fill: 'black',
            strokeWidth: 0.5
        }
    }));

    // Screen dimensions for responsive sizing
    const screenWidth = Dimensions.get('window').width;
    const chartSize = Math.min(screenWidth - 64, 280);

    return (
        <ThemedView style={[styles.container, { borderColor: colors.border }]}>
            <ThemedText type="subtitle">Spending Overview</ThemedText>

            <View style={styles.chartContainer}>
                {/* Pie Chart */}
                <View style={styles.pieWrapper}>
                    <PieChart
                        widthAndHeight={chartSize}
                        series={series}
                        cover={{
                            radius: 0.4, // Create doughnut with 40% hole
                            color: 'white' // White center
                        }}
                        style={styles.chart}
                        padAngle={0.02} // Small gap between slices
                    />

                    {/* Total amount text in the center */}
                    <View style={[styles.totalOverlay, { width: chartSize * 0.4, height: chartSize * 0.4 }]}>
                        <ThemedText style={styles.totalAmount}>${totalSpent.toFixed(0)}</ThemedText>
                        <ThemedText style={styles.totalLabel}>Total</ThemedText>
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        gap: 16,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    pieWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chart: {
        zIndex: 1,
    },
    totalOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderRadius: 999,
    },
    totalAmount: {
        fontSize: 20,
        color: '#000000',
        fontWeight: 'bold',
    },
    totalLabel: {
        fontSize: 12,
        color: '#000000',
        opacity: 0.7,
    },
    legendContainer: {
        marginTop: 10,
        gap: 8,
    },
    legendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 8,
    },
    legendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendRight: {
        alignItems: 'flex-end',
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    percentText: {
        fontWeight: 'bold',
    },
    amountText: {
        fontSize: 12,
        opacity: 0.7,
    },
});