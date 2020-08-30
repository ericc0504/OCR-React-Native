import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from "react-native-safe-area-context";

import HomeScreen from "./app/screens/HomeScreen";
import HistoryScreen from "./app/screens/HistoryScreen";
import OCRResultScreen from "./app/screens/OCRResultScreen";
import Colors from "./app/Colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function History() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen
        name="OCRResult"
        component={OCRResultScreen}
        options={{ title: "Result" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = Platform.OS === "ios" ? "ios-home" : "md-home";
              } else if (route.name === "History") {
                iconName =
                  Platform.OS === "ios" ? "ios-bookmark" : "md-bookmark";
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: Colors.Primary,
            inactiveTintColor: "gray",
          }}
        >
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="History" component={History} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
