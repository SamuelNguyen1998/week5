import React from 'react'
import { View, Text } from 'react-native'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import NewsScreen from './screens/NewsScreen'
import PublishersScreen from './screens/PublishersScreen';

const AppNavigator = createStackNavigator({
  News: {
    screen: NewsScreen,
    navigationOptions: {
      header: null
    }
  },
  Publishers: {
    screen: PublishersScreen,
    navigationOptions: {
      title: 'Publishers'
    }
  }
});

export default createAppContainer(AppNavigator);
