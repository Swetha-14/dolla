import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { G, Path, Circle, Text } from 'react-native-svg';

export function SpendingOverview() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Sample spending data
    const categories = [
        { name: 'Food', amount: 450.75, color: colors.primary },
        { name: 'Shopping', amount: 325.50, color: colors.secondary },
        { name: 'Trans', amount: 175.30, color: colors.accent },
        { name: 'Bills', amount: 230.25, color: colors.error },
    ];

    // Calculate the total spent
    const totalSpent = categories.reduce((sum, category) => sum + category.amount, 0);

    // Screen dimensions for responsive sizing - make the chart larger
    const screenWidth = Dimensions.get('window').width;

    // Make the chart take up more of the available width
    const baseChartSize = Math.min(screenWidth - 48, 320);

    // Add padding to ensure expanded slices don't get cut off (15% expansion)
    const expansionFactor = 1.15;
    const paddingForExpansion = baseChartSize * (expansionFactor - 1);
    const svgSize = baseChartSize + paddingForExpansion * 2;

    // The chart will be centered in the SVG
    const chartSize = baseChartSize;
    const radius = chartSize / 2;
    const innerRadius = radius * 0.6; // For the donut hole (40% hole)

    // Center point of the SVG
    const center = svgSize / 2;

    // Calculate slice angles
    const slices = categories.map((category, index) => {
        const percentage = category.amount / totalSpent;
        const startAngle = index === 0 ? 0 :
            categories.slice(0, index).reduce((sum, cat) =>
                sum + (cat.amount / totalSpent) * 2 * Math.PI, 0);
        const endAngle = startAngle + percentage * 2 * Math.PI;

        return {
            ...category,
            percentage,
            startAngle,
            endAngle,
            index
        };
    });

    // Handle slice press
    const handleSlicePress = (index: number) => {
        setActiveIndex(index === activeIndex ? null : index);
    };

    // Handle press outside slices to reset
    const handleBackgroundPress = () => {
        setActiveIndex(null);
    };

    // Create SVG path for each slice
    const createSlicePath = (slice: any, index: any, isActive: any) => {
        const { startAngle, endAngle } = slice;

        // Scale factor for active slice (15% larger)
        const scaleFactor = isActive ? expansionFactor : 1;
        const sliceRadius = radius * scaleFactor;
        const sliceInnerRadius = innerRadius;

        // Calculate outer arc coordinates
        const startX = center + sliceRadius * Math.cos(startAngle);
        const startY = center + sliceRadius * Math.sin(startAngle);
        const endX = center + sliceRadius * Math.cos(endAngle);
        const endY = center + sliceRadius * Math.sin(endAngle);

        // Inner arc coordinates
        const innerStartX = center + sliceInnerRadius * Math.cos(startAngle);
        const innerStartY = center + sliceInnerRadius * Math.sin(startAngle);
        const innerEndX = center + sliceInnerRadius * Math.cos(endAngle);
        const innerEndY = center + sliceInnerRadius * Math.sin(endAngle);

        // Arc flag
        const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

        // Create a path 
        const path = `
            M ${startX} ${startY}
            A ${sliceRadius} ${sliceRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
            L ${innerEndX} ${innerEndY}
            A ${sliceInnerRadius} ${sliceInnerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
            Z
        `;

        return path;
    };

    // Calculate label positions
    const getLabelPosition = (slice: any, isActive: any) => {
        const { startAngle, endAngle, percentage, name } = slice;
        const midAngle = startAngle + (endAngle - startAngle) / 2;

        // Position labels differently based on active state
        const scaleFactor = isActive ? expansionFactor : 1;
        const labelRadius = ((radius + innerRadius) / 2) * scaleFactor;

        // For active slices, we'll show two lines (category and percentage)
        // For inactive slices, just show the category
        return {
            x: center + labelRadius * Math.cos(midAngle),
            y: center + labelRadius * Math.sin(midAngle),
            name: name,
            percentage: `${(percentage * 100).toFixed(0)}%`,
            showPercentage: isActive
        };
    };

    return (
        <ThemedView style={[styles.container, { borderColor: colors.border }]}>
            <ThemedText type="subtitle">Spending Overview</ThemedText>

            <View style={styles.chartContainer}>
                <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                    <View style={styles.pieWrapper}>
                        <Svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
                            <G>
                                {slices.map((slice, index) => {
                                    const isActive = activeIndex === index;
                                    const path = createSlicePath(slice, index, isActive);
                                    const labelPos = getLabelPosition(slice, isActive);

                                    return (
                                        <G key={index}>
                                            <Path
                                                d={path}
                                                fill={slice.color}
                                                stroke={isActive ? colors.secondary : "transparent"}
                                                strokeWidth={isActive ? 2 : 0}
                                                onPress={() => handleSlicePress(index)}
                                            />
                                            <Text
                                                x={labelPos.x}
                                                y={labelPos.y - (labelPos.showPercentage ? 8 : 0)}
                                                fill="white"
                                                fontSize="14"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                alignmentBaseline="central"
                                            >
                                                {labelPos.name}
                                            </Text>
                                            {labelPos.showPercentage && (
                                                <Text
                                                    x={labelPos.x}
                                                    y={labelPos.y + 12}
                                                    fill="white"
                                                    fontSize="14"
                                                    fontWeight="bold"
                                                    textAnchor="middle"
                                                    alignmentBaseline="central"
                                                >
                                                    {labelPos.percentage}
                                                </Text>
                                            )}
                                        </G>
                                    );
                                })}
                                <Circle
                                    cx={center}
                                    cy={center}
                                    r={innerRadius}
                                    fill="white"
                                />
                            </G>
                        </Svg>

                        {/* Total amount text in the center */}
                        <View style={[styles.totalOverlay, { width: innerRadius * 2, height: innerRadius * 2 }]}>
                            <ThemedText style={styles.totalAmount}>${totalSpent.toFixed(0)}</ThemedText>
                            <ThemedText style={styles.totalLabel}>Total</ThemedText>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
    totalOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        borderRadius: 999,
    },
    totalAmount: {
        fontSize: 24, // Larger text for total
        fontWeight: 'bold',
        color: 'black'
    },
    totalLabel: {
        fontSize: 14, // Larger text for label
        opacity: 0.7,
        color: 'black'
    }
});