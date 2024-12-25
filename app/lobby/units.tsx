import ErrorMessage from "@/components/ErrorMessage";
import { MenuButton } from "@/components/MenuButton";
import WarcraftSpinner from "@/components/WarcraftSpinner";
import { useAppContext } from "@/raceContext";
import { Unit, Ability } from "@/types";
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

const UnitCard = ({ unit, onPress, isSelected }: { unit: Unit; onPress: () => void; isSelected: boolean }) => {
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [isAbilitiesLoading, setIsAbilitiesLoading] = useState(true);
    const [slideAnim] = useState(new Animated.Value(-200)); // Initial position for slide-in animation
    const [opacityAnim] = useState(new Animated.Value(0)); // Initial opacity (invisible)

    useEffect(() => {
        if (isSelected) {
            const fetchAbilities = async () => {
                try {
                    setIsAbilitiesLoading(true);
                    const response = await fetch(`http://wbgl.cz/api/v1/unit/${unit.id}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch abilities for unit ${unit.id}`);
                    }
                    const result = await response.json();
                    setAbilities(result.ability || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsAbilitiesLoading(false);
                }
            };

            fetchAbilities();

            // Slide in animation when the unit is selected
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
            // Slide out animation when the unit is deselected
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
    }, [isSelected, unit.id, slideAnim, opacityAnim]);

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.card, isSelected && styles.cardSelected]}>
                <Image
                    style={styles.icon}
                    source={{
                        uri: `http://wbgl.cz/api/v1/assets/${unit.icon}`,
                    }}
                />
                <View style={styles.details}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{unit.name}</Text>
                        <View style={{ flexDirection: 'row', columnGap: 12 }} >
                            <View style={styles.priceContainer}>
                                <Image
                                    style={styles.goldIcon}
                                    source={require('@/assets/images/gold.png')}
                                />
                                <Text style={styles.price}>{unit.priceGold}</Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Image
                                    style={styles.goldIcon}
                                    source={require('@/assets/images/lumber.png')}
                                />
                                <Text style={styles.priceWood}>{unit.priceWood}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* The expansion content will only be visible for the selected unit */}
            {isSelected && (
                <Animated.View
                    style={[
                        styles.expandedContent,
                        {
                            transform: [{ translateY: slideAnim }],
                            opacity: opacityAnim, // Apply opacity animation
                            zIndex: 10, // Make the expanded content appear behind the card
                        },
                    ]}
                >
                    {isSelected && (
                        <View style={styles.statsContainer}>
                            <Text style={styles.statsTitle}>Stats</Text>
                            <View style={styles.additionalData}>
                                <View style={styles.statsRow}>
                                    <StatRow
                                        icon={require('@/assets/images/attackType.png')}
                                        label={unit.attack_type}
                                    />
                                    <StatRow
                                        icon={require('@/assets/images/health.png')}
                                        label={unit.health.toString()}
                                    />
                                </View>
                                <View style={styles.statsRow}>
                                    <StatRow
                                        icon={require('@/assets/images/damage.png')}
                                        label={unit.damage.toString()}
                                    />
                                    <StatRow
                                        icon={require('@/assets/images/speed.png')}
                                        label={unit.movement.toString()}
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                    <View style={styles.abilitiesContainer}>
                        <Text style={styles.abilitiesTitle}>Abilities:</Text>
                        {isAbilitiesLoading ? (
                            <Text style={styles.noAbilitiesText}>Loading abilities...</Text>
                        ) : abilities.length > 0 ? (
                            abilities.map((ability: Ability, index: number) => (
                                <View key={index} style={styles.abilityRow}>
                                    <Image
                                        style={styles.abilityIcon}
                                        source={{
                                            uri: `http://wbgl.cz/api/v1/assets/${ability.icon}`,
                                        }}
                                    />
                                    <View style={styles.abilityDetails}>
                                        <Text style={styles.abilityName}>{ability.name}</Text>
                                        <Text style={styles.abilityDescription}>{ability.description}</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noAbilitiesText}>No abilities available.</Text>
                        )}
                    </View>
                </Animated.View>
            )}
        </Pressable>
    );
};

const StatRow = ({ icon, label }: { icon: any; label: string }) => (
    <View style={styles.statRow}>
        <Image source={icon} style={styles.statIcon} />
        <Text style={styles.stat}>{label}</Text>
    </View>
);

export default function Units() {
    const [data, setData] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedUnitId, setExpandedUnitId] = useState<number | null>(null);

    const { myString } = useAppContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/units/${myString}`;
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

    const handleUnitSelect = (unit: Unit) => {
        if (expandedUnitId === unit.id) {
            setExpandedUnitId(null); // Collapse the selected unit
        } else {
            setExpandedUnitId(unit.id); // Expand the selected unit
        }
    };

    useEffect(() => {
        fetchData();
    }, [myString]);

    const filteredData = expandedUnitId ? data.filter((unit) => unit.id === expandedUnitId) : data;

    return (
        <SafeAreaView style={styles.safeArea}>
            {!error ? <MenuButton /> : null}
            {isLoading ? (
                <View style={styles.centered}>
                    <WarcraftSpinner />
                </View>
            ) : error ? (
                <ErrorMessage error={error} slideAnim={new Animated.Value(-100)} />
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={filteredData} // Show only the selected unit when expanded
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UnitCard
                            unit={item}
                            onPress={() => handleUnitSelect(item)}
                            isSelected={expandedUnitId === item.id}
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
    additionalData: {},
    listContainer: {
        flexGrow: 1,
        paddingTop: 64,
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
        zIndex: 5, // Make sure the unit card is behind the expanded content
    },
    cardSelected: {
        zIndex: 10, // Bring selected unit card in front of the expanded content
    },
    icon: {
        width: 64,
        height: 64,
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    goldIcon: {
        width: 14,
        height: 14,
        marginRight: 6,
    },
    price: {
        color: "#FFD700",
    },
    priceWood: {
        color: 'green'
    },
    expandedContent: {
        backgroundColor: "#2E3440",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
        zIndex: 1, // Expanded content is behind the selected unit card
    },
    statsContainer: {
        marginBottom: 10,
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#FFD700",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    abilitiesContainer: {},
    abilitiesTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#FFD700",
    },
    abilityRow: {
        flexDirection: "row",
        marginVertical: 4,
    },
    abilityIcon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    stat: {
        fontSize: 14,
        color: "#FFFFFF",
        marginLeft: 4,
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
    noAbilitiesText: {
        color: "#AAAAAA",
    },
});
