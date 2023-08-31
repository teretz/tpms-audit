import React, { Component } from 'react';
import { ImageBackground, ActivityIndicator, Alert, Text, View, StyleSheet, TouchableOpacity, LayoutAnimation, UIManager } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
// import { BarCodeScanner } from 'expo';
import { Actions } from 'react-native-router-flux';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

import VehicleDetails from './VehicleDetails';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const CustomLayoutSpring = {
    duration: 200,
    create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
    update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
  }

export default class VinScanner extends Component {


    state = {
        hasCameraPermission: null,
        stage:"scanner",
        scannedCode:"",
        vehicleId:"",
        errorMessage:""
      };
    
      componentDidMount() {
        this._requestCameraPermission();
      }
    
      _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
          hasCameraPermission: status === 'granted',
        });
      };
    
      _handleBarCodeRead = data => {
        //this.vinApiFetch(data.data.trim());
        //this.vinApiFetch("1G6DW6ED5B0135270");
        //this.vinApiFetch("5J6YH28675L018026");
        let vin=data.data.replace(/[^a-z0-9 ]/gi,'');
        this.vinApiFetch(vin);
        //console.log(data);
      };

    vinApiFetch(vin){
        // console.log("'"+vin+"'");

        this.setState({
            "stage":"lookup",
            "scannedCode":vin
        });

        let fetch_url="http://tpmsnetwork.com/wp-json/tpms/vin_to_vehicle_id/"+vin+"";
        //let fetch_url="https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/"+vin+"?format=json";
        // console.log(fetch_url);
        fetch(fetch_url).then((response) => response.json()).then((response) => {
        // console.log(response);

        if(response.success){
            this.setState({
                "stage":"details",
                "vehicleId":response.vehicle_id
            });
        }else{
            this.setState({
                "stage":"error",
                "errorMessage":response.error_message
            });
        }


        }).catch(function(error) {
            Alert.alert("Server connection lost.","Please check your data connection.");
        });

    }

    changeVehicleDetails(vehicleId){
        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.setState({
            stage: "details",
            vehicleId: vehicleId
        });
    }

    detailsBackButton(){
        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.setState({
            stage:"scanner",
            vehicleId:""
        })
    }

    render() {
        // console.log("Stage:", this.state.stage);
        if(this.state.stage=="scanner"){
            if (this.state.hasCameraPermission === null) {
                return <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}><View><Text>Requesting for camera permission</Text></View></ImageBackground>;
            }
            if (this.state.hasCameraPermission === false) {
                return <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}><View><Text>No access to camera</Text></View></ImageBackground>;
            }

            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <View style={styles.pageWrap}>
                    <View style={styles.pageTitleWrap}>
                        <Text style={styles.pageTitle}>Scan a VIN Bar Code</Text>
                    </View>
                    <View style={{ flex:1 }}>
        
                        <Camera
                        flashMode="on"
                        onBarCodeScanned={this._handleBarCodeRead}
                        style={{ flex:1}}
                        />
                    </View>
                    <View style={{ justifyContent:"center", alignItems: 'center' }}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ this.setState({"stage":"lookup"}); Actions.partFinderSearch(); }} >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity >
                    </View>
                </View>
                </ImageBackground>
            );
        }else if(this.state.stage=="lookup"){
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <View>
                    <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:10}}/>
                </View>
                </ImageBackground>
            );
        }else if(this.state.stage=="invalidVin"){
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <View style={styles.pageWrap}>
                    <View style={styles.pageTitleWrap}>
                        <Text style={styles.pageTitle}>VIN Bar Code Scanner</Text>
                    </View>
                    <View style={styles.invalidVinMessageWrap}>
                        <Text style={styles.invalidVinTitle}>Invalid VIN Number</Text>
                        <Text style={styles.invalidVinMessage}>The VIN number you have scanned is not valid. Please click the button below to scan another VIN bar code.</Text>
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ this.setState({"stage":"scanner"}) }} >
                            <Text style={styles.buttonText}>Scan Another VIN</Text>
                        </TouchableOpacity >
                    </View>
                </View>
                </ImageBackground>
            );
        }else if(this.state.stage=="error"){
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <View style={styles.pageWrap}>
                    <View style={styles.pageTitleWrap}>
                        <Text style={styles.pageTitle}>VIN Bar Code Scanner</Text>
                    </View>
                    <View style={styles.invalidVinMessageWrap}>
                        {/* <Text style={styles.invalidVinTitle}></Text> */}
                        <Text style={styles.invalidVinMessage}>{this.state.errorMessage}</Text>
                        <TouchableOpacity style={styles.buttonStyle} onPress={ ()=>{ this.setState({"stage":"scanner"}) }} >
                        <Text style={styles.buttonText}>Scan Another VIN</Text>
                    </TouchableOpacity >
                    </View>
                </View>
                </ImageBackground>
            );
        }else if(this.state.stage=="details"){
            return(
                <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                <VehicleDetails vehicleId={this.state.vehicleId} changeVehicleDetails={this.changeVehicleDetails.bind(this)} detailsBackButton={this.detailsBackButton.bind(this)}/>
                </ImageBackground>
            );
        }

        
    }


}

const styles = StyleSheet.create({

    pageBg:{
        flex:1
    },
    // pageWrap: {
    //     backgroundColor: 'rgba(23, 23, 23, 0.4)',
    //     margin:5,
    //     position: 'relative',
    //     paddingBottom:20,
    // },

    pageWrap: {
      backgroundColor: 'rgba(23, 23, 23, 0.4)',
      // padding:10,
      margin:5,
      position: 'absolute',
    //   paddingBottom:20,
      top:0,
      right:0,
      bottom:0,
      left:0
      
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
    invalidVinMessageWrap: {
        justifyContent:"center",
        alignItems: 'center',
        padding:10
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
    invalidVinTitle:{
        fontSize:20,
        color:"#F3C72F"
    },
    invalidVinMessage:{
        color:"#fff",
        textAlign:"center",
        marginVertical:10
    }
  });
