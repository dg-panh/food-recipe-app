import { View, Text, ScrollView, StatusBar, TextInput } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Header from '../components/header'


export default function CommunityScreen() {
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
                    <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
                        Community
                    </Text>
                    <Text style={{ fontSize: hp(3.8) }} className='font-semibold text-neutral-600'>
                        of <Text className='text-amber-500'>cooking lovers</Text>
                    </Text>
                </View>

                <View className='mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]'>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor={'gray'}
                        style={{ fontSize: hp(1.7) }}
                        className='flex-1 text-base mb-1 pl-3 tracking-wider'
                    />
                    <View className='bg-white rounded-full p-3'>
                        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color={'gray'} />
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}