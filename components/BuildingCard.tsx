import { Building, Unit } from "@/types";
import React from "react";
import { useEffect, useState } from "react";
import { Animated, Easing, View, Text, Image, Pressable, StyleSheet, Platform } from "react-native";

export const BuildingCard = ({ building, onPress, isSelected }: { building: Building; onPress: () => void; isSelected: boolean }) => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isUnitsLoading, setIsUnitsLoading] = useState(true);
    const [slideAnim] = useState(new Animated.Value(-200)); // Initial position for slide-in animation
    const [opacityAnim] = useState(new Animated.Value(0)); // Initial opacity (invisible)

    useEffect(() => {
        if (isSelected) {
            const fetchUnits = async () => {
                try {
                    setIsUnitsLoading(true);
                    const response = await fetch(`http://wbgl.cz/api/v1/building/${building.id}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch units for building ${building.id}`);
                    }
                    const result = await response.json();
                    setUnits(result.unit || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsUnitsLoading(false);
                }
            };

            fetchUnits();

            // Slide in animation when the building is selected
            Animated.timing(slideAnim, {
                toValue: 0, // Final position (no movement)
                duration: 500,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();

            // Opacity fade-in effect
            Animated.timing(opacityAnim, {
                toValue: 1, // Make it fully visible
                delay: 300,
                duration: 300,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();
        } else {
            // Slide out animation when the building is deselected
            Animated.timing(slideAnim, {
                toValue: -200, // Move the content up to hide it
                duration: 500,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();

            // Opacity fade-out effect when deselected
            Animated.timing(opacityAnim, {
                toValue: 0, // Fade it out
                delay: 300,
                duration: 300,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start();
        }
    }, [isSelected, building.id, slideAnim, opacityAnim]);

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.card, isSelected && styles.cardSelected]}>
                <Image
                    style={styles.icon}
                    source={{
                        uri: `http://wbgl.cz/api/v1/assets/${building.icon}`,
                    }}
                />
                <View style={styles.details}>
                    <Text style={styles.name}>{building.name}</Text>
                    <View style={styles.priceRow}>
                        <Image
                            source={require('../assets/images/gold.png')}
                            style={styles.priceIcon}
                        />
                        <Text style={styles.priceText}>{building.priceGold}</Text>
                        <Image
                            source={require('../assets/images/lumber.png')}
                            style={styles.priceIcon}
                        />
                        <Text style={styles.priceText}>{building.priceWood}</Text>
                    </View>
                </View>
            </View>

            {/* The expanded content for building details */}
            {isSelected && (
                <>
                    <View style={{
                        marginTop: 6,
                        marginBottom: 8,
                        backgroundColor: "#2E3440",
                        marginVertical: 8,
                        padding: 10,
                        borderRadius: 8,
                    }}>
                        <Text style={styles.unitsTitle}>Details:</Text>
                        <Text style={styles.description}>{building.description}</Text>
                    </View>
                    <Animated.View
                        style={[
                            styles.expandedContent,
                            {
                                transform: [{ translateY: slideAnim }],
                                opacity: opacityAnim,
                            },
                        ]}
                    >
                        <View style={styles.unitsContainer}>
                            <Text style={styles.unitsTitle}>Units:</Text>
                            {isUnitsLoading ? (
                                <Text style={styles.noUnitsText}>Loading units...</Text>
                            ) : units.length > 0 ? (
                                units.map((unit: Unit, index: number) => (
                                    <View key={index} style={styles.unitRow}>
                                        <Image
                                            style={styles.unitIcon}
                                            source={{
                                                uri: `http://wbgl.cz/api/v1/assets/${unit.icon}`,
                                            }}
                                        />
                                        <View style={styles.unitDetails}>
                                            <Text style={styles.unitName}>{unit.name}</Text>
                                            <Text style={styles.unitStats}>Tech: {unit.tech}</Text>
                                            <Text style={styles.unitStats}>Health: {unit.health}</Text>
                                            <Text style={styles.unitStats}>Damage: {unit.damage}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.noUnitsText}>No units available.</Text>
                            )}
                        </View>
                    </Animated.View>
                </>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
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
        width: 64,
        height: 64,
        marginRight: 16,
    },
    details: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16,
    },
    priceIcon: {
        width: 16,
        height: 16,
        marginHorizontal: 4,
    },
    priceText: {
        fontSize: 14,
        color: "#FFD700",
    },
    description: {
        fontSize: 14,
        color: "#BBBBBB",
        marginTop: 8,
    },
    expandedContent: {
        backgroundColor: "#2E3440",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
    },
    unitsContainer: {
        marginTop: 6,
        marginBottom: 8,
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
});
