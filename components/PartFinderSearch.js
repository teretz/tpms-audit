import React, { Component } from 'react';
import { ImageBackground, Text, View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, AsyncStorage, LayoutAnimation, UIManager } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';

//Enable animation for android
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

import VehicleDetails from './VehicleDetails';
import VehicleDetailsOffline from './VehicleDetailsOffline';

const CustomLayoutSpring = {
  duration: 200,
  create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
  update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
  delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
}

export default class PartFinderSearch extends Component {

  state = { 
    years:[],
    makes:[],
    models:[],
    stage:"loading_catalog",
    //stage:"details",
    selectedYear:"",
    selectedMake:"",
    selectedModel:"",
    //selectedId:917,
    //selectedId:139,
    selectedId:"",
  };

//   componentWillReceiveProps(nextProps) {
//       console.log(nextProps.stage);
//     LayoutAnimation.configureNext(CustomLayoutSpring);
//     this.setState({ stage: nextProps.stage });  
//   }

  componentDidMount() {
    this.initVehicleCatalog();
  }

  initVehicleCatalog(){
    if(this.props.isConnected){

      //We are online. Check if API catalog has updated since app last updated. If so, fetch the catalog and update local storage
      AsyncStorage.getItem('last_catalog_update', (err, result) => {

        let last_updated=result;
        if(last_updated===null){
          last_updated=0;
        }

        let fetch_url="http://tpmsnetwork.com/wp-json/tpms/get_catalog/"+last_updated;
        //console.log(fetch_url);
        fetch(fetch_url).then((response) => response.json()).then((response) => {
          //console.log(response);

          //Server will respond "up_to_date=true" if local catalog is current
          if(!response.up_to_date){
            AsyncStorage.multiSet([['tpms_catalog', JSON.stringify(response.catalog)], ['last_catalog_update', response.last_catalog_update]], () => {
              this.parseCatalogYears();              
            });
          }else{
            this.parseCatalogYears(); 
          }

        }).catch(function(error) {
          Alert.alert("Server connection lost.","Please check your data connection.");
        });

      });

    }else{
      Alert.alert("You appear to be offline.", "A cached version of the catalog will be used. Please enable a data connection to make sure you have the latest catalog version.");
      this.parseCatalogYears();
    }
  }

  parseCatalogYears(){

    //Parse out vehicle years
    AsyncStorage.getItem('tpms_catalog', (err, result) => {

      //Make sure catalog cache exists
      if(result===null){
        Alert.alert("No Data Connection","Please enable a data connection to view the catalog.");
        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.setState({ stage:"no_data"});
      }else{

        //Loop through catalog and get unique years
        let years=[];
        JSON.parse(result).map(vehicle=>
          years.push(parseInt(vehicle.year))
        );

        uniqueYears = years.filter(function(item, pos) {
          return years.indexOf(item) == pos;
        });

        uniqueYears.sort();
        uniqueYears.reverse();

        LayoutAnimation.configureNext(CustomLayoutSpring);
        this.setState({ years: uniqueYears, stage:"year" });
      }
    });
  }

  yearSelected(year){
    //Parse out vehicle makes
    AsyncStorage.getItem('tpms_catalog', (err, result) => {

      //Loop through catalog and get unique makes
      let makes=[];
      JSON.parse(result).map(vehicle=>{
          if(parseInt(vehicle.year)==year){
            makes.push(vehicle.make)
          }
        }
      );

      let uniqueMakes = makes.filter(function(item, pos) {
        return makes.indexOf(item) == pos;
      });

      uniqueMakes.sort();

      LayoutAnimation.configureNext(CustomLayoutSpring);
      this.setState({ makes: uniqueMakes, stage: "make", selectedYear:year });
    });
  }

  makeSelected(make){
 
    //Parse out vehicle models
    AsyncStorage.getItem('tpms_catalog', (err, result) => {

      let models=[];
      let models_only=[];
      JSON.parse(result).map(vehicle=>{
          if(parseInt(vehicle.year)==this.state.selectedYear && vehicle.make==make && models_only.indexOf(vehicle.model)===-1){
            models.push({"model": vehicle.model, "id":vehicle.id})
            models_only.push(vehicle.model);
          }
        }
      );

      models.sort();

      LayoutAnimation.configureNext(CustomLayoutSpring);
      this.setState({ models: models, stage: "model", selectedMake:make });
    });
  }

  modelSelected(vehicleId){
    //Show the details page
    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({
      stage: "details",
      selectedId: vehicleId
    });
  }

  renderVehicleYear(){
    return this.state.years.map(year=>
      <TouchableOpacity key={year} style={styles.selectionItem} onPress={ ()=>{this.yearSelected(year);}}><Text style={styles.selectionItemText}>{year}</Text></TouchableOpacity>
    );
  }

  renderVehicleMake(){
    return this.state.makes.map(make=>
      <TouchableOpacity key={make} style={styles.selectionItem} onPress={ ()=>{this.makeSelected(make);}}><Text style={styles.selectionItemText}>{make}</Text></TouchableOpacity>
    );
  }

  renderVehicleModel(){
    return this.state.models.map(model=>
      <TouchableOpacity key={model.id} style={styles.selectionItem} onPress={ ()=>{this.modelSelected(model.id);}}><Text style={styles.selectionItemText}>{model.model}</Text></TouchableOpacity>
    );
  }

  changeVehicleDetails(vehicleId){
    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({
      stage: "details",
      selectedId: vehicleId
    });
  }

  detailsBackButton(){
    LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({
      stage:"model",
      selectedId:""
    })
  }

  render() {
    //Fetching catalog notice
    if(this.state.stage=="loading_catalog"){
      return(
        <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
        <View style={styles.fetchLoading}>
          <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:10}}/>
          <Text style={styles.loadingMessage}>Syncing the catalog. Please wait...</Text>
        </View>
        </ImageBackground>
      );

    //Year selection
    }else if(this.state.stage=="no_data"){
      return(
        <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
        <View style={styles.fetchLoading}>
          <Text style={styles.loadingMessage}>Catalog not available. Please enable a data connection.</Text>
        </View>
        </ImageBackground>
      );

    //Year selection
    }else if(this.state.stage=="year"){
      if(this.state.years.length){
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View style={styles.searchWrap}>
            <View style={styles.searchTitleWrap}>
                  <Text style={styles.searchTitle}>Choose a Vehicle Year</Text>
              </View>
            <ScrollView style={styles.searchListWrap}>{this.renderVehicleYear()}</ScrollView>
          </View>
          </ImageBackground>
        );
      }else{
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View style={styles.searchWrap}>
            <View style={styles.searchTitleWrap}>
                  <Text style={styles.searchTitle}>Choose a Vehicle Year</Text>
              </View>
            <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:10}}/>
          </View>
          </ImageBackground>
        );
      }

    //Make selection
    }else if(this.state.stage=="make"){
      if(this.state.makes.length){
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchTitleOpaque} onPress={()=>{ LayoutAnimation.configureNext(CustomLayoutSpring); this.setState({stage:"year"})}}>Vehicle Year: {this.state.selectedYear}</Text>
            <View style={styles.searchTitleWrap}>
                <Text style={styles.searchTitle}>Choose a Vehicle Make</Text>
            </View>
            <ScrollView style={styles.searchListWrap}>{this.renderVehicleMake()}</ScrollView>
          </View>
          </ImageBackground>
        );
      }else{
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchTitleOpaque}>Vehicle Year: {this.state.selectedYear}</Text>
            <View style={styles.searchTitleWrap}>
                <Text style={styles.searchTitle}>Choose a Vehicle Make</Text>
            </View>
            <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:10}}/>
          </View>
          </ImageBackground>
        );
      }

    //Model selection
    }else if(this.state.stage=="model"){
      if(this.state.models.length){
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchTitleOpaque} onPress={()=>{ LayoutAnimation.configureNext(CustomLayoutSpring); this.setState({stage:"year"})}}>Vehicle Year: {this.state.selectedYear}</Text>
            <Text style={styles.searchTitleOpaque} onPress={()=>{ LayoutAnimation.configureNext(CustomLayoutSpring); this.setState({stage:"make"})}}>Vehicle Make: {this.state.selectedMake}</Text>
            <View style={styles.searchTitleWrap}>
                <Text style={styles.searchTitle}>Choose a Vehicle Model</Text>
            </View>
            <ScrollView style={styles.searchListWrap}>{this.renderVehicleModel()}</ScrollView>
          </View>
          </ImageBackground>
        );
      }else{
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <View>
            <Text style={styles.searchTitleOpaque} onPress={()=>{ LayoutAnimation.configureNext(CustomLayoutSpring); this.setState({stage:"year"})}}>Vehicle Year: {this.state.selectedYear}</Text>
            <Text style={styles.searchTitleOpaque} onPress={()=>{ LayoutAnimation.configureNext(CustomLayoutSpring); this.setState({stage:"make"})}}>Vehicle Make: {this.state.selectedMake}</Text>
            <View style={styles.searchTitleWrap}>
                <Text style={styles.searchTitle}>Choose a Vehicle Model</Text>
            </View>
            <ActivityIndicator size="large" color="#F3C72F" style={styles.loadingIcon}/>
          </View>
          </ImageBackground>
        );
      }
    }else if(this.state.stage=="details"){
      if(this.props.isConnected){
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <VehicleDetails vehicleId={this.state.selectedId} changeVehicleDetails={this.changeVehicleDetails.bind(this)} detailsBackButton={this.detailsBackButton.bind(this)}/>
          </ImageBackground>
        );
      }else{
        return (
          <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
          <VehicleDetailsOffline vehicleId={this.state.selectedId} changeVehicleDetails={this.changeVehicleDetails.bind(this)} detailsBackButton={this.detailsBackButton.bind(this)}/>
          </ImageBackground>
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  pageBg:{
    flex:1
  },
  searchWrap: {
    backgroundColor: 'rgba(23, 23, 23, 0.4)',
    margin:5,
    position: 'relative',
    flex:1
  },
  searchTitleWrap: {
    backgroundColor:'rgba(23, 23, 23, 0.4)',
    padding:8
  },
  searchTitle: {
      color:"#F3C72F",
      textAlign:"center",
      fontFamily:"Open Sans Condensed Bold",
      fontSize:20,
      padding:8
  },
  searchTitleOpaque:{
    color:"#F3C72F",
    textAlign:"center",
    fontFamily:"Open Sans Condensed Bold",
    fontSize:20,
    backgroundColor:'rgba(23, 23, 23, 0.4)',
    padding:8,
    opacity:.5
  },
  loadingMessage:{
    textAlign:"center", 
    color:"#ffffff", 
    fontFamily:"Open Sans Condensed",
    fontSize:18,
    marginTop:20
  },
  searchListWrap:{
    
  },
  selectionItem: {
    backgroundColor:"#fff",
    padding:10,
    borderBottomColor:"#eee",
    borderBottomWidth:2,
  },
  selectionItemText:{
    textAlign:"center",
    fontFamily:"Open Sans Condensed",
    fontSize:17
  },
  loadingIcon:{
    marginTop:30
  },
  fetchLoading:{
    marginTop:30
  },
  loadingMessage:{
    textAlign:"center",
    fontFamily:"Open Sans Condensed",
    fontSize:19,
    color:"#ffffff", 
    margin:20
  }
});