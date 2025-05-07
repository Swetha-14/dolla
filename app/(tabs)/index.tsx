import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { BalanceSummary } from '@/components/dashboard/BalanceSummary';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { SpendingOverview } from '@/components/dashboard/SpendingOverview';
import { useColorScheme } from '@/hooks/useColorScheme';
import { runOnJS } from 'react-native-reanimated';

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const openSimpleCamera = () => {
    // Navigate to the simple camera screen instead
    router.push('/simple-camera');
  };

  const panGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX > 100 && Math.abs(event.translationY) < 50) {
        runOnJS(openSimpleCamera)(); // safely call openSimpleCamera on JS thread
      }
    })
    .minDistance(20)
    .activeOffsetX([20, 999])
    .failOffsetY([-10, 10]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
            >
              <ThemedView style={styles.container}>
                <ThemedView style={styles.titleContainer}>
                  <ThemedText type="title">Dashboard</ThemedText>
                </ThemedView>

                <BalanceSummary />

                <SpendingOverview />

                <ThemedView style={styles.sectionContainer}>
                  <ThemedText type="subtitle">Recent Transactions</ThemedText>
                  <RecentTransactions />
                </ThemedView>
              </ThemedView>
            </ScrollView>
          </SafeAreaView>


          <TouchableOpacity
            style={[styles.cameraButton, { backgroundColor: colors.primary }]}
            onPress={openSimpleCamera}
          >
            <IconSymbol name="camera.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
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
  sectionContainer: {
    gap: 16,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  }
});