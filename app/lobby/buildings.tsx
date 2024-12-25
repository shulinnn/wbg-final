import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    SafeAreaView,
    Pressable,
    FlatList,
    Animated,
    Easing,
    Platform,
} from "react-native";
import { useAppContext } from "@/raceContext";
import { Building, Unit } from "@/types";  // Assume Building and Unit types are imported from your types
import { MenuButton } from "@/components/MenuButton";
import { BuildingCard } from "@/components/BuildingCard";

export default function Buildings() {
    const [data, setData] = useState<Building[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedBuildingId, setExpandedBuildingId] = useState<number | null>(null);

    const { myString } = useAppContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/buildings/race/${myString}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);
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

    const handleBuildingSelect = (building: Building) => {
        if (expandedBuildingId === building.id) {
            setExpandedBuildingId(null); // Collapse the selected building
        } else {
            setExpandedBuildingId(building.id); // Expand the selected building
        }
    };

    useEffect(() => {
        fetchData();
    }, [myString]);

    const filteredData = expandedBuildingId ? data.filter((building) => building.id === expandedBuildingId) : data;

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
                    data={filteredData} // Show only the selected building when expanded
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <BuildingCard
                            building={item}
                            onPress={() => handleBuildingSelect(item)}
                            isSelected={expandedBuildingId === item.id}
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
}

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
        marginTop: Platform.OS === 'web' ? 0 : 64,
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#363d5e",
        borderRadius: 8,
        zIndex: 5,
    },
    cardSelected: {
        zIndex: 10,
    },
    icon: {
        width: 64,
        height: 64,
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    description: {
        fontSize: 14,
        color: "#BBBBBB",
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    price: {
        color: "#FFD700",
    },
    expandedContent: {
        backgroundColor: "#2E3440",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
    },
    unitsContainer: {
        marginTop: 6,
        marginBottom: 8
    },
    unitsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFD700",
    },
    unitRow: {
        flexDirection: "row",
        marginVertical: 4,
    },
    unitIcon: {
        width: 64,
        height: 64,
        marginRight: 8,
    },
    unitDetails: {
        flex: 1,
    },
    unitName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    unitStats: {
        fontSize: 12,
        color: "#BBBBBB",
    },
    noUnitsText: {
        color: "#AAAAAA",
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
    },
});
