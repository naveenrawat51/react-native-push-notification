import React, { useEffect, useState } from "react";
import { StyleSheet, Button, View } from "react-native";

import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
  }),
});

export default function App() {
  const [pushToken, setPushToken] = useState();

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

  const triggerPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: pushToken,
        data: { extraData: "Some Data" },
        title: "sent using my app",
        body: "This push notification was sent using my app!!",
      }),
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
          throw new Error("Permission not granted!!");
        }
      })
      .then(() => Notifications.getExpoPushTokenAsync())
      .then((response) => {
        setPushToken(response.data);
      })
      .catch((err) => null);
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
        title="Trigger local Notification"
        onPress={triggerNotificationHandler}
      />
      <View>
        <Button
          title="Trigger Push Notification"
          onPress={triggerPushNotificationHandler}
        />
      </View>
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
