import React, { Component } from 'react';
import { ImageBackground, Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Actions } from 'react-native-router-flux';

export default class SearchType extends Component {
    render() {
        return(
            <ImageBackground source={require('../assets/app_bg2.jpg')} style={styles.pageBg}>
                <View style={styles.pageWrap}>
                    <Text style={styles.pageTitle}>TPMS Part Finder</Text>
                    <Text style={styles.instructions}>Choose a search method:</Text>
                    <View style={styles.contactWrap}>
                        {/* <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Actions.vinScanner(); }} >
                            <FontAwesome name="barcode" style={styles.buttonIcon} /> 
                            <Text style={styles.buttonText}>Scan a VIN bar code</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Actions.partFinderSearch2(); }} >
                            <FontAwesome name="automobile" style={styles.buttonIcon} /> 
                            <Text style={styles.buttonText}>Choose Year/Make/Model</Text>
                        </TouchableOpacity > */}
                        <TouchableOpacity style={styles.imageButtonStyle} onPress={ ()=>{ Actions.vinScanner(); }} >
                            <Image source={require('../assets/icon_bc.png')} style={styles.buttonImage} resizeMode="contain"/> 
                            <Text style={styles.imageButtonText}>VIN Bar Code Scanner</Text>
                        </TouchableOpacity >
                        <TouchableOpacity style={styles.imageButtonStyle} onPress={ ()=>{ Actions.partFinderSearch2(); }} >
                            <Image source={require('../assets/icon_vehicle.png')} style={styles.buttonImage}  resizeMode="contain" /> 
                            <Text style={styles.imageButtonText}>Select Year/Make/Model</Text>
                        </TouchableOpacity >
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    pageBg:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    pageWrap: {
        // backgroundColor: 'rgba(23, 23, 23, 0.4)',
        margin:15,
        position: 'relative',
        paddingBottom:20,
        // width:"90%",
        // minHeight:"50%"
    },
    pageTitleWrap: {
    //   backgroundColor:'rgba(23, 23, 23, 0.4)',
      padding:4,
      
    },
    pageTitle: {
        color:"#fff",
        textAlign:"center",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:24,
        // padding:4,
        // marginTop:15,
    },
    instructions: {
        color:"#ffffff",
        fontFamily:"Open Sans Condensed",
        fontSize:20,
        // padding:10,
        textAlign:"center"
    },
    contactWrap: {
        justifyContent:"center",
        alignItems: 'center'
    },
    buttonStyle: {
        width:'90%',
        // height:60,
        paddingVertical:"3%",
        paddingHorizontal:"15%",
        marginRight:"1%",
        marginLeft:"1%",
        backgroundColor:"#F3C72F",
        borderRadius:5,
        margin:10,
        // flexDirection:'row',
        justifyContent:"center",
        // flexGrow: 1,
        // flex:1,
        flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'flex-start'
    },
    buttonText:{
        color:"#333333",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:18
    },
    buttonIcon: {
        fontSize: 26,
        fontWeight: 'normal',
        color:"rgba(0,0,0,.5)",
        marginRight:10,
        // marginTop:6,
    },
    imageButtonStyle:{
        justifyContent:"center",
        alignItems: 'center',
        marginBottom:"5%",
        height:"40%"
    },
    buttonImage:{
        flex:1, 
        // height: undefined, 
        // width: undefined
        marginBottom:8
    },
    imageButtonText:{
        textAlign:"center",
        color:"#fff",
        fontWeight:"bold"
    }

  });
