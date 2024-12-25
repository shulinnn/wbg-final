import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Platform,
    SafeAreaView
} from "react-native";
import { MenuButton } from "@/components/MenuButton";

export default function Rules() {
    return (
        <SafeAreaView style={styles.container}>
            <MenuButton />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <Text style={styles.title}>Přehled tahů</Text>

                <View style={styles.phaseContainer}>
                    <Text style={styles.phaseTitle}>1. Fáze</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Pohyb</Text>
                        <Text style={styles.detailText}>Oprava budov</Text>
                    </View>
                </View>

                <View style={styles.phaseContainer}>
                    <Text style={styles.phaseTitle}>2. Fáze</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Těžba</Text>
                        <Text style={styles.detailText}>Stavba jednotek / hrdinů</Text>
                        <Text style={styles.detailText}>Stavba budov</Text>
                        <Text style={styles.detailText}>Útok</Text>
                        <Text style={styles.detailText}>Tech</Text>
                    </View>
                </View>

                <View style={styles.phaseContainer}>
                    <Text style={styles.phaseTitle}>3. Fáze</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Braní karet</Text>
                        <Text style={styles.detailText}>Použití karty</Text>
                        <Text style={styles.detailText}>
                            Vylepšení zdokonalení (Obchod / Kovárna)
                        </Text>
                        <Text style={styles.detailText}>
                            Použití zdokonalení ( obchod / kovárna)
                        </Text>
                    </View>
                </View>

                <View style={styles.phaseContainer}>
                    <Text style={styles.phaseTitle}>4. Fáze</Text>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailText}>Koupení předmětu</Text>
                        <Text style={styles.detailText}>Použití předmětu</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#282B3A",
        flex: 1, // Make the container fill the full height of the screen
    },
    imageBg: {
        width: "100%",
        height: "100%",
    },
    scrollView: {
        marginTop: Platform.OS === 'web' ? 64 : 128,
        marginBottom: 64,
        flex: 1, // Allow ScrollView to take remaining space
    },
    scrollContent: {
        gap: 32,
        paddingBottom: 64, // Ensures there's space at the bottom on web
    },
    title: {
        textAlign: "center",
        fontSize: 36,
        color: "#FFF",
        fontWeight: "bold",
    },
    phaseContainer: {
        padding: 16,
        marginVertical: 4,
    },
    phaseTitle: {
        textAlign: "center",
        fontSize: 22,
        color: "#FFD700",
        fontWeight: "500",
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: "column",
        gap: 8,
        paddingHorizontal: 16,
    },
    detailText: {
        color: "#FFF",
        fontSize: 14,
    },
});
