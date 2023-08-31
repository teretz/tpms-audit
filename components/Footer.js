import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Platform, UIManager } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

export default class Footer extends Component {

  state = { 
    currentPage:"partFinderSearch"
  }

  buttonStyle(button_id){
    if(this.state.currentPage==button_id){
      return styles.navButtonActive;
    }else{
      return styles.navButton;
    }
  }

  buttonTextStyle(button_id){
    if(this.state.currentPage==button_id){
      return styles.buttonTextActive;
    }else{
      return styles.buttonText;
    }
  }

  buttonIconStyle(button_id){
    if(this.state.currentPage==button_id){
      return styles.buttonIconActive;
    }else{
      return styles.buttonIcon;
    }
  }

  changePage(page){
    //console.log(Actions.currentScene);
    this.setState({currentPage:page});
  }
 
  render() {
      const { navigate } = this.props.navigation;
    return (
        <View style={styles.navWrap}>
        
            <TouchableOpacity style={this.buttonStyle("partFinderSearch")} onPress={ ()=>{ Actions.partFinderSearch(); this.changePage("partFinderSearch"); }} >
                <FontAwesome name="car" style={this.buttonIconStyle("partFinderSearch")}  /> 
                <Text style={this.buttonTextStyle("partFinderSearch")} >Part Finder</Text>
            </TouchableOpacity >

            <TouchableOpacity style={this.buttonStyle("codeLookup")} onPress={ ()=>{ Actions.codeLookup(); this.changePage("codeLookup"); }}>
                <FontAwesome name="search" style={this.buttonIconStyle("codeLookup")}  /> 
                <Text style={this.buttonTextStyle("codeLookup")} >Lookup</Text>
            </TouchableOpacity >

            <TouchableOpacity style={this.buttonStyle("TrainingVideos")} onPress={ ()=>{ Actions.trainingVideos(); this.changePage("TrainingVideos"); }}>
                <FontAwesome name="film" style={this.buttonIconStyle("TrainingVideos")}  />
                <Text style={this.buttonTextStyle("TrainingVideos")} >Training</Text>
            </TouchableOpacity >

            <TouchableOpacity style={this.buttonStyle("contact")} onPress={ ()=>{ Actions.contact(); this.changePage("contact"); }}>
                <FontAwesome name="phone" style={this.buttonIconStyle("contact")}  /> 
                <Text style={this.buttonTextStyle("contact")} >Contact</Text>
            </TouchableOpacity >

        </View>
    );
  }
}

const styles = StyleSheet.create({
  navWrap:{
    flexDirection:'row',
    position:"absolute",
    bottom:0,
    right:0,
    left:0,
    borderTopWidth:1,
    borderTopColor:"#F3C72F",
    // backgroundColor: 'rgba(23, 23, 23, 0.7)',
  },
  navMenuButtonWrap:{
    marginTop:0,
    borderTopWidth:1,
    borderTopColor:"#F3C72F",
    alignItems:'center'
  },
  navButton: {
    // flexDirection:'row',
    paddingHorizontal:"2%",
    paddingTop:10,
    paddingBottom:Platform.OS === 'ios' ? 20 : 10,
    justifyContent:"center",
    borderBottomWidth:1,
    width:"25%"
  },
  navButtonActive: {
    // flexDirection:'row',
    paddingHorizontal:"2%",
    paddingTop:10,
    paddingBottom:Platform.OS === 'ios' ? 20 : 10,
    justifyContent:"center",
    borderBottomWidth:1,
    backgroundColor:"rgba(255,255,255,.1)",
    width:"25%"
  },
  buttonText:{
    color:"#ffffff",
    fontFamily:"Open Sans Condensed Bold",
    fontSize:12,
    justifyContent:"center",
    textAlign:"center",
  },
  buttonTextActive:{
    color:"#F3C72F",
    fontFamily:"Open Sans Condensed Bold",
    fontSize:12,
    justifyContent:"center",
    textAlign:"center",
  },
  buttonIcon: {
    fontSize: 23,
    color: '#ffe8d6',
    marginBottom:3,
    fontWeight: 'normal',
    color:"rgba(255,255,255,.5)",
    textAlign:"center"
  },
  buttonIconActive: {
    fontSize: 23,
    color: '#F3C72F',
    marginBottom:3,
    fontWeight: 'normal',
    textAlign:"center"
  },
  

});
