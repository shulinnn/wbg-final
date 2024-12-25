import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable,
    Animated,
    Easing,
    SafeAreaView,
    FlatList,
    Platform,
} from "react-native";
import { MenuButton } from "@/components/MenuButton";
import { Item } from "@/types";
import { ShopItemCard } from "@/components/ItemCard";

// Main Shop Component
export default function Shop() {
    const [data, setData] = useState<Item[]>([]); // To hold the list of items
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedItemId, setExpandedItemId] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/items/race/neutral`; // Fetch list of items
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result); // Assuming the result is an array of Item objects
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
        fetchData(); // Fetch the list of items on component mount
    }, []);

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
                        <ShopItemCard
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
        justifyContent: "center",
        marginTop: Platform.OS === 'web' ? 0 : 64,
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#363d5e",
        borderRadius: 8,
    },
    cardSelected: {
        zIndex: 10,
    },
    icon: {
        width: 45,
        height: 45,
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    detailsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    type: {
        fontSize: 14,
        color: "#BBBBBB",
    },
    priceContainer: {
        flexDirection: "row",
    },
    priceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
    },
    priceIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    priceText: {
        fontSize: 14,
        color: "#FFD700",
    },
    expandedContent: {
        backgroundColor: "#2E3440",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFD700",
    },
    stats: {
        fontSize: 14,
        color: "#BBBBBB",
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
    },
});
