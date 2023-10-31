import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

export default function WelcomeScreen() {
    const paddingAnimation1 = useSharedValue(0);
    const paddingAnimation2 = useSharedValue(0);

    const navigation = useNavigation();

    useEffect(() => {
        paddingAnimation1.value = 0;
        paddingAnimation2.value = 0;
        setTimeout(() => paddingAnimation1.value = withSpring(paddingAnimation1.value + hp(5)), 100);
        setTimeout(() => paddingAnimation2.value = withSpring(paddingAnimation2.value + hp(5.5)), 300);
    
        setTimeout(() => navigation.navigate('Main'), 2500);
    })

    return (
        <View className="flex-1 justify-center items-center space-y-10 bg-amber-500">
            <StatusBar style='light' />

            <Animated.View className='bg-white/20 rounded-full' style={{ padding: paddingAnimation2 }}>
                <Animated.View className='bg-white/20 rounded-full' style={{ padding: paddingAnimation1 }}>
                    <Image source={require('../../assets/images/welcome.png')}
                        style={{ width: hp(20), height: hp(20) }} />
                </Animated.View>
            </Animated.View>

            <View className='flex items-center space-y-2'>
                <Text className='font-bold text-white tracking-wider' style={{ fontSize: hp(7) }}>
                    Foody
                </Text>
                <Text className='font-medium text-white tracking-wider' style={{ fontSize: hp(2) }}>
                    Food is always right
                </Text>
            </View>
        </View>
    )
}