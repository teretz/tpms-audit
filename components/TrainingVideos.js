import React, { Component } from 'react';
import { TouchableOpacity, Linking, Text, View, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';

export default class TrainingVideos extends Component {
    
    render() {

        if(this.props.isConnected){
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <ScrollView style={styles.pageWrap}>
                    <View style={styles.videoWrap}>
                        <View style={styles.videoTitleWrap}>
                            <Text style={styles.videoTitle}>PRO+ SOFTWARE UPDATE WALK THROUGH</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Linking.openURL("https://www.youtube.com/watch?v=z9gvPdePSgY") }} >
                            <Image source={require('../assets/video_1_thumb.jpg')} style={styles.videoThumb}/>
                        </TouchableOpacity >
                    </View>

                    <View style={styles.videoWrap}>
                        <View style={styles.videoTitleWrap}>
                            <Text style={styles.videoTitle}>SMART SENSOR OVERVIEW</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ Linking.openURL("https://www.youtube.com/watch?v=4dLg_HjegC8") }} >
                            <Image source={require('../assets/video_2_thumb.jpg')} style={styles.videoThumb}/>
                        </TouchableOpacity >
                    </View>
                </ScrollView>
                </ImageBackground>
            );
        }else{
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <View style={styles.offlineMessageWrap}>
                    <Text style={styles.offlineMessage}>Training videos are not available offline. Please enable a data connection to view training videos.</Text>
                </View>
                </ImageBackground>
            );
        }
    }
}

const styles = StyleSheet.create({
    pageBg:{
        flex:1
    },
    pageWrap: {
      
      // padding:10,
      margin:5,
      position: 'relative',
      paddingBottom:20,
      
    },
    videoWrap:{
        backgroundColor: 'rgba(23, 23, 23, 0.4)',
        marginBottom:10
    },
    videoTitleWrap: {
        backgroundColor:'rgba(23, 23, 23, 0.4)',
        padding:8
    },
    videoTitle: {
        color:"#F3C72F",
        textAlign:"center",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:20,
        padding:8
    },
    videoPlayerWrap:{
        height:250,
        width:"100%",
        padding:5,
    },
    offlineMessageWrap:{
        backgroundColor:"#f5d476",
        paddingVertical:5,
        paddingHorizontal:15,
        margin:10,
        borderRadius:2,
        // opacity:.8
    },
    offlineMessage:{
        color:"#333",
        fontFamily:"Open Sans Condensed",
        textAlign:"center",
        width:"100%",
        fontSize:18
    },
    videoThumb:{
        flex:1,
        width:"100%",
        height:200,
        margin:10
    }
  });
