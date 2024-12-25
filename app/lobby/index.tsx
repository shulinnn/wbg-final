import ErrorMessage from "@/components/ErrorMessage";
import { MenuButton } from "@/components/MenuButton";
import WarcraftSpinner from "@/components/WarcraftSpinner";
import { useAppContext } from "@/raceContext";
import { Race } from "@/types";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ActivityIndicator, SafeAreaView, Animated } from "react-native";

export default function Index() {
    const [data, setData] = useState({} as Race);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [slideAnim] = useState(new Animated.Value(-100));

    const { myString } = useAppContext();

    // Fetch data function with better error handling
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const url = `${process.env.EXPO_PUBLIC_API_URL}/race/${myString}`; // Log URL for debugging

            const response = await fetch(url);

            // Check if the response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setData(result); // Set the fetched data
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); // Set error message
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data when the component mounts
    }, [myString]); // Re-run if `myString` changes


    return (
        <SafeAreaView style={styles.container}>
            <MenuButton />
            {isLoading ? (
                <WarcraftSpinner />
            ) : error ? (
                <ErrorMessage error={error} slideAnim={slideAnim} />
            ) : (
                <View style={styles.wrapper}>
                    <View style={styles.page}>
                        {data?.icon ? (
                            <Image
                                style={styles.icon}
                                source={{
                                    uri: `${process.env.EXPO_PUBLIC_API_URL}/assets/${data.icon}`,
                                }}
                            />
                        ) : (
                            <Text style={styles.errorText}>Icon not found</Text>
                        )}

                        <Text style={styles.name}>{data?.name}</Text>

                        {data?.ability?.icon ? (
                            <Image
                                style={styles.abilityIcon}
                                source={{
                                    uri: `${process.env.EXPO_PUBLIC_API_URL}/assets/${data.ability.icon}`,
                                }}
                            />
                        ) : (
                            <Text style={styles.errorText}>Ability icon not found</Text>
                        )}

                        <Text style={styles.abilityName}>{data?.ability?.name}</Text>

                        <Text style={styles.abilityDescription}>
                            {data?.ability?.description}
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#282B3A",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    wrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    page: {
        rowGap: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    icon: {
        height: 240,
        width: 240,
    },
    name: {
        fontSize: 36,
        fontWeight: "bold",
        color: "white",
    },
    abilityIcon: {
        height: 64,
        width: 64,
    },
    abilityName: {
        fontSize: 24,
        fontWeight: "500",
        textTransform: "uppercase",
        color: "white",
    },
    abilityDescription: {
        fontSize: 14,
        fontWeight: "400",
        color: "white",
        textAlign: "center",
        paddingHorizontal: 32,
    },
    errorText: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
    },
});