import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import dataFormat from "dateformat";

import ServerOperation from "../ServerOperation";
import Colors from "../Colors";

export default function HistoryScreen({
  navigation,
  ocrResults,
  setOcrResults,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCenterLoading, setShowCenterLoading] = useState(false);

  useEffect(() => {
    setShowCenterLoading(true);
    getData();
    return () => {
      setOcrResults([]);
      setShowCenterLoading(false);
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
        setShowCenterLoading(false);
      }
    } catch (err) {
      console.log(err);
      alert("Error occuured when getting previous ocr result");
    }
  }

  return (
    <View styles={styles.mainContainer}>
      {showCenterLoading ? (
        <ActivityIndicator style={styles.loading} color={Colors.Primary} />
      ) : (
        <></>
      )}
      <FlatList
        style={{ height: "100%" }}
        data={ocrResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={getListViewItemSeparator}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.Primary}
          />
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
