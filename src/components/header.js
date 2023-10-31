import { View, Text, Image } from 'react-native'
import React from 'react'
import { BellIcon } from 'react-native-heroicons/outline'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'


export default function Header() {
    return (
        <View className='mx-4 flex-row justify-between items-center mb-2'>
            <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(5), width: hp(5) }} />
            <BellIcon size={hp(4)} color='gray' />
        </View>
    )
}