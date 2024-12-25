import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { Pressable, Platform, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export const MenuButton = (): JSX.Element => {
    const navigation = useNavigation();

    return (
        <Pressable
            style={[
                styles.menuButton,
                // If the platform is web, adjust the position to be 16px from top-left corner
                Platform.OS === 'web' ? styles.menuButtonWeb : null
            ]}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
            <Feather name="menu" size={24} color="white" />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    menuButton: {
        position: "absolute",
        left: 16,
        top: 64,
        padding: 8,
        zIndex: 100,
    },
    menuButtonWeb: {
        top: 16, // Set top padding for web
    },
});
