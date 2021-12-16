import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Header } from 'react-native-elements';
import ForecastScreen from './components/ForecastScreen';
import FavouritesScreen from './components/FavouritesScreen';
import HistoryScreen from './components/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Header
        centerComponent={{ text: "AWESOME WEATHER APP", style: { color: "#fff", fontWeight: "bold" } }}
      />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Forecast") {
              return <FontAwesome5 name="cloud-sun-rain" size={size} color={color} />;
            } else if (route.name === "Favourites") {
              return <MaterialIcons name="favorite" size={size} color={color} />;
            } else if (route.name === "History") {
              return <FontAwesome5 name="history" size={size} color={color} />;
            }
          }
        })}>
        <Tab.Screen name="Forecast" component={ForecastScreen} />
        <Tab.Screen name="Favourites" component={FavouritesScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}