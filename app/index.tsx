import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView, Dimensions } from 'react-native';
import WarcraftSpinner from '../components/WarcraftSpinner';
import { Race } from '@/types';
import ErrorMessage from '../components/ErrorMessage';
import RaceCard from '../components/RaceCard';

const Index: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(-100));

  // Fetch races from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/races`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setRaces(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get screen width for pagination effect
  const screenWidth = Dimensions.get('window').width;

  // Render content for both web and native platforms using ScrollView
  const renderPager = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {races.map((race, index) => (
          <View key={race.id} style={[styles.page, { width: screenWidth }]}>
            <RaceCard race={race} />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <WarcraftSpinner />
      ) : error ? (
        <ErrorMessage error={error} slideAnim={slideAnim} />
      ) : (
        renderPager()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#282B3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    // Center the page content
    flex: 1,
  },
});

export default Index;
