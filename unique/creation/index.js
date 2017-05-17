
import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
  View,
  ActivityIndicator,
  RefreshControl,
  AlertIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'
import Detail from './detail'
var width = Dimensions.get('window').width;
var request = require ('../common/request')
var config = require ('../common/config')

var cachedResult = {
  nextPage: 1,
  items: [],
  total:0
}

class Item extends Component {
  constructor(props) {
    super(props);
    var row = this.props.row;
    this.state={
      up: row.voted,
      row: row
    }
  }
  _up() {
    var that = this;
   var up = !this.state.up;
   var row = this.state.row;
   var url = config.api.base + config.api.up;
   var body = {
    id: row._id,
    up: up ? 'yes' : 'no',
    accessToken: 'abcdef'
   }
   request.post(url, body)
   .then(function(data) {
    if(data && data.success) {
      that.setState({
        up : up
      })
    } else {
      AlertIOS.alert('failed action')
    }
   })
   .catch(function(error) {
      console.log(error)
      AlertIOS.alert('failed action')
   })
  }
  render() {
    var row = this.state.row;
  return (
    <TouchableHighlight onPress={this.props.onSelect}>
      <View style={styles.item} >
        <Text style={styles.title}>{row.title}</Text>
          <Image source={{uri:row.thumb}} 
          style={styles.thumb} onPress={() => console.log(row.thumb)}
          onLoadend={() => console.log(row.thumb)}
           />
          <Icon name='ios-play' size={28} style={styles.play} />
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon 
                onPress={this._up.bind(this)}
                name={this.state.up ? "ios-heart" : "ios-heart-outline"}
                size={28}
                style={[styles.up, this.state.up ? null : styles.down]} 
                />
              <Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon 
                name="ios-chatboxes-outline"
                size={28}
                style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
      </View>
    </TouchableHighlight>
  )
}
}


export default class List extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isRefreshing: false,
      isloading: false
    };

    _loadPage =(row) => {
      console.log(this.props)
      this.props.navigator.push({
        name: 'detail',
        component: Detail,
        params: {
          row:row
        }
      })
    }

  }

   

  _renderRow(row) {
      return <Item
              key={row._id}
              onSelect={() => this._loadPage(row)}
              row={row} />
  }

  componentDidMount() {
    this._fetchData(1);
  }

  _fetchData(page) {
    var that = this
    if (page!=0) {
      this.setState({
        isloading: true
      })
    }else{
      this.setState({
        isRefreshing: true
      })
    }

    // this.setState({
    //   isloading:true
    // })
    request.get(config.api.base + config.api.creations, {
      accessToken: 'abcdef',
      page: page
    })
    .then((data) => {
      console.log(data)
      if (data.success) {
        // 获取新列表
        var items = cachedResult.items.slice()
        if (page!=0) {
          items = items.concat(data.data)
          cachedResult.nextPage += 1

        } else {
          items = data.data.concat(items)
        }
        cachedResult.items = items
        cachedResult.total = data.total
        setTimeout(function(){
          if (page!==0) {
            that.setState({
              isloading: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResult.items)
            })
          } else {
            that.setState({
              isRefreshing: false,
              dataSource: that.state.dataSource.cloneWithRows(cachedResult.items)
            })
          }
        

        },20)

      }
    })
    .catch((error) => {
      if (page!==0) {
        this.setState({
            isloading: false
        })
      } else{
        this.setState({
          isRefreshing: false
        })
      }
      console.warn(error)
     
    })
   
  }


  _hasMoreData() {
    return cachedResult.items.length !==cachedResult.total
  }

  _fetchMoreData() {
    if (!(this._hasMoreData()) || this.state.isloading) {
      return
    }
    var page = cachedResult.nextPage
    this._fetchData(page)
  }

  _onRefresh(){
    if (!this._hasMoreData() || this.state.isRefreshing) {
      return
    }

    this.setState({
      isRefreshing: true
    })

    this._fetchData(0)

  }



  _renderFooter() {
    if (!this._hasMoreData() && cachedResult.total !== 0) {
      return(
        <View style={styles.loadingmore}>
          <Text style={styles.loadingtext}>not has any more</Text>
        </View>
      )
    }
    if (this.state.loadingmore) {
        return <View style={styles.loadingmore} />
    }
    return <ActivityIndicator size="large" />
    

  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>


        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          enableEmptySections={true}
          onEndReached={this._fetchMoreData.bind(this)}
          onEndReachedThreshold={20}
          showsVerticalScrollIndictor={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              tintColor="#ff6600"
              title="Loading..."
            />
          }
          renderFooter={this._renderFooter.bind(this)}
          automaticallyAdjustContentInsets={false}
        />

      </View>
      )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  head: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: "#ee735c"
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item:{
    width: width,
    marginBottom: 10,
    backgroundColor: 'white',
  },

  thumb:{
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },

  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },

  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  play: {
    position: 'absolute',
    bottom: 64,
    right: 14,
    height: 46,
    width: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 23,
    zIndex:1,
    color: '#ed7b66'
  },

  handleText:{
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  down:{
    fontSize: 22,
    color: '#333'
  },
  up:{
    fontSize: 22,
    color: '#ed7b66'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  },

  loadingtext: {
    color: '#777',
    textAlign: 'center'
  }



});