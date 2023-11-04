import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { MagnifyingGlassIcon, XCircleIcon } from 'react-native-heroicons/outline';
import { AntDesign } from "@expo/vector-icons"; // Import AntDesign from Expo vector icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import FavCard from '../components/FavCard';
import Header from '../components/header';
import RemoveAllButton from '../components/RemoveAllButton';
import axios from 'axios';

export default function FavoriteScreen({ navigation }) {
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favMealData, setFavMealData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const isFocused = useIsFocused();
    const [displayedFavorites, setDisplayedFavorites] = useState([]); // Track displayed favorites

    useEffect(() => {
        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]);

    // Update displayedFavorites whenever favMealData or searchText changes
    useEffect(() => {
        if (searchText) {
            // Filter displayed favorites based on search text
            const filteredFavorites = favMealData.filter((meal) =>
                meal.strMeal.toLowerCase().includes(searchText.toLowerCase())
            );
            setDisplayedFavorites(filteredFavorites);
        } else {
            // When search text is empty, display all favorites
            setDisplayedFavorites(favMealData);
        }
    }, [favMealData, searchText]);

    async function loadFavorites() {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const favoriteIdArray = JSON.parse(storedFavorites);
                setFavoriteIds(favoriteIdArray);
                // Fetch meal data corresponding to favoriteIds
                const mealDataArray = await fetchMealData(favoriteIdArray);
                setFavMealData(mealDataArray);
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    }

    async function removeFavorite(id) {
        try {
            const updatedFavorites = favoriteIds.filter((favId) => favId !== id);
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavoriteIds(updatedFavorites);
            // Remove the corresponding meal data from favMealData
            setFavMealData(favMealData.filter((meal) => meal.idMeal !== id));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    }

    async function removeAllDisplayedFavorites() {
        try {
            // Remove the displayed favorites (filtered by search text)
            const updatedFavorites = favoriteIds.filter((favId) => {
                const meal = favMealData.find((m) => m.idMeal === favId);
                return !displayedFavorites.includes(meal);
            });

            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavoriteIds(updatedFavorites);

            // Remove displayed favorites from favMealData
            setFavMealData(favMealData.filter((meal) => !displayedFavorites.includes(meal)));
        } catch (error) {
            console.error('Error removing displayed favorites:', error);
        }
    }

    async function removeAllFavorites() {
        // If search text is empty, remove all favorites as before
        if (searchText === '') {
            await AsyncStorage.removeItem('favorites');
            setFavoriteIds([]);
            setFavMealData([]);
        } else {
            // Remove only the displayed favorites
            removeAllDisplayedFavorites();
        }
    }

    async function fetchMealData(ids) {
        const mealDataArray = [];
        for (const id of ids) {
            try {
                const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                if (response && response.data && response.data.meals) {
                    mealDataArray.push(response.data.meals[0]);
                }
            } catch (err) {
                console.error('Error fetching meal data:', err.message);
            }
        }
        return mealDataArray;
    }

    const handleSearchChange = (text) => {
        setSearchText(text);
    };

    const clearSearchText = () => {
        setSearchText('');
    };

    const enabled =
        (searchText === '' && favoriteIds.length > 1) ||
        (searchText !== '' && displayedFavorites.length > 1);

    const removeAllBtnText =
        (searchText === '' && favoriteIds.length > 1) ? "Remove All Favorites" :
        (searchText !== '' && displayedFavorites.length > 1) ? "Remove Searched Favorites" : "Remove All";

    const isSearching = searchText.length > 0;

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="space-y-6 pt-14"
            >
                <Header />
                <View className="mx-4 space-y-2 mb-2">
                    <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-amber-500">
                        Favorite <Text className="text-neutral-600">Collection</Text>
                    </Text>
                </View>
                <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
                    <TextInput
                        placeholder="Search any recipe"
                        placeholderTextColor="gray"
                        style={{ fontSize: hp(1.7) }}
                        className="flex-1 text-base mb-1 pl-3 tracking-wider"
                        onChangeText={handleSearchChange}
                        value={searchText}
                    />
                    {isSearching && (
                        <TouchableOpacity onPress={clearSearchText} style={{ marginRight: 10 }}>
                            <XCircleIcon size={hp(4.5)} strokeWidth={2} color="gray" />
                        </TouchableOpacity>
                    )}
                    <View className="bg-white rounded-full p-3">
                        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                    </View>
                </View>
                <RemoveAllButton enabled={enabled} onPress={removeAllFavorites} text={removeAllBtnText}/>
                <ScrollView showsVerticalScrollIndicator={true}>
                    {displayedFavorites.length === 0 ? (
                        <View style={styles.noResultContainer}>
                            <AntDesign name="folderopen" size={48} color="black" />
                            <Text style={styles.noResultText}>
                                No favorite recipes found.
                            </Text>
                        </View>
                    ) : (
                        displayedFavorites.map((meal) => (
                            <FavCard
                                key={meal.idMeal}
                                mealData={meal}
                                remove={removeFavorite}
                                navigation={navigation}
                            />
                        ))
                    )}
                </ScrollView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    noResultContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    noResultText: { marginTop: 10, fontSize: 18 },
});
