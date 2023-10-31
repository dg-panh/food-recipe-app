import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import RecipeDetailScreen from "../screens/RecipeDetailScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeartIcon, HomeIcon, PencilSquareIcon, UserGroupIcon, UserIcon } from "react-native-heroicons/solid";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS } from "../constants";
import FavoriteScreen from "../screens/FavoriteScreen";
import CommunityScreen from "../screens/CommunityScreen";
import MealPlanScreen from "../screens/MealPlanScreen";

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Main" component={BottomNavigator} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="RecipeDetail" options={{presentation: 'fullScreenModal'}} component={RecipeDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

function BottomNavigator() {
    return (
        <BottomTabs.Navigator 
            initialRouteName='Home' 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.main,
                tabBarStyle: {
                    borderTopColor: 'transparent',
                    height: hp(8)
                }
            }}
        >
            <BottomTabs.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel:"",
                    tabBarIcon: ({ color, size }) => (
                        <HomeIcon size={size} color={color}></HomeIcon>
                    ),
                }}
            ></BottomTabs.Screen>
            <BottomTabs.Screen
                name="Favorite"
                component={FavoriteScreen}
                options={{
                    tabBarLabel:"",
                    tabBarIcon: ({ color, size }) => (
                        <HeartIcon size={size} color={color}></HeartIcon>
                    ),
                }}
            ></BottomTabs.Screen>
            <BottomTabs.Screen
                name="Community"
                component={CommunityScreen}
                options={{
                    tabBarLabel:"",
                    tabBarIcon: ({ color, size }) => (
                        <UserGroupIcon size={size} color={color}></UserGroupIcon>
                    ),
                }}
            ></BottomTabs.Screen>
            <BottomTabs.Screen
                name="Plan"
                component={MealPlanScreen}
                options={{
                    tabBarLabel:"",
                    tabBarIcon: ({ color, size }) => (
                        <PencilSquareIcon size={size} color={color}></PencilSquareIcon>
                    ),
                }}
            ></BottomTabs.Screen>
        </BottomTabs.Navigator>
    )
}