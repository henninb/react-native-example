/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HumanSecurity from '@humansecurity/react-native-sdk';

HumanSecurity.startWithAppId('PXjJ0cYtn9');

type WeatherObservation = {
  obsTimeLocal: string;
  imperial: {
    temp: number;
    windChill: number;
    pressure: string;
  };
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
};

function AppContent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const [useOverride, setUseOverride] = useState(false);
  const [weather, setWeather] = useState<WeatherObservation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = useOverride
    ? 'https://bookkeeper.bhenning.com'
    : 'https://vercel.bhenning.com';

  useEffect(() => {
    setWeather(null);
    setError(null);
    const pxHeaders = HumanSecurity.getHeaders();
    fetch(`${baseUrl}/api/weather`, {method: 'GET', headers: pxHeaders})
      .then(res => res.json())
      .then(data => setWeather(data.observations?.[0] ?? null))
      .catch(() => setError('Failed to fetch weather'));
  }, [baseUrl]);

  const bg = isDarkMode ? '#000' : '#fff';
  const fg = isDarkMode ? '#fff' : '#000';

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f3f3'}}
      contentContainerStyle={{paddingTop: insets.top}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.domainRow, {backgroundColor: bg}]}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={[styles.domainText, {color: fg, flex: 1}]}>
          {useOverride ? 'bookkeeper.bhenning.com' : 'vercel.bhenning.com'}
        </Text>
        <Switch value={useOverride} onValueChange={setUseOverride} />
      </View>
      <View style={[styles.card, {backgroundColor: bg}]}>
        <Text style={[styles.cardTitle, {color: fg}]}>Weather</Text>
        {error ? (
          <Text style={[styles.cardBody, {color: fg}]}>{error}</Text>
        ) : weather ? (
          <Text style={[styles.cardBody, {color: fg}]}>
            {`Temp: ${weather.imperial.temp}°F\nWind Chill: ${weather.imperial.windChill}°F\nPressure: ${weather.imperial.pressure} inHg\nHumidity: ${weather.humidity}%\nWind Speed: ${weather.windSpeed} mph\nPrecipitation: ${weather.precipitation} in\nAs of: ${weather.obsTimeLocal}`}
          </Text>
        ) : (
          <Text style={[styles.cardBody, {color: fg}]}>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  checkmark: {
    fontSize: 22,
    fontWeight: '700',
    color: '#22c55e',
    marginRight: 8,
  },
  domainText: {
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 16,
    lineHeight: 26,
  },
});

export default App;
