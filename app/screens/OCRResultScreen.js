import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Clipboard,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import ServerOperation from "../ServerOperation";
import { TouchableOpacity } from "react-native-gesture-handler";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const imgHeight = deviceHeight * 0.5;
const contentWidth = deviceWidth * 0.9;

export default function OCRResultScreen({ route, navigation }) {
  const [base64, setBase64] = useState(/*route.params.base64*/);
  useEffect(() => {
    getFullSizeImg();
    return () => {};
  }, []);

  const getFullSizeImg = async () => {
    try {
      let res = await ServerOperation.getFullSizeImg(route.params.id);
      var base64 = "data:image/jpg;base64,";
      var chunk = 8 * 1024;
      let i;
      for (i = 0; i < res.img.data.length / chunk; i++) {
        base64 += String.fromCharCode.apply(
          null,
          res.img.data.slice(i * chunk, (i + 1) * chunk)
        );
      }
      base64 += String.fromCharCode.apply(null, res.img.data.slice(i * chunk));
      setBase64(base64);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      <Image source={{ uri: base64 }} resizeMode="contain" style={styles.img} />
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
});
