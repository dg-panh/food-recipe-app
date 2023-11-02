import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "./loading";
import axios from "axios";

export default function PlanningCard({ item, remove, navigation }) {
    const [icon, setIcon] = useState("delete-outline");
    const [mealData, setMealData] = useState();
    const pressTimeout = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

    // console.log(`@id:: ${item}`)

    useEffect(() => {
        getMealDetail(item);
    }, [])

    const getMealDetail = async (id) => {
        try {
            const response = await axios.get(`https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            // console.log('@meal detail:: ', response.data)
            if (response && response.data) {
                setMealData(response.data.meals[0]);
                setIsLoading(false);
            }
        } catch (err) {
            console.log('@error-getMealDetail - planningCard:: ', err.message);
        }
    }

    const handlePressIn = () => {
        pressTimeout.current = setTimeout(() => {
            setIcon("delete");
        }, 100);
    };

    const handlePressOut = () => {
        clearTimeout(pressTimeout.current);
        setIcon("delete-outline");
    };

    const showDeleteAlert = () => {
        setIcon("delete");
        Alert.alert(
            "Delete Meal",
            `Are you sure you want to delete ${mealData.strMeal}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => setIcon("delete-outline"),
                },
                {
                    text: "Delete",
                    onPress: () => remove(mealData.idMeal),
                    style: "destructive",
                },
            ]
        );
    };

    const handlePress = () => {
        navigation.navigate("RecipeDetail", mealData);
    };

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            {isLoading ? (<Loading size='large' className='mt-16' />) : (
                <View style={styles.card}>
                    <Image
                        source={{ uri: mealData.strMealThumb }}
                        style={styles.image}
                    />
                    <View style={styles.cardContent}>
                        <Text style={styles.title}>{mealData.strMeal}</Text>
                        <Text style={styles.category}>{mealData.strCategory}</Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={[
                            styles.deleteButton,
                            {
                                backgroundColor:
                                    icon === "delete-outline" ? "white" : "red",
                            },
                        ]}
                        onPress={showDeleteAlert}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    >
                        <MaterialIcons
                            name={icon}
                            size={icon === "delete" ? 40 : 35}
                            color={icon === "delete-outline" ? "red" : "white"}
                        />
                    </TouchableOpacity>
                </View>
            )}

        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        margin: 10,
        overflow: "hidden",
        height: 100,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    cardContent: {
        flex: 1,
        padding: 10,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    category: {
        fontSize: 14,
        color: "black",
    },
    deleteButton: {
        padding: 10,
        height: 100,
        justifyContent: "center",
    },
});