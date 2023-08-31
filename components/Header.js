import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, UIManager } from 'react-native';
import { Actions } from 'react-native-router-flux';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Header extends Component {

  render() {
    return (
      <View style={styles.headerWrap}>
        <View style={styles.logoWrap}>
          <TouchableOpacity style={{width: '50%', justifyContent:"center", alignItems: 'center'}} onPress={ ()=>{ Actions.partFinderSearch(); }} >
                <Image source={require('../assets/tpms-logo.png')} style={styles.logoImage}/>
            </TouchableOpacity>
            <View style={{width: '50%', justifyContent:"center", alignItems: 'center'}}>
                <Image source={require('../assets/ss-logo.png')} style={styles.ssLogo}/>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWrap: {
    // backgroundColor: 'rgba(23, 23, 23, 0.7)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.9,
    elevation: 3,
    position: 'relative'
  },
  logoWrap:{
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft:20,
    paddingRight:20,
  },
  logoImage: {
    width: 129,
    height:42
  },
  ssLogo: {
    width: 129,
    height:42,
  }
});
