import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Camera } from "expo-camera";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const camera = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const capture = async () => {
    if (cameraReady && !capturing) {
      // TODO: Add vibration
      setCapturing(true);
      let image = await camera.current.takePictureAsync({
        base64: true,
      });
      props.onCapture(image);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={Camera.Constants.Type.back}
        ref={camera}
        onCameraReady={() => setCameraReady(true)}
      >
        <SafeAreaView style={{ backgroundColor: "transparent", flex: 1 }}>
          <View style={styles.mainContainer}>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={props.onCapture}
              style={[styles.closeBtn]}
            >
              <Ionicons name="ios-close" size={60} color="white" />
            </TouchableOpacity>
            <View style={styles.centerPadding} />
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={capture}
              style={[styles.captureBtn]}
            >
              <Ionicons name="ios-radio-button-on" size={80} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "flex-start",
    flex: 1,
  },
  closeBtn: {
    marginLeft: 20,
  },
  centerPadding: {
    flex: 1,
  },
  captureBtn: {
    alignSelf: "center",
  },
});
