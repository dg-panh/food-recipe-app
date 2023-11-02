import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const RemoveAllButton = ({ onPress, enabled }) => {
    const [icon, setIcon] = useState("delete-outline");

    const handlePressIn = () => {
        setIcon("delete");
    };

    const handlePressOut = () => {
        setIcon("delete-outline");
    };

    const handleRemoveAll = () => {
        Alert.alert(
            "Remove All Favorites",
            "Are you sure you want to remove all your favorite data?",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                    style: "cancel",
                },
                {
                    text: "Yes, Remove All",
                    onPress: onPress,
                },
            ]
        );
    };

    return enabled ? (
        <View style={styles.deleteAllContainer}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={styles.clearAllButton}
                onPress={handleRemoveAll}
                disabled={!enabled}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Text style={styles.clearAllText}>Remove All Favorites</Text>
                <MaterialIcons
                    name={icon}
                    size={35}
                    color={icon === "delete" ? "red" : "#555"}
                />
            </TouchableOpacity>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    deleteAllContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 15,
        marginRight: 5,
        height: 45,
    },
    clearAllButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    clearAllText: {
        marginRight: 8,
        fontSize: 16,
    },
});

export default RemoveAllButton;
