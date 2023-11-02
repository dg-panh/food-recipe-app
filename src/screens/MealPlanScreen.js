import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Agenda } from 'react-native-calendars'
import PlanningCard from '../components/planningCard'
import { COLORS, mealPLanList } from '../constants'
import FavCard from '../components/FavCard'
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;

export default function MealPlanScreen({ navigation }) {
    const [mealPlanIds, setMealPlanIds] = useState([]);
    const [mealPlanData, setMealPlanData] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadMealPlan();
        }
    }, [isFocused]);

    async function loadMealPlan() {
        try {
            const storedMealPlan = await AsyncStorage.getItem('dateplan');
            if (storedMealPlan) {
                setMealPlanIds(JSON.parse(storedMealPlan));
                // Fetch meal data corresponding to mealPlanIds
                setMealPlanData(await fetchMealData(mealPlanIds));
            }
        } catch (error) {
            console.error('@Error loading meal plan - Meal plan screen::', error);
        }
    }

    async function removeMealPLan(id) {
        try {
            const updatedMealPlan = mealPlanIds.filter((planId) => planId !== id);
            await AsyncStorage.setItem('dateplan', JSON.stringify(updatedMealPlan));
            setMealPlanIds(updatedMealPlan);
            // Remove the corresponding meal data from mealPlanData
            setMealPlanData(mealPlanData.filter((meal) => meal.idMeal !== id));
        } catch (error) {
            console.error('@Error removing favorite - Meal plan screen::', error);
        }
    }

    async function removeAllPlan() {
        await AsyncStorage.removeItem('dateplan');
        setMealPlanIds([]);
        setMealPlanData([]); // Clear mealPlanData
    }

    async function fetchMealData(ids) {
        const mealDataArray = [];
        for (const id of ids) {
            try {
                const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                if (response && response.data && response.data.meals) {
                    mealDataArray.push(response.data.meals[0]);
                }
            } catch (err) {
                console.error('Error fetching meal data:', err.message);
            }
        }
        return mealDataArray;
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar style='dark' />

            <View style={styles.container}>
                <View className='mx-4 space-y-2 mt-4'>
                    <Text style={{ fontSize: hp(3.8), textAlign: 'center' }} className='font-semibold text-neutral-600'>
                        Meal <Text className='text-amber-500'>Plan</Text>
                    </Text>
                </View>
                <Agenda
                    items={mealPLanList}
                    // loadItemsForMonth={loadItems}
                    selected={currentDate}
                    showOnlySelectedDayItems
                    // hideExtraDays={false}
                    refreshControl={null}
                    showClosingKnob={true}
                    refreshing={false}
                    renderItem={(item, index) => <PlanningCard
                        item={item}
                        remove={removeMealPLan}
                        navigation={navigation}
                    />}
                    renderEmptyData={EmptyDate}
                    rowHasChanged={(r1, r2) => r1.text !== r2.text}
                    theme={{
                        dotColor: COLORS.main,
                        todayTextColor: 'white',
                        todayBackgroundColor: COLORS.green,
                        selectedDayBackgroundColor: COLORS.main,
                    }}
                />
                <StatusBar />
            </View>
        </View>
    )
}

const EmptyDate = () => {
    return (
        <View style={styles.emptyDate}>
            <Text>This is empty date!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    emptyDate: {
        // height: 15,
        flex: 1,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },

});