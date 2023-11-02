import { View, Text, StatusBar, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Agenda } from 'react-native-calendars'
import PlanningCard from '../components/planningCard'
import { mealPLanList } from '../constants'

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
}

export default function MealPlanScreen() {
    const [items, setItems] = React.useState({});

    const loadItems = (day) => {

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(10, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }
            const newItems = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems);
        }, 1000);
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.item}>
                <View>
                    <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
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
                    items={items}
                    loadItemsForMonth={loadItems}
                    selected={'2022-07-07'}
                    refreshControl={null}
                    showClosingKnob={true}
                    refreshing={false}
                    renderItem={renderItem}
                />
                <StatusBar />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
});