import React, { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Pressable,
    View,
    Text,
    Image,
    StyleSheet,
    Platform,
} from "react-native";
import { Upgrade } from "@/types";

export const UpgradeCard = ({
    item,
    onPress,
    isSelected,
}: {
    item: Upgrade;
    onPress: () => void;
    isSelected: boolean;
}) => {
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
                        uri: `http://wbgl.cz/api/v1/assets/${item.icon}`,
                    }}
                />
                <View style={styles.detailsContainer}>
                    <View style={styles.detailsHeader}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={styles.priceContainer}>
                            <View style={styles.priceItem}>
                                <Image
                                    style={styles.priceIcon}
                                    source={require('../assets/images/gold.png')}
                                />
                                <Text style={styles.priceText}>{item.price_gold}</Text>
                            </View>
                            <View style={styles.priceItem}>
                                <Image
                                    style={styles.priceIcon}
                                    source={require('../assets/images/lumber.png')}
                                />
                                <Text style={styles.priceText}>{item.price_wood}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* The expanded content for item's details */}
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
                    <Text style={styles.statsTitle}>Details:</Text>
                    <Text style={styles.stats}>Description: {item.description}</Text>
                    <Text style={styles.stats}>Tech Level: {item.tech}</Text>
                    {/* Render Abilities with icon, name, and description */}
                    {item.ability && item.ability.length > 0 && (
                        <>
                            <Text style={styles.statsTitle}>Abilities:</Text>
                            {item.ability.map((ability, index) => (
                                <View key={index} style={styles.abilityContainer}>
                                    <Image
                                        style={styles.abilityIcon}
                                        source={{
                                            uri: 'http://wbgl.cz/api/v1/assets/' + ability.icon,
                                        }}
                                    />
                                    <View style={styles.abilityDetails}>
                                        <Text style={styles.abilityName}>
                                            {ability.name}
                                        </Text>
                                        <Text style={styles.abilityDescription}>
                                            {ability.description}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    )}
                </Animated.View>
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
        marginBottom: 5,
    },
    stats: {
        fontSize: 14,
        color: "#BBBBBB",
        marginVertical: 2,
    },
    // Styles for abilities section
    abilityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 8,
    },
    abilityIcon: {
        width: 30,
        height: 30,
        marginRight: 12,
    },
    abilityDetails: {
        flex: 1,
    },
    abilityName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    abilityDescription: {
        fontSize: 12,
        color: "#BBBBBB",
    },
});
