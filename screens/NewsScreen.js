import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Linking,
  TextInput
} from "react-native";
import Constants from "expo-constants";

import CardFullScreen from "../components/CardFullScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const onPress = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  });
};

const renderArticleItem = ({ item }) => {
  return (
    <CardFullScreen>
      <View style={{ flex: 3, paddingHorizontal: 15, paddingTop: 10 }}>
        <View style={{ flex: 1, paddingVertical: 5 }}>
          <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
        </View>
        <View style={{ flex: 4 }}>
          <Image
            source={{ uri: item.urlToImage }}
            style={{ width: null, height: null, flex: 1 }}
            resizeMode="contain"
          />
        </View>
      </View>
      <View style={{ flex: 2, paddingHorizontal: 10, paddingTop: 5 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Source: </Text>
          <Text>{item.source.name}</Text>
        </View>
        <View style={{ flex: 5 }}>
          <Text>{item.content}</Text>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 10, paddingBottom: 5 }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>Published: </Text>
          <Text>{item.publishedAt}</Text>
        </View>
        <View style={{ flex: 2, padding: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 10,
              backgroundColor: "#0e83b5",
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => onPress(item.url)}
          >
            <Text style={{ color: "white" }}>Read more</Text>
          </TouchableOpacity>
        </View>
      </View>
    </CardFullScreen>
  );
};

const filterForUniqueArticles = arr => {
  const cleaned = [];
  arr.forEach(itm => {
    let unique = true;
    cleaned.forEach(itm2 => {
      const isEqual = JSON.stringify(itm) === JSON.stringify(itm2);
      if (isEqual) unique = false;
    });
    if (unique) cleaned.push(itm);
  });
  return cleaned;
};

export default function NewsScreen(props) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);
 
  const [searchInput, setSearchInput] = useState("");
  const [renderArticles, setRenderArticles] = useState([]);

  const getNews = async () => {
    if (searchInput === "") {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&apiKey=909cb74d18144138b053146f9c8f4cd4&pageSize=10&page=${pageNumber}`
        );
        const jsonData = await response.json();

        const hasMoreArticles = jsonData.articles.length > 0;
        if (hasMoreArticles) {
          const newArticleList = filterForUniqueArticles(
            articles.concat(jsonData.articles)
          );
          setArticles(newArticleList);
          setRenderArticles(newArticleList);
          setPageNumber(pageNumber + 1);
        } else {
          setLastPageReached(true);
        }
      } catch (error) {
        setHasApiError(true);
      }
      setLoading(false);
    }
  };

  const handleSearch = input => {
    setSearchInput(input);
    if (input !== "") {
      const newRenderArticles = articles.filter(article => {
        return article.title.toLowerCase().includes(input.toLowerCase());
      });
      setRenderArticles(newRenderArticles);
    } else {
      setRenderArticles(articles);
    }
  };

  const renderFooter = () => {
    if (searchInput === "") {
      if (lastPageReached) {
        return (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text>No more articles</Text>
          </View>
        );
      } else {
        return <ActivityIndicator size="large" loading={loading} />;
      }
    } else {
      return(
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Clear the search to read more news</Text>
        </View>
      )
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" loading={loading} />
        <Text>Getting news</Text>
      </View>
    );
  }

  if (hasErrored) {
    return (
      <View style={styles.container}>
        <Text>{hasErrored}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Text>Articles Count: </Text>
          <Text>{articles.length}</Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: "#475178", padding: 5, borderRadius: 5 }}
          onPress={() => props.navigation.navigate("Publishers", articles)}
        >
          <Text style={{ color: "white" }}>Publishers</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: "100%",
          height: 40,
          flexDirection: "row",
          paddingVertical: 5,
          paddingHorizontal: 10,
          borderColor: "grey",
          borderWidth: 1,
          backgroundColor: "white"
        }}
      >
        <MaterialCommunityIcons name="search-web" size={30} color="black" />
        <TextInput
          inlineImageLeft="../../assets/icon.png"
          style={{ width: "85%", height: 30, marginLeft: 5 }}
          placeholder="search..."
          value={searchInput}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={renderArticles}
        renderItem={renderArticleItem}
        keyExtractor={item => item.title}
        onEndReached={getNews}
        onEndReachedThreshold={1}
        ListFooterComponent={renderFooter}
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
    marginTop: Constants.statusBarHeight,
    padding: 10
  },
  header: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "grey",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'grey'
  },
  box: {
    height: 200,
    width: 200,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10
  }
});
