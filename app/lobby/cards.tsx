import ErrorMessage from "@/components/ErrorMessage";
import { MenuButton } from "@/components/MenuButton";
import WarcraftSpinner from "@/components/WarcraftSpinner";
import { useAppContext } from "@/raceContext";
import { Card } from "@/types";  // Assuming this is your updated Card type
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

const CardComponent = ({ card, onPress, isSelected }: { card: Card; onPress: () => void; isSelected: boolean }) => {
    const [expandedData, setExpandedData] = useState<Card | null>(null);
    const [slideAnim] = useState(new Animated.Value(-200)); // Slide-in animation for expanded content
    const [opacityAnim] = useState(new Animated.Value(0)); // Opacity fade-in

    useEffect(() => {
        if (isSelected) {
            setExpandedData(card); // Set expanded data to show additional info when selected

            // Slide in animation when the card is selected
            Animated.timing(slideAnim, {
                toValue: 0, // Final position
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
            // Slide out animation when deselected
            Animated.timing(slideAnim, {
                toValue: -200, // Hide the expanded content
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
    }, [isSelected, card.id, slideAnim, opacityAnim]);

    return (
        <Pressable onPress={onPress}>
            <View style={[styles.card, isSelected && styles.cardSelected]}>
                <Image
                    style={styles.icon}
                    source={{
                        uri: `http://wbgl.cz/api/v1/assets/${card.icon}`, // Card icon
                    }}
                />
                <View style={styles.details}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{card.name}</Text>
                        <Text style={{ color: 'white' }}>{card?.times_in_deck}x</Text>
                    </View>
                </View>
            </View>

            {/* The expanded content will only be visible for the selected card */}
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
                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailsTitle}>Details</Text>
                            <Text style={styles.description}>{expandedData?.description}</Text>
                        </View>
                    )}
                </Animated.View>
            )}
        </Pressable>
    );
};

export default function Cards() {
    const [data, setData] = useState<Card[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

    const { myString } = useAppContext();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/cards/race/${myString}`;
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

    const handleCardSelect = (card: Card) => {
        if (expandedCardId === card.id) {
            setExpandedCardId(null); // Collapse the selected card
        } else {
            setExpandedCardId(card.id); // Expand the selected card
        }
    };

    useEffect(() => {
        fetchData();
    }, [myString]);

    const filteredData = expandedCardId ? data.filter((card) => card.id === expandedCardId) : data;

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
                    data={filteredData} // Show only the selected card when expanded
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <CardComponent
                            card={item}
                            onPress={() => handleCardSelect(item)}
                            isSelected={expandedCardId === item.id}
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
        flex: 1,
        paddingTop: Platform.OS === 'web' ? 64 : 64, // Use default padding on mobile, 20px on web
        paddingBottom: Platform.OS === 'web' ? 64 : 64, // Same for bottom padding
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 16,
        marginTop: Platform.OS === 'web' ? 0 : 64,
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
        zIndex: 10, // Bring selected card in front of the expanded content
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
    expandedContent: {
        backgroundColor: "#2E3440",
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
        zIndex: 1,
    },
    detailsContainer: {
        marginBottom: 10,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#FFD700",
    },
    description: {
        color: "#AAA",
        fontSize: 14,
    },
    noAbilitiesText: {
        color: "#AAAAAA",
    },
});
