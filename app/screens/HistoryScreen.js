import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import dataFormat from "dateformat";

import ServerOperation from "../ServerOperation";

export default function HistoryScreen({
  navigation,
  ocrResults,
  setOcrResults,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const [ocrResults, setOcrResults] = useState([]);
  useEffect(() => {
    getData();
    return () => {
      setOcrResults([]);
    };
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="silver"
        onPress={async () => {
          navigation.push("OCRResult", item);
        }}
      >
        <View style={styles.rowViewContainer}>
          <View
            style={{
              borderColor: "darkgray",
              borderWidth: 1,
              borderRadius: 10,
            }}
          >
            <Image
              style={{
                height: 64,
                width: 64,
                borderRadius: 10,
              }}
              source={{
                uri: item.base64,
              }}
            />
          </View>

          <Text style={{ paddingLeft: 15, alignSelf: "center", fontSize: 16 }}>
            {dataFormat(new Date(item.createdAt), "yyyy-mm-dd HH:MM:ss")}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  function getListViewItemSeparator() {
    return (
      <View
        style={{
          height: 1,
          width: "90%",
          backgroundColor: "#808080",
        }}
      />
    );
  }

  function onRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      getData();
      setIsRefreshing(false);
    }, 1000);
  }

  async function getData() {
    try {
      let res = await ServerOperation.getPreviousOcrResult();
      if (res) {
        res.map((x) => {
          x.id = x._id;
          x.base64 =
            "data:image/jpg;base64," +
            String.fromCharCode.apply(null, x.thumbnail.data);
        });
        setOcrResults(res);
      }
    } catch (err) {
      console.log(err);
      alert("Error occuured when getting previous ocr result");
    }
  }

  return (
    <View styles={styles.mainContainer}>
      <FlatList
        style={{ height: "100%" }}
        data={ocrResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={getListViewItemSeparator}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        enableEmptySections={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  rowViewContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
  },
});
