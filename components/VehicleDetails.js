import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, Image, Linking, TouchableOpacity, Alert, LayoutAnimation, UIManager} from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import { FontAwesome } from '@expo/vector-icons';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const CustomLayoutSpring = {
    duration: 200,
    create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
    update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
  }

export default class VehicleDetails extends Component {

    state = { 
        fetchedVehicles:[]
    };

    componentDidMount(){
        if(!this.state.fetchedVehicles.length){
            // Get all PDFs from API
            let fetch_url="http://tpmsnetwork.com/wp-json/tpms/get_vehicle_info/"+this.props.vehicleId;
            //console.log(fetch_url)
            fetch(fetch_url).then((response) => response.json()).then((response) => {
                //console.log(response.vehicles);
                LayoutAnimation.configureNext(CustomLayoutSpring);
                this.setState({ 
                    fetchedVehicles: response.vehicles
                });
                
            }).catch(function(error) {
                Alert.alert("Server connection lost. Check your data connection.");
            });
        }
    }

    vehicleApplications(currentVehicleInfo){
        if(this.state.fetchedVehicles.length>1){

            let index = 0;
        const data = [];

        this.state.fetchedVehicles.map(vehicle => {
            data.push({key: vehicle["id"], label: vehicle["notes"]});
        });
          

            return(
                <View>
                    <View style={styles.applicationsMessage}><Text style={styles.applicationsMessageText}>There are multiple applications available for this vehicle. Please make sure the correct application is selected below.</Text></View>

                    {/* <View style={styles.tabsWrap}>
                        <Text style={styles.tabsLabel}>Applications:</Text>
                        {this.renderTabs()}
                    </View> */}

                    <View style={styles.tabsWrap}>
                        <Text style={styles.tabsLabel}>Applications:</Text>
                        <View style={styles.tabsDropdownWrapper}>
                            <ModalSelector
                            style={styles.tabsDropdown}
                            overlayStyle={styles.tabsDropdownOptions}
                            selectTextStyle={styles.tabsDropdownText}
                            data={data}
                            initValue={currentVehicleInfo["notes"]}
                            onChange={(option)=>{ this.props.changeVehicleDetails(option.key) }} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    tabStyle(vehicleId){
        if(this.props.vehicleId==vehicleId){
            return styles.vehicleTabActive;
        }else{
            return styles.vehicleTab;
        }
    }

    renderTabs(){
        return this.state.fetchedVehicles.map(vehicle=>
            <TouchableOpacity key={vehicle["notes"]} style={this.tabStyle(vehicle["id"])} onPress={ ()=>{this.props.changeVehicleDetails(vehicle["id"]);}}><Text style={styles.vehicleTabText}>{vehicle["notes"]}</Text></TouchableOpacity>
        );
    }

    relearnProcedure(currentVehicleInfo){
        if(!currentVehicleInfo["relearn"].length){
            return(
                <Text style={styles.noRelearnMessage}>No relearn documents are available for this vehicle.</Text>
            );
        }else{
            return currentVehicleInfo["relearn"].map(pdf=>
                <TouchableOpacity style={styles.relearnWrap} key={pdf["title"]} onPress={()=>{Linking.openURL(pdf["file"])}}>
                    <Image source={{uri:pdf["thumbnail"]}} style={styles.pdfThumbnail}/>
                    <Text style={styles.pdfText}>{pdf["title"]}</Text>
                </TouchableOpacity >
            );
        }
    }

    smartSensors(currentVehicleInfo){
        if(!currentVehicleInfo["sensors"].length){
            return(
                <Text style={styles.noRelearnMessage}>No sensors are available for this vehicle.</Text>
            );
        }else{
            return currentVehicleInfo["sensors"].map(sensor=>
                <View style={styles.sensorWrap} key={sensor["id"]}>
                    <Image source={{uri:sensor["thumbnail"]}} style={styles.sensorThumbnail}/>
                    <Text style={styles.sensorTitle}>{sensor["title"]}</Text>
                    <Text style={styles.sensorPartNumber}>{sensor["part_number"]}</Text>
                </View >
            );
        }
    }

    OEMParts(currentVehicleInfo){
        if(!currentVehicleInfo["oem_parts"].length){
            return(
                <Text style={styles.noRelearnMessage}>No OEM parts are available for this vehicle.</Text>
            );
        }else{
            return currentVehicleInfo["oem_parts"].map(sensor=>
                <View style={styles.sensorWrap} key={sensor["id"]}>
                    <Image source={{uri:sensor["thumbnail"]}} style={styles.sensorThumbnail}/>
                    <Text style={styles.sensorTitle}>{sensor["title"]}</Text>
                    <Text style={styles.sensorPartNumber}>{sensor["part_number"]}</Text>
                </View >
            );
        }
    }

    serviceKit(currentVehicleInfo){
        if(!currentVehicleInfo["oem_part_categories"]["service_kits"].length){
            return(
                <Text style={styles.moduleMessage}>None</Text>
            );
        }else{
            return currentVehicleInfo["oem_part_categories"]["service_kits"].map(part=>
                <Text style={styles.partTitle} key={part}>{part}</Text>
            );
        }
    }

    torque(currentVehicleInfo){
        if(!currentVehicleInfo["torque"]){
            return(
                <Text style={styles.moduleMessage}>None</Text>
            );
        }else{
            return (
                <Text style={styles.partTitle}>{currentVehicleInfo["torque"]}</Text>
            );
        }
    }

    replacementValveStem(currentVehicleInfo){
        if(!currentVehicleInfo["oem_part_categories"]["valve_stems"].length){
            return(
                <Text style={styles.moduleMessage}>None</Text>
            );
        }else{
            return currentVehicleInfo["oem_part_categories"]["valve_stems"].map(part=>
                <Text style={styles.partTitle} key={part}>{part}</Text>
            );
        }
    }

    replacementValveKit(currentVehicleInfo){
        if(!currentVehicleInfo["oem_part_categories"]["valve_kits"].length){
            return(
                <Text style={styles.moduleMessage}>None</Text>
            );
        }else{
            return currentVehicleInfo["oem_part_categories"]["valve_kits"].map(part=>
                <Text style={styles.partTitle} key={part}>{part}</Text>
            );
        }
    }

    vehicleDetails(currentVehicleInfo){
        if(currentVehicleInfo["notes"]=="Indirect TPMS"){
            return(
                <View style={styles.applicationsMessage}><Text style={styles.applicationsMessageText}>This vehicle’s TPMS is Indirect which functions using the ABS wheel speed sensor. There is not a TPM sensor in the tire.</Text></View>
            );
        }else{
            return(
                <View>
                    <View style={styles.detailsSectionWrapGrey}>
                        <Text style={styles.detailsSectionTitle}>OEM Part Number</Text>
                        <Text style={styles.detailsSection}>{currentVehicleInfo["oem_pn"]}</Text>
                    </View>
                    <View style={styles.detailsSectionWrap}>
                        <Text style={styles.detailsSectionTitle}>Relearn Procedure</Text>
                        <View style={styles.relearnWrapOuter}>
                            {this.relearnProcedure(currentVehicleInfo)}
                        </View>
                    </View>
                    <View style={styles.detailsSectionWrapGrey}>
                        <Text style={styles.detailsSectionTitle}>Smart Sensors</Text>
                        <View style={styles.sensorWrapOuter}>
                            {this.smartSensors(currentVehicleInfo)}
                        </View>
                    </View>
                    <View style={styles.detailsSectionWrap}>
                        <Text style={styles.detailsSectionTitle}>OEM Parts</Text>
                        <View style={styles.OEMSpecModuleWrap}>
                            <View style={styles.OEMSpecModule}>
                                <Text style={styles.OEMSpecTitle}>TPMS Service Kit</Text>
                                {this.serviceKit(currentVehicleInfo)}
                            </View>

                            <View style={styles.OEMSpecModule}>
                                <Text style={styles.OEMSpecTitle}>Torque in lbs (N.M.)</Text>
                                {this.torque(currentVehicleInfo)}
                            </View>

                            <View style={styles.OEMSpecModule}>
                                <Text style={styles.OEMSpecTitle}>Replacement Valve Stem</Text>
                                {this.replacementValveStem(currentVehicleInfo)}
                            </View>

                            <View style={styles.OEMSpecModule}>
                                <Text style={styles.OEMSpecTitle}>Replacement Valve Kit</Text>
                                {this.replacementValveKit(currentVehicleInfo)}
                            </View>
                        </View>
                        <View style={styles.sensorWrapOuter}>
                            {this.OEMParts(currentVehicleInfo)}
                        </View>
                    </View>
                </View>
            );
        }
    }

    render() {
        //console.log(this.props.vehicleId);

        let currentVehicleInfo={};
        //Figure out which of the returned vehicles is the current vehicle
        this.state.fetchedVehicles.map(vehicle=>{
            if(vehicle["id"]==this.props.vehicleId){
                currentVehicleInfo=vehicle;
            }
        });

        if(!this.state.fetchedVehicles.length){
            return(
                <View style={styles.pageWrap}>
                     <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:15}}/>
                </View>
            );
        }else{
            //console.log(this.state.fetchedVehicles[0]);
            return(
                <View style={styles.pageWrap}>
                    <View style={styles.pageTitleWrap}>
                        <TouchableOpacity style={styles.backButton} onPress={ ()=>{this.props.detailsBackButton();}}>
                            <FontAwesome name="chevron-left" style={styles.backButtonIcon}  />
                        </TouchableOpacity>
                        <Text style={styles.pageTitle}>{currentVehicleInfo["year"]} {currentVehicleInfo["make"]} {currentVehicleInfo["model"]}</Text>
                    </View>

                    <ScrollView style={styles.vehicleDetailsWrap}>
                        {this.vehicleApplications(currentVehicleInfo)}

                        {this.vehicleDetails(currentVehicleInfo)}        
                        
                    </ScrollView>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    pageWrap: {
      backgroundColor: 'rgba(23, 23, 23, 0.4)',
      margin:5,
      position: 'relative',
    //   paddingBottom:20,
      flex:1
      
    },
    pageTitleWrap: {
        backgroundColor:'rgba(23, 23, 23, 0.4)',
        padding:8
    },
    backButton:{
        position:"absolute",
        top:0,
        left:0,
        zIndex:1,
        padding:16
    },
    backButtonIcon:{
        fontSize:25,
        color:"#dadada",
        fontWeight:"normal"
    },
    pageTitle: {
        color:"#F3C72F",
        textAlign:"center",
        fontFamily:"Open Sans Condensed Bold",
        fontSize:20,
        padding:8
    },
    vehicleDetailsWrap:{
        padding:10
    },
    applicationsMessage:{
        backgroundColor:"rgba(255,255,255,.8)",
        padding:10,
        borderColor:"#fd8e00",
        borderWidth:3,
        marginBottom:10,
        borderRadius:5
    },
    applicationsMessageText:{
        fontFamily:"Open Sans Condensed Bold",
        textAlign:"center",
    },
    tabsWrap:{
        borderBottomColor:"#fd8e00",
        borderBottomWidth:2,
        paddingRight:8,
        paddingLeft:8,
        flexDirection:'row',
        paddingBottom:10,
        marginBottom:10,
    },
    tabsLabel:{
        marginTop:8,
        color:"#fff",
        fontFamily:"Open Sans Condensed",
        fontSize:15
    },
    vehicleTab:{
        marginLeft:10,
        paddingHorizontal:14,
        paddingVertical:8,
        backgroundColor:"rgba(255,255,255,.4)"
    },
    vehicleTabActive:{
        marginLeft:10,
        paddingHorizontal:14,
        paddingVertical:8,
        backgroundColor:"#fd8e00"
    },
    vehicleTabText:{
        color:"#fff",
        fontFamily:"Open Sans Condensed",
    },
    tabsDropdownWrapper:{
        marginLeft:10,
        flex:1,
    },
    tabsDropdown:{ 
        borderRadius:5,
        backgroundColor:"#f9f9f9",
    },
    tabsDropdownText:{
        fontSize:13,
        fontWeight:"bold"
    },
    tabsDropdownOptions:{
        padding:"1%"
    },
    detailsSectionWrap:{
        paddingVertical:15,
        paddingHorizontal:10
    },
    detailsSectionWrapGrey:{
        paddingVertical:15,
        paddingHorizontal:10,
        backgroundColor:"rgba(255,255,255,.2)",
    },
    detailsSectionTitle:{
        color:"#F3C72F",
        textAlign:"center",
        fontFamily:"Open Sans Condensed Bold",
        marginBottom:8
    },
    detailsSection:{
        color:"#ffffff",
        fontSize:18,
        fontFamily:"Open Sans Condensed",
        textAlign:"center"
    },
    relearnWrapOuter:{
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    relearnWrap:{
        width:"49%",
        height:150,
        backgroundColor:"#3d3d3b",
        padding:1,
        paddingBottom:10,
        borderColor:"#777777",
        borderWidth:1,
        margin:"1%"
    },
    noRelearnMessage:{
        color:"#ffffff",
        textAlign:"center",
        fontFamily:"Open Sans Condensed",
        padding:10,

    },
    pdfThumbnail:{
        flex:1,
        resizeMode: 'contain',
        margin:5,
        borderColor:"#222220",
        // borderWidth:3
    },
    pdfText:{
        color:"#ffffff",
        textAlign:"center",
        fontFamily:"Open Sans Condensed",
        marginBottom:5
    },
    sensorWrapOuter:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    sensorWrap:{
        width:"48%",
        height:200,
        backgroundColor:"#3d3d3b",
        padding:1,
        borderColor:"#777777",
        borderWidth:1,
        margin:"1%"
    },
    sensorThumbnail:{
        flex:1,
        resizeMode: 'contain',
        margin:5,
        // borderColor:"#222220",
        // borderWidth:3,
        height:60
    },
    sensorTitle:{
        color:"#ffffff",
        textAlign:"center",
        fontFamily:"Open Sans Condensed",
        marginBottom:5,
        fontSize:10,
    },
    sensorPartNumber:{
        color:"#ffffff",
        fontFamily:"Open Sans Condensed",
        textAlign:"center",
        marginBottom:5,
        fontSize:8
    },
    OEMSpecModuleWrap:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center', 
        justifyContent: 'center'
    },
    OEMSpecModule:{
        width:"48%",
        backgroundColor:"#3d3d3b",
        padding:5,
        borderColor:"#777777",
        borderWidth:1,
        margin:"1%",
    },
    OEMSpecTitle:{
        color:"#F3C72F",
        textAlign:"center",
        fontFamily:"Open Sans Condensed",
        marginBottom:5,
        fontSize:10,
    },
    moduleMessage:{
        color:"#ffffff",
        textAlign:"center",
        fontFamily:"Open Sans Condensed",
    },
    partTitle:{
        color:"#ffffff",
        fontFamily:"Open Sans Condensed",
        textAlign:"center"
    }
  });
