import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    FlatList,
    Platform,
} from "react-native";
import { MenuButton } from "@/components/MenuButton";
import { Upgrade } from "@/types";
import { useAppContext } from "@/raceContext";
import { UpgradeCard } from "@/components/UpgradeCard";

// Main Shop Component for Upgrades
export default function Shop() {
    const [data, setData] = useState<Upgrade[]>([]); // To hold the list of upgrades
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

    const { myString } = useAppContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/upgrades/race/${myString}`; // Fetch upgrades as items
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result); // Assuming the result is an array of Upgrade objects
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleItemSelect = (itemId: number) => {
        // Toggle the expansion of the selected item
        if (expandedItemId === itemId) {
            setExpandedItemId(null); // Collapse the selected item
        } else {
            setExpandedItemId(itemId); // Expand the selected item
        }
    };

    useEffect(() => {
        fetchData(); // Fetch the list of upgrades on component mount
    }, [myString]);

    // Filter the data to only show the selected item if there is one
    const filteredData = expandedItemId
        ? data.filter((item) => item.id === expandedItemId)
        : data;

    return (
        <SafeAreaView style={styles.safeArea}>
            {!error ? <MenuButton /> : null}
            {isLoading ? (
                <View style={styles.centered}>
                    <Text>Loading...</Text>
                </View>
            ) : error ? (
                <Text style={styles.errorMessage}>{error}</Text>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={filteredData}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UpgradeCard
                            item={item}
                            onPress={() => handleItemSelect(item.id)}
                            isSelected={expandedItemId === item.id}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
}

// Styles
const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#282B3A",
        paddingTop: Platform.OS === 'web' ? 64 : 64, // Use default padding on mobile, 20px on web
        paddingBottom: Platform.OS === 'web' ? 64 : 64, // Same for bottom padding
        flex: 1,
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        flexGrow: 1,
        paddingTop: 64,
        paddingHorizontal: 16,
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
    },
});
