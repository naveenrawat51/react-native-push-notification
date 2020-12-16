import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import * as Notifications from "expo-notifications";

export default function App() {
  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: "Open the notification to read them all",
        sound: "email-sound.wav", // <- for Android below 8.0
      },
      trigger: {
        seconds: 5,
      },
    });
  };
  return (
    <View style={styles.container}>
      <Button
        title="Trigger Notification"
        onPress={triggerNotificationHandler}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
