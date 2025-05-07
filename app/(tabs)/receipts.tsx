import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function AddExpenseScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

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
    }
});