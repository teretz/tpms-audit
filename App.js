import React, { Component } from 'react';
import { StyleSheet, Platform, View, UIManager, StatusBar } from 'react-native';
import NetInfo from '@react-native-community/netinfo'
import { AppLoading } from 'expo';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
// import { useFonts } from '@use-expo/font';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import Header from './components/Header';
import Footer from './components/Footer';
import PartFinderSearch from './components/PartFinderSearch';
import TrainingVideos from './components/TrainingVideos';
import CodeLookup from './components/CodeLookup';
import Contact from './components/Contact';
import Router from './components/Router';
//import reducers from './reducers';

let customFonts = {
    'Open Sans Condensed': require('./assets/OpenSans-CondLight.ttf'),
    'Open Sans Condensed Bold': require('./assets/OpenSans-CondBold.ttf'),
  };


export default class App extends Component {

  state={
    //currentPage:"part_finder" CHANGE AFTER DEV
    currentPage:"part_finder",
    isLoadingComplete: false,
    isConnected:true,
    fontsLoaded: false,
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  navigateToPage(page){
    this.setState({
      currentPage:page
    });
  }

  async componentDidMount() {

    this._loadFontsAsync();

    NetInfo.fetch().then(state => {   

        if(Platform.OS !== 'ios'){
            if(!state.isConnected){
                //console.log("initial disconnection");
                this.setState({"isConnected":false});
            }
        }
    });

    const unsubscribe = NetInfo.addEventListener(state => {
        if(!state.isConnected){
            //console.log("change offline");
            this.setState({"isConnected":false});
        }else{
            //console.log("change online");
            this.setState({"isConnected":true});
        }
    });

  }

  render() {
    StatusBar.setBarStyle('light-content', true);

      if((!this.state.isLoadingComplete && !this.props.skipLoadingScreen) || !this.state.fontsLoaded) {
        return (
          <AppLoading
            startAsync={this._loadResourcesAsync}
            onError={this._handleLoadingError}
            onFinish={this._handleFinishLoading}
          />
        );
      }else{
        return (
          // <ImageBackground source={require('./assets/app_bg.jpg')} style={styles.appWrap}>
          <View style={styles.appWrap}>
            <View style={styles.statusBarBg}></View>
            <Header navigation={this.navigateToPage.bind(this)} current_page={this.state.currentPage}/>
            {/* {this.renderPageContent()} */}
            <Router style={{background:"#fff"}} isConnected={this.state.isConnected}></Router>
            <Footer navigation={this.navigateToPage.bind(this)} current_page={this.state.currentPage}/>
            </View>
            // </ImageBackground> 

          // <View style={styles.appWrap}>
          //   <Router style={{background:"#fff"}} isConnected={this.state.isConnected}></Router>
          // </View>
          
        );
      }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/app_bg.jpg'),
        require('./assets/app_bg2.jpg'),
        require('./assets/splash2.png'),
        require('./assets/ss-logo.png'),
        require('./assets/tpms-logo.png'),
        require('./assets/icon_vehicle.png'),
        require('./assets/icon_bc.png'),
      ]),
    //   Font.loadAsync({
    //     'Open Sans Condensed': require('./assets/OpenSans-CondLight.ttf'),
    //     'Open Sans Condensed Bold': require('./assets/OpenSans-CondBold.ttf'),
    //   }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}

const styles = StyleSheet.create({
  appWrap: {
    // paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    width: '100%',
    height: '100%',
    flex:1,
    paddingBottom: Platform.OS === 'ios' ? 74 : 64,
    backgroundColor:"#141414"
  },
  statusBarBg:{
    backgroundColor:"#141414",
    // height: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    height:getStatusBarHeight()
  }
});
