import { View, Text, StatusBar, ScrollView } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function MealPlanScreen() {
    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style='dark' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className='space-y-6 pt-14'
            >
                <View className='mx-4 space-y-2 mb-2'>
                    <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
                        Meal <Text className='text-amber-500'>Plan</Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}