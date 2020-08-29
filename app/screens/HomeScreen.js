import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";

import CameraScreen from "./CameraScreen";
import Colors from "../Colors";

const deviceWidth = Dimensions.get("window").width;
const imgDimension = deviceWidth * 0.8;

export default function HomeScreen({ navigation }) {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isPhotoReady, setIsPhotoReady] = useState(false);
  const [imgBase64, setImgBase64] = useState(null);

  const onCapture = (result) => {
    if (result) {
      setImgBase64(result.base64);
      setIsPhotoReady(true);
    }
    setIsCameraVisible(false);
  };

  const getImgUri = () => {
    return "data:image/jpg;base64," + imgBase64;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        {!isPhotoReady ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setIsCameraVisible(true);
            }}
          >
            <View style={styles.captureImgContainer}>
              <Ionicons
                name={Platform.OS === "ios" ? "ios-camera" : "ios-camera"}
                size={64}
                color="dimgray"
              />
              <Text style={{ color: "grey" }}>Take a picture to proceed</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Image
              source={{ uri: getImgUri() }}
              resizeMode="contain"
              style={{ height: "80%", width: imgDimension }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                marginTop: 20,
              }}
            >
              <Button
                title="Retake"
                buttonStyle={styles.btn}
                onPress={() => setIsCameraVisible(true)}
              ></Button>
              <Button title="Submit" buttonStyle={styles.btn}></Button>
            </View>
          </View>
        )}
      </View>

      <Modal visible={isCameraVisible} animationType="slide">
        <CameraScreen onCapture={onCapture} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureImgContainer: {
    height: imgDimension,
    width: imgDimension,
    borderWidth: 4,
    borderColor: "#d3d3d3",
    borderRadius: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "aliceblue",
  },
  btn: {
    backgroundColor: Colors.Secondary,
    paddingHorizontal: 15,
  },
});
