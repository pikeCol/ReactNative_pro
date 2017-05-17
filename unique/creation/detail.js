
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

var width = Dimensions.get('window').width;

var Icon = require('react-native-vector-icons/Ionicons');
var Video = require('react-native-video').default;

export default class Detail extends Component {

  constructor(props){
        super(props);
        this.state = {};
  }
  componentWillMount() {
    this.setState({
      row:this.props.row
    })
  }
  componentDidMount() {
    console.log(this.state.row)
  }
  render() {
    var row = this.state.row;

    return(
      <View style={styles.container}>
        <Text >详情页面 {row.video}</Text>
        <View style={styles.videobox}>
          <Video 
            ref='vedioPlay'
            source={{uri: "https://imgcache.qq.com/tencentvideo_v1/player/TPout.swf?max_age=86400&v=20140714"}}
            style={styles.video}
            volume={5}
            pause={false}
            repeat={true}
            onLoadStar={this._onLoadStar}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          />
        </View>
      </View>
      )
  }
  _onLoadStar(){
    console.log('start')
  }
  _onLoad(){
    console.log('load')

  }
  _onProgress(){
    console.log('onProgress')

  }
  _onEnd(){
    console.log('end')

  }
  _onError(e){
    console.log(e)
    console.log('end')

  }


  _back() {
    const { navigator } = this.props;
      if(navigator){
        navigator.pop();
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videobox: {
    width: width,
    height: 360,
    backgroundColor: '#000'
  },
  video: {
    width: width,
    height: 360,
    backgroundColor:'#000'
  }
}); 