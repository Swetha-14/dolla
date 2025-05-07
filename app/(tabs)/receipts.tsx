import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ReceiptsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const router = useRouter();

    const openSimpleCamera = () => {
        router.push('/simple-camera');
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{
                light: Colors.light.accent,
                dark: Colors.dark.accent
            }}
            headerImage={
                <IconSymbol
                    size={310}
                    color={colorScheme === 'light' ? '#E68900' : '#FFB74D'}
                    name="doc.text.viewfinder"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Receipts</ThemedText>
                </ThemedView>

                <ThemedView style={[styles.scanContainer, { borderColor: colors.border }]}>
                    <ThemedText style={styles.scanTitle}>Scan a Receipt</ThemedText>
                    <ThemedText style={styles.scanDescription}>
                        Take a photo of your receipt to automatically track your expenses at item-level detail
                    </ThemedText>

                    <TouchableOpacity
                        style={[styles.scanButton, { backgroundColor: colors.primary }]}
                        onPress={openSimpleCamera}
                    >
                        <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
                        <ThemedText style={styles.buttonText}>Scan Receipt</ThemedText>
                    </TouchableOpacity>
                </ThemedView>

                <ThemedView>
                    <ThemedText type="subtitle">Recent Receipts</ThemedText>

                    <ThemedView style={[styles.emptyState, { borderColor: colors.border }]}>
                        <IconSymbol
                            name="doc.text.magnifyingglass"
                            size={48}
                            color={colors.border}
                        />
                        <ThemedText style={styles.emptyStateText}>
                            Your scanned receipts will appear here
                        </ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 24,
    },
    headerImage: {
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    scanContainer: {
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        gap: 12,
    },
    scanTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scanDescription: {
        textAlign: 'center',
        marginBottom: 8,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        width: '100%',
        gap: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
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