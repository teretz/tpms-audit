import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, ImageBackground } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default class Contact extends Component {
    render() {
        return(
            <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
            <View style={styles.pageWrap}>
                <View style={styles.pageTitleWrap}>
                    <Text style={styles.pageTitle}>Contact TPMS</Text>
                </View>
                <Text style={styles.instructions}>Please call or text to contact Tech Support.</Text>
                <View style={styles.contactWrap}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Linking.openURL('tel:18776598767') }} >
                        <FontAwesome name="phone" style={styles.buttonIcon} /> 
                        <Text style={styles.buttonText}>Call: 1-877-659-8767</Text>
                    </TouchableOpacity >
                    <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Linking.openURL("sms:7407779636") }} >
                        <FontAwesome name="envelope" style={styles.buttonIcon} /> 
                        <Text style={styles.buttonText}>Send a Message</Text>
                    </TouchableOpacity >
                </View>
            </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    pageBg:{
        flex:1
    },
    pageWrap: {
      backgroundColor: 'rgba(23, 23, 23, 0.4)',
      // padding:10,
      margin:5,
      position: 'relative',
      paddingBottom:20,
      
    },
    pageTitleWrap: {
      backgroundColor:'rgba(23, 23, 23, 0.4)',
      padding:8
    },
    pageTitle: {
        color:"#F3C72F",
        textAlign:"center",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:20,
        padding:8
    },
    instructions: {
        color:"#ffffff",
        fontFamily:"Open Sans Condensed",
        fontSize:15,
        padding:10,
        textAlign:"center"
    },
    contactWrap: {
        justifyContent:"center",
        alignItems: 'center'
    },
    buttonStyle: {
        width:'70%',
        padding:"2%",
        marginRight:"1%",
        marginLeft:"1%",
        backgroundColor:"#F3C72F",
        borderRadius:5,
        margin:10,
        flexDirection:'row',
        justifyContent:"center",
    },
    buttonText:{
        color:"#333333",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:15
    },
    buttonIcon: {
        fontSize: 20,
        fontWeight: 'normal',
        color:"rgba(0,0,0,.5)",
        marginRight:5,
        marginTop:0,
    },
  });
