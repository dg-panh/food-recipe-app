import { View, Text, ScrollView, StatusBar, TextInput } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

import Header from '../components/header'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import FavCard from '../components/FavCard'

const idArray = ["52874"];

export default function FavoriteScreen({navigation}) {

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style='dark' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className='space-y-6 pt-14'
            >
                <Header />

                <View className='mx-4 space-y-2 mb-2'>
                    <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-amber-500 '>
                        Favorite <Text className='text-neutral-600'>Collection</Text>
                    </Text>
                </View>

                <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
                    <TextInput
                        placeholder='Search any recipe'
                        placeholderTextColor={'gray'}
                        style={{ fontSize: hp(1.7) }}
                        className='flex-1 text-base mb-1 pl-3 tracking-wider'
                    />
                    <View className='bg-white rounded-full p-3'>
                        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color={'gray'} />
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={true}
                >
                    {idArray.map((mealId, index) => (
                        <FavCard key={index} mealId={mealId} navigation={navigation} />
                    ))}
                </ScrollView>
            </ScrollView>

        </View>
    )
}