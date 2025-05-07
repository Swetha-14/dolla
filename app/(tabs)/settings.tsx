import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Switch, View, ScrollView, SafeAreaView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];
    const [darkModeEnabled, setDarkModeEnabled] = useState(colorScheme === 'dark');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
            >
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title">Settings</ThemedText>
                    </ThemedView>

                    {/* Account Settings */}
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">Account</ThemedText>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="person.fill" size={20} color={colors.text} />
                                <ThemedText>Profile</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={16} color={colors.text} />
                        </ThemedView>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="building.columns.fill" size={20} color={colors.text} />
                                <ThemedText>Connected Banks</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={16} color={colors.text} />
                        </ThemedView>
                    </ThemedView>

                    {/* Appearance */}
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">Appearance</ThemedText>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="moon.fill" size={20} color={colors.text} />
                                <ThemedText>Dark Mode</ThemedText>
                            </View>
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: '#767577', true: colors.primary }}
                                thumbColor="#f4f3f4"
                            />
                        </ThemedView>
                    </ThemedView>

                    {/* Security */}
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">Security</ThemedText>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="bell.fill" size={20} color={colors.text} />
                                <ThemedText>Notifications</ThemedText>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#767577', true: colors.primary }}
                                thumbColor="#f4f3f4"
                            />
                        </ThemedView>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="touchid" size={20} color={colors.text} />
                                <ThemedText>Face/Touch ID</ThemedText>
                            </View>
                            <Switch
                                value={biometricEnabled}
                                onValueChange={setBiometricEnabled}
                                trackColor={{ false: '#767577', true: colors.primary }}
                                thumbColor="#f4f3f4"
                            />
                        </ThemedView>
                    </ThemedView>

                    {/* About */}
                    <ThemedView style={styles.section}>
                        <ThemedText type="subtitle">About</ThemedText>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="info.circle.fill" size={20} color={colors.text} />
                                <ThemedText>About Dolla</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={16} color={colors.text} />
                        </ThemedView>

                        <ThemedView style={[styles.settingItem, { borderColor: colors.border }]}>
                            <View style={styles.settingContent}>
                                <IconSymbol name="questionmark.circle.fill" size={20} color={colors.text} />
                                <ThemedText>Help & Support</ThemedText>
                            </View>
                            <IconSymbol name="chevron.right" size={16} color={colors.text} />
                        </ThemedView>
                    </ThemedView>

                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: colors.error }]}
                        onPress={() => { }}
                    >
                        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
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
    section: {
        gap: 12,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoutButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    logoutText: {
        color: '#FFFFFF',
        fontWeight: '600',
    }
});