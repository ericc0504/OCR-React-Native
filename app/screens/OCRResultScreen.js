import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Clipboard,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ServerOperation from "../ServerOperation";
import { TouchableOpacity } from "react-native-gesture-handler";

import Colors from "../Colors";
import Utility from "../Utility";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const imgHeight = deviceHeight * 0.5;
const contentWidth = deviceWidth * 0.9;

export default function OCRResultScreen({ route, navigation }) {
  const [base64, setBase64] = useState(route.params.base64);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!route.params.fullSizeImgReady) {
      getFullSizeImg();
    }
    return () => {};
  }, []);

  const getFullSizeImg = async () => {
    try {
      setIsLoading(true);
      let res = await ServerOperation.getFullSizeImg(route.params.id);
      var base64 = Utility.getBase64FromArray(res.img.data);
      setBase64(base64);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <View>
        {isLoading ? (
          <ActivityIndicator style={styles.loading} color={Colors.Primary} />
        ) : (
          <></>
        )}
        <Image
          source={{ uri: base64 }}
          resizeMode="contain"
          style={styles.img}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          Clipboard.setString(route.params.text);
          alert("Copied");
        }}
      >
        <Text style={styles.helpMsg}>Tap to copy result</Text>
        <Text style={styles.ocrResult}>{route.params.text}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  img: {
    marginTop: 10,
    height: imgHeight,
    width: contentWidth,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "silver",
    borderRadius: 10,
    backgroundColor: "lightgray",
  },
  ocrResult: {
    flex: 1,

    width: contentWidth,
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    overflow: "hidden",
  },
  helpMsg: {
    marginTop: 15,
    marginBottom: 2,
    alignSelf: "center",
    width: contentWidth,
    color: "#808080",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
});
