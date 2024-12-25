import { MenuButton } from "@/components/MenuButton";
import { Creep, Item } from "@/types";
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

// CreepCard Component
export const CreepCard = ({ creep, onPress, isSelected }: { creep: Creep; onPress: () => void; isSelected: boolean }) => {
    const [slideAnim] = useState(new Animated.Value(-200)); // Initial position for slide-in animation
    const [opacityAnim] = useState(new Animated.Value(0)); // Initial opacity (invisible)

    useEffect(() => {
        if (isSelected) {
            // Slide in animation
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();

            // Opacity fade-in effect
            Animated.timing(opacityAnim, {
                toValue: 1,
                delay: 300,
                duration: 300,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();
        } else {
            // Slide out animation
            Animated.timing(slideAnim, {
                toValue: -200,
                duration: 500,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();

            // Opacity fade-out effect
            Animated.timing(opacityAnim, {
                toValue: 0,
                delay: 300,
                duration: 300,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();
        }
    }, [isSelected, slideAnim, opacityAnim]);

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.card, isSelected && styles.cardSelected]}>
                <Image
                    style={styles.icon}
                    source={{
                        uri: `http://wbgl.cz/api/v1/assets/${creep.icon}`,
                    }}
                />
                <View style={styles.details}>
                    <Text style={styles.name}>{creep.name}</Text>
                </View>
            </View>

            {/* The expanded content for Creep's stats, map, and items */}
            {isSelected && (
                <Animated.View
                    style={[
                        styles.expandedContent,
                        {
                            transform: [{ translateY: slideAnim }],
                            opacity: opacityAnim,
                        },
                    ]}
                >
                    <Text style={styles.statsTitle}>Stats:</Text>
                    <Text style={styles.stats}>Health: {creep.health}</Text>
                    <Text style={styles.stats}>Damage: {creep.damage}</Text>

                    {/* Items field */}
                    {creep.item.length > 0 ? (
                        <>
                            <Text style={styles.statsTitle}>Items:</Text>
                            {creep.item.map((item: Item, index: number) => (
                                <View key={index} style={styles.itemContainer}>
                                    <Image
                                        style={styles.itemIcon}
                                        source={{
                                            uri: `http://wbgl.cz/api/v1/assets/${item.icon}`,
                                        }}
                                    />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemDescription}>{item.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <Text style={styles.stats}>No items available.</Text>
                    )}
                </Animated.View>
            )}
        </Pressable>
    );
};

// Main Creeps Component
export default function Creeps() {
    const [data, setData] = useState<Creep[]>([]);  // To hold the list of creeps
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCreepId, setExpandedCreepId] = useState<number | null>(null);
    const [expandedCreep, setExpandedCreep] = useState<Creep | null>(null); // To hold the detailed creep data

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/creeps`;  // Fetch list of creeps
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result);  // Assuming the result is an array of Creep objects
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

    const fetchCreepDetails = async (creepId: number) => {
        try {
            const url = `${process.env.EXPO_PUBLIC_API_URL}/creep/${creepId}`; // Fetch individual creep details
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setExpandedCreep(result);  // Set the detailed creep information
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    const handleCreepSelect = (creepId: number) => {
        // Toggle the expansion of the selected creep
        if (expandedCreepId === creepId) {
            setExpandedCreepId(null);  // Collapse the selected creep
            setExpandedCreep(null);  // Reset the detailed data
        } else {
            setExpandedCreepId(creepId);  // Expand the selected creep
            fetchCreepDetails(creepId);  // Fetch details for the selected creep
        }
    };

    useEffect(() => {
        fetchData();  // Fetch the list of creeps on component mount
    }, []);

    // Filter the data to only show the selected creep if any
    const filteredData = expandedCreepId ? [expandedCreep] : data;

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
                    data={filteredData}  // Show only selected creep if there is one selected
                    keyExtractor={(item) => item?.id.toString() || '0'}  // Handle possible null for item
                    renderItem={({ item }) => {
                        // Ensure item is not null before rendering
                        if (!item) {
                            return null; // Skip rendering if item is null
                        }

                        return (
                            <CreepCard
                                creep={item}  // Pass the non-null creep data
                                onPress={() => handleCreepSelect(item.id)}
                                isSelected={expandedCreepId === item.id}  // Only expand the selected one
                            />
                        );
                    }}
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
    details: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        color: "#FFFFFF",
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
    itemContainer: {
        flexDirection: "row",
        marginVertical: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    itemIcon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        color: "#FFD700",
        fontWeight: "bold",
    },
    itemDescription: {
        fontSize: 14,
        color: "#BBBBBB",
    },
    errorMessage: {
        color: "red",
        textAlign: "center",
    },
});
