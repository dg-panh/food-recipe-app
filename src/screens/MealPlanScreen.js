import React, { useEffect, useState } from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Agenda } from "react-native-calendars";
import PlanningCard from "../components/planningCard";
import { COLORS } from "../constants";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let currentDate = new Date().toISOString().split('T')[0]; //2023-11-04. get current date 
export default function MealPlanScreen({ navigation }) {
    const [mealPlanData, setMealPlanData] = useState({});
    const [activeDate, setActiveDate] = useState(currentDate);
    const [agendaKey, setAgendaKey] = useState(-1);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            loadMealPlan();
        }
    }, [isFocused]);

    useEffect(() => {
        console.log("Updated mealPlanData: ", mealPlanData);
    }, [mealPlanData]);
    async function loadMealPlan() {
        try {
            const storedMealPlan = await AsyncStorage.getItem("mealPlanList");
            if (storedMealPlan) {
                setMealPlanData(JSON.parse(storedMealPlan));
            }
        } catch (error) {
            console.error(
                "@Error loading meal plan - Meal plan screen::",
                error
            );
        }
    }

    async function removeMealFromDay(date, mealId) {
        try {
            console.log("To be deleted: ", date, ": id:", mealId);
            const updatedMealPlan = { ...mealPlanData };
            console.log("Old mealPlanData: ", mealPlanData);
            if (updatedMealPlan[date]) {
                updatedMealPlan[date] = updatedMealPlan[date].filter(
                    (meal) => meal !== mealId
                );
                if (updatedMealPlan[date].length === 0) {
                    delete updatedMealPlan[date];
                }
                await AsyncStorage.setItem("mealPlanList", JSON.stringify(updatedMealPlan))
                setMealPlanData(updatedMealPlan);
                setAgendaKey((prevKey) => prevKey = -prevKey);
            }
        } catch (error) {
            console.error(
                "@Error removing meal from meal plan - Meal plan screen::",
                error
            );
        }
    }

    async function removeAllPlan() {
        await AsyncStorage.removeItem("mealPlanList");
        setMealPlanData({});
    }


    return (
        <View className="flex-1 bg-white">
            <StatusBar style='dark' />

            <View style={styles.container}>
                <View className="mx-4 space-y-2 mt-4">
                    <Text
                        style={{ fontSize: hp(3.8), textAlign: "center" }}
                        className="font-semibold text-neutral-600"
                    >
                        Meal <Text className="text-amber-500">Plan</Text>
                    </Text>
                </View>
                <Agenda
                    key={agendaKey}
                    items={mealPlanData}
                    // loadItemsForMonth={loadItems}
                    selected={activeDate}
                    showOnlySelectedDayItems
                    // hideExtraDays={false}
                    refreshControl={null}
                    showClosingKnob={true}
                    refreshing={false}
                    onDayPress={(date) => {setActiveDate(date.dateString)}}
                    renderItem={(item) => (
                        <PlanningCard
                            key={item}
                            item={item}
                            date={activeDate}
                            remove={removeMealFromDay}
                            navigation={navigation}
                        />
                    )}
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
            <Text>This is an empty date!</Text>
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