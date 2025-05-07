import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SimpleCamera() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <View style={styles.container}>
                <Text style={styles.cameraText}>Camera</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                        // Use expo-router's router to navigate back
                        router.back();
                    }}
                >
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraText: {
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 24,
    },
});