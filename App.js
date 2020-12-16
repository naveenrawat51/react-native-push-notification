import React, { useEffect } from "react";
import { StyleSheet, Button, Text, View } from "react-native";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

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

  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      })
      .then((statusObj) => {
        if (statusObj.status !== "granted") {
          return;
        }
      });
  }, []);

  useEffect(() => {
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );

    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    return () => {
      foregroundSubscription.remove();
      backgroundSubscription.remove();
    };
  }, []);

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
