import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import StepsScreen from './src/screens/StepsScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#fff',
                        },
                        headerTintColor: '#000',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ title: 'Step by Step' }}
                    />
                    <Stack.Screen
                        name="Steps"
                        component={StepsScreen}
                        options={({ route }) => ({ title: route.params?.taskTitle || 'Steps' })}
                    />
                    <Stack.Screen
                        name="History"
                        component={HistoryScreen}
                        options={{ title: 'Past Assignments' }}
                    />
                </Stack.Navigator>
                <StatusBar style="auto" />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
