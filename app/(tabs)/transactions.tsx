import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

export default function TransactionsScreen() {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <ParallaxScrollView
            headerBackgroundColor={{
                light: Colors.light.secondary,
                dark: Colors.dark.secondary
            }}
            headerImage={
                <IconSymbol
                    size={310}
                    color={colorScheme === 'light' ? '#1976D2' : '#2F80ED'}
                    name="list.bullet"
                    style={styles.headerImage}
                />
            }>
            <ThemedView style={styles.container}>
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">Transactions</ThemedText>
                </ThemedView>

                {/* Will be expanded with transaction filtering options */}
                <ThemedView style={styles.filtersContainer}>
                    <ThemedText>All transactions</ThemedText>
                </ThemedView>

                <RecentTransactions />

                {/* Placeholder for "Load More" functionality */}
                <ThemedView style={styles.loadMoreContainer}>
                    <ThemedText style={styles.loadMoreText}>Load more transactions</ThemedText>
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
    filtersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    loadMoreContainer: {
        alignItems: 'center',
        padding: 16,
    },
    loadMoreText: {
        color: Colors.light.secondary,
    }
});