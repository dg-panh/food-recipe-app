import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { ChevronLeftIcon, ClockIcon, FireIcon, PlusIcon } from 'react-native-heroicons/outline'
import { HeartIcon, Square3Stack3DIcon, UserIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from '../components/loading'
import { COLORS } from '../constants'
import BadgeIcon from '../components/badgeIcon'
import YoutubeIframe from 'react-native-youtube-iframe'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'


const MISC = [
    {
        icon: <ClockIcon size={hp(4)} strokeWidth={2.5} color={COLORS.gray} />,
        number: '35',
        unit: 'Mins',
    },
    {
        icon: <UserIcon size={hp(4)} strokeWidth={2.5} color={COLORS.gray} />,
        number: '03',
        unit: 'Servings',
    },
    {
        icon: <FireIcon size={hp(4)} strokeWidth={2.5} color={COLORS.gray} />,
        number: '103',
        unit: 'Cal',
    },
    {
        icon: <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color={COLORS.gray} />,
        number: ' ',
        unit: 'Easy',
    },
]

export default function RecipeDetailScreen(props) {
    let item = props.route.params;
    //console.log('@meal detail:: ', item)
    const [isFav, setIsFav] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    //console.log('@meal detail:: ', meal)
    const [isLoading, setIsLoading] = useState(true);

    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [mode, setMode] = useState('date');

    useEffect(() => {
        getMealDetail(item.idMeal);
        loadFavoriteState();
    }, [])

    const loadFavoriteState = async () => {
        try {
            const favorites = await AsyncStorage.getItem("favorites");
            if (favorites) {
                const parsedFavorites = JSON.parse(favorites);
                // Check if the current meal is in the favorites list
                if (parsedFavorites.includes(props.route.params.idMeal)) {
                    setIsFav(true);
                }
            }
            console.log('Favorite state loaded in get:', favorites);
        } catch (error) {
            console.error("Error loading favorite state:", error);
        }
    };
    
    const toggleFavorite = async () => {
        // Toggle the favorite state
        setIsFav(!isFav);

        try {
            const favorites = await AsyncStorage.getItem("favorites");
            let updatedFavorites = [];
            if (favorites) {
                updatedFavorites = JSON.parse(favorites);
            }

            // Update the list of favorite meal IDs
            if (isFav) {
                updatedFavorites = updatedFavorites.filter(
                    (id) => id !== props.route.params.idMeal
                );
            } else {
                updatedFavorites.push(props.route.params.idMeal);
            }

            // Save the updated list back to AsyncStorage
            await AsyncStorage.setItem(
                "favorites",
                JSON.stringify(updatedFavorites)
            );
            console.log('Favorite state loaded in toggle:', updatedFavorites);

        } catch (error) {
            console.error("Error updating favorite state:", error);
        }
    };
    
    const getMealDetail = async (id) => {
        try {
            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            // console.log('@meal detail:: ', response.data)
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setIsLoading(false);
            }
        } catch (err) {
            console.log('@error-getMealDetail in RecipeDetail:: ', err.message);
        }
    }

    const ingredientsIndexes = (meal) => {
        if (!meal) return [];
        let indexes = [];
        for (let i = 1; i <= 20; i++) {
            if (meal[`strIngredient${i}`]) {
                indexes.push(i);
            }
        }

        return indexes;
    }

    const getYoutubeVideoId = (url) => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    const handleOpenLink = (url) => {
        Linking.openURL(url);
    }

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowDate(false);
        setDate(currentDate);
        console.log("Current Date: " + currentDate)
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChangeDate,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        setShowDate(true);
        showMode('date');
    };

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

            <View className='w-full absolute flex-row justify-between items-start pt-12'>
                <TouchableOpacity onPress={() => navigation.goBack()} className='p-2 rounded-full ml-5 bg-white'>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color={'#fbbf24'} />
                </TouchableOpacity>
                <View>
                    <TouchableOpacity onPress={toggleFavorite} className='p-2 rounded-full mr-5 bg-white'>
                        <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFav ? 'red' : 'gray'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showDatepicker} className='p-2 rounded-full mr-5 mt-5 bg-white'>
                        <PlusIcon size={hp(3.5)} strokeWidth={4.5} color='#fbbf24' />
                    </TouchableOpacity>                    
                </View>
            </View>

            {/* meal description */}
            {isLoading ? (
                <Loading size='large' className='mt-16' />
            ) : (
                <View className="px-4 flex justify-between space-y-4 pt-8">

                    {/* name and area */}
                    <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className="space-y-2">
                        <Text style={{ fontSize: hp(3) }} className="font-bold flex-1 text-neutral-700">
                            {meal?.strMeal}
                        </Text>
                        <Text style={{ fontSize: hp(2) }} className="font-medium flex-1 text-neutral-500">
                            {meal?.strArea}
                        </Text>
                    </Animated.View>

                    {/* misc */}
                    <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className="flex-row justify-around">
                        {MISC.map((item, index) =>

                            <BadgeIcon
                                key={index}
                                icon={item.icon}
                                number={item.number}
                                unit={item.unit}
                            />

                        )}

                    </Animated.View>

                    {/* ingredients */}
                    <View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} className="space-y-4">
                        <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
                            Ingredients
                        </Text>
                        <View className="space-y-2 ml-3">
                            {
                                ingredientsIndexes(meal).map(i => {
                                    return (
                                        <View key={i} className="flex-row space-x-4">
                                            <View style={{ height: hp(1.5), width: hp(1.5) }}
                                                className="bg-amber-300 rounded-full" />
                                            <View className="flex-row space-x-2">
                                                <Text style={{ fontSize: hp(1.7) }} className="font-extrabold text-neutral-700">{meal['strMeasure' + i]}</Text>
                                                <Text style={{ fontSize: hp(1.7) }} className="font-medium text-neutral-600">{meal['strIngredient' + i]}</Text>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>

                    {/* instructions */}
                    <View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
                        <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
                            Instructions
                        </Text>
                        <Text style={{ fontSize: hp(1.6) }} className="text-neutral-700">
                            {
                                meal?.strInstructions
                            }
                        </Text>
                    </View>

                    {/* recipe video */}
                    {
                        meal.strYoutube && (
                            <Animated.View entering={FadeInDown.delay(400).duration(700).springify().damping(12)} className="space-y-4">
                                <Text style={{ fontSize: hp(2.5) }} className="font-bold flex-1 text-neutral-700">
                                    Recipe Video
                                </Text>
                                <View>
                                    {
                                        Platform.OS == 'ios' || Platform.OS == 'android' ? (
                                            <YoutubeIframe
                                                webViewProps={{
                                                    overScrollMode: "never" // a fix for webview on android - which didn't work :(
                                                }}
                                                videoId={getYoutubeVideoId(meal.strYoutube)}
                                                height={hp(30)}
                                            />
                                        ) : (
                                            <TouchableOpacity className="mb-5" onPress={() => handleOpenLink(meal.strYoutube)}>
                                                <Text className="text-blue-600" style={{ fontSize: hp(2) }}>{meal.strYoutube}</Text>
                                            </TouchableOpacity>

                                        )
                                    }

                                </View>
                            </Animated.View>
                        )
                    }

                </View>
            )}
        </ScrollView>
    )
}