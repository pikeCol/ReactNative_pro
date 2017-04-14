
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');

export default class Detail extends Component {

  render() {
    return(
      <View style={styles.container}>
        <Text>账户页面</Text>
      </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});