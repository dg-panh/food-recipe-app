import { View, Text } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default function BadgeIcon({icon, number, unit}) {
    return (
        <View className="flex rounded-full bg-amber-300 p-2">
            <View
                style={{ height: hp(6.5), width: hp(6.5) }}
                className="bg-white rounded-full flex items-center justify-center"
            >
                {icon}
            </View>
            <View className="flex items-center py-2 space-y-1">
                <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
                    {number}
                </Text>
                <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">
                    {unit}
                </Text>
            </View>
        </View>
    )
}