import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Race } from '@/types';
import { useAppContext } from '@/raceContext';
import { router } from 'expo-router';

interface RaceCardProps {
  race: Race;
}

const RaceCard: React.FC<RaceCardProps> = ({ race }) => {
  const { updateString } = useAppContext();

  return (
    <View style={styles.cardContainer}>
      <Image
        style={styles.raceIcon}
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/assets/${race.icon}` }}
      />
      <Text style={styles.raceName}>{race.name}</Text>
      <Image
        style={styles.abilityIcon}
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/assets/${race.ability.icon}` }}
      />
      <Text style={styles.abilityName}>{race.ability.name}</Text>
      <Text style={styles.abilityDescription}>{race.ability.description}</Text>
      <Pressable
        style={styles.selectButton}
        onPress={() => {
          updateString(race.name);
          router.push('/lobby');
        }}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Zvolit rasu</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 32,
  },
  raceIcon: {
    height: 240,
    width: 240,
  },
  raceName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  abilityIcon: {
    height: 64,
    width: 64,
  },
  abilityName: {
    fontSize: 24,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: 'white',
  },
  abilityDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  selectButton: {
    marginTop: 32,
  },
  button: {
    backgroundColor: '#2F95DC',
    paddingVertical: 8,
    paddingHorizontal: 124,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
  },
});

export default RaceCard;