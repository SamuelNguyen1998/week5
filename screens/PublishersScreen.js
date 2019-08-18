import React from "react";
import { View, Text, ScrollView } from "react-native";

const PublishersScreen = props => {
  const publishers = [];
  const publishedCount = [];

  props.navigation.state.params.forEach(article => {
    const newPublisher = article.source.name;
    const indexOfNewPublisher = publishers.indexOf(newPublisher);
    if (indexOfNewPublisher != -1) {
      
      publishedCount[indexOfNewPublisher] += 1;
    } else {
      publishers.push(newPublisher);
      publishedCount.push(1);
    }
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingVertical: 20, paddingLeft: 20 }}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 3, alignItems: 'center' }}>
            <Text style={{fontWeight: 'bold'}}>Publishers</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center'  }}>
            <Text style={{fontWeight: 'bold'}}>Published articles</Text>
          </View>
        </View>
        {publishers.map((publisher, index) => {
          return (
            <View style={{ flexDirection: "row" }} key={index}>
              <View style={{ flex: 3 }}>
                <Text>{publisher}</Text>
              </View>
              <View style={{ flex: 2, alignItems: 'center'  }}>
                <Text>{publishedCount[index]}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default PublishersScreen;
