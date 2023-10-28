import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ChevronLeftIcon } from 'react-native-heroicons/outline'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '../components/loading'

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    // console.log('@meal detail:: ', item)
    const [isFav, setIsFav] = useState(false);
    const navigation = useNavigation();
    const [detail, setDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getMealDetail(item.idMeal);
    })

    const getMealDetail = async (id) => {
        try {
            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            // console.log('@meal detail:: ', response.data)
            if (response && response.data) {
                setDetail(response.data.meals[0]);
                setIsLoading(false);
            }
        } catch (err) {
            console.log('@error:: ', err.message);
        }
    }

    return (
        <ScrollView
            className='bg-white flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <StatusBar style='light' />
            <View className='flex-row justify-center'>
                <Image
                    source={{ uri: item.strMealThumb }}
                    style={{ width: wp(98), height: hp(50), borderRadius: 37, borderBottomRightRadius: 40, borderBottomLeftRadius: 40, marginTop: 4 }}
                />
            </View>

            <View className='w-full absolute flex-row justify-between items-center pt-12'>
                <TouchableOpacity onPress={() => navigation.goBack()} className='p-2 rounded-full ml-5 bg-white'>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#fbbf24'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsFav(!isFav)} className='p-2 rounded-full mr-5 bg-white'>
                    <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFav ? 'red' : 'gray'} />
                </TouchableOpacity>
            </View>

            {/* meal description */}
            {isLoading ? (
                <Loading size='large' className='mt-16' />
            ) : (
                <View className="px-4 flex justify-between space-y-4 pt-8">
                    <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className="space-y-2">
                        <Text style={{ fontSize: hp(3) }} className="font-bold flex-1 text-neutral-700">
                            {detail?.strMeal}
                        </Text>
                        <Text style={{ fontSize: hp(2) }} className="font-medium flex-1 text-neutral-500">
                            {detail?.strArea}
                        </Text>
                    </Animated.View>
                </View>

            )}
        </ScrollView>
    )
}