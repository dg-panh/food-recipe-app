import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import FavCard from '../components/FavCard';
import Header from '../components/header';
import RemoveAllButton from '../components/RemoveAllButton';


export default function FavoriteScreen({ navigation }) {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const isFocused = useIsFocused(); 

    useEffect(() => {
        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]); 

    async function loadFavorites() {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const favoriteIdArray = JSON.parse(storedFavorites);
                setFavoriteIds(favoriteIdArray);
            }
            console.log("reload favscreen - focused")
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }

    async function removeFavorite(id) {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const favoriteIdArray = JSON.parse(storedFavorites);
                const updatedFavorites = favoriteIdArray.filter(favId => favId !== id);

                await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                setFavoriteIds(updatedFavorites);
                console.log("favorite id remove in favscreen: ", updatedFavorites);
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    }

    const removeAllFavorites = async () => {
        await AsyncStorage.removeItem('favorites');
        setFavoriteIds([]);
    };

    const enabled = favoriteIds.length > 1;


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

                <RemoveAllButton enabled={enabled} onPress={removeAllFavorites} />

                <ScrollView showsVerticalScrollIndicator={true}>
                    {favoriteIds.map((mealId) => (
                        <FavCard key={mealId} mealId={mealId} removeFavorite={removeFavorite} navigation={navigation} />
                    ))}
                </ScrollView>
            </ScrollView>
        </View>
    );
}
