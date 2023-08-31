import React, { Component } from 'react';
import { ImageBackground, Text, TouchableOpacity, View, KeyboardAvoidingView, StyleSheet, TextInput, ActivityIndicator, Linking, ScrollView, Alert } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';

export default class CodeLookup extends Component {

    state = { 
        searchInput:"31R",
        fetchedPdfs:[]
    };

    searchUpdate(text){
        //console.log(text);
        //Make sure string starts with 31R
        if(text.startsWith("31R")){
            this.setState({searchInput:text});
        }else{
            this.setState({searchInput:"31R"});
        }

        

    }

    componentDidMount(){
        if(!this.state.fetchedPdfs.length){
            // Get all PDFs from API
            let fetch_url="http://tpmsnetwork.com/wp-json/tpms/get_relearn_pdfs";
            fetch(fetch_url).then((response) => response.json()).then((response) => {
                //console.log(response);  
                this.setState({ fetchedPdfs: response });
                
            }).catch(function(error) {
                Alert.alert("Server connection lost.", "Please check your data connection.");
            });
        }
    }

    getMatchingPdfs(){
        //Check the input agains the fetched list of PDFs
        let matchingPdfs=[];
        this.state.fetchedPdfs.map(pdf=> {
            if(pdf.title.startsWith(this.state.searchInput)){
                matchingPdfs.push(
                    <TouchableOpacity key={pdf.title} style={styles.pdfLink} onPress={ ()=>{Linking.openURL(pdf.pdf_link);}}><Text style={styles.pdfLinkText}>{pdf.title}</Text></TouchableOpacity>
                );
            }
        });

        return matchingPdfs;
    }

    render() {
        //console.log(this.state.fetchedPdfs.length);
        if(this.props.isConnected){
            if(!this.state.fetchedPdfs.length){
                return(
                    <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                    <View style={styles.lookupWrap}>
                        {/* <Text style={styles.searchTitle}>Code Lookup</Text> */}
                        {/* <Text style={styles.instructions}>Please enter a code below.</Text> */}

                        <ActivityIndicator size="large" color="#F3C72F" style={{marginTop:15}}/>

                    </View>
                    </ImageBackground>
                );
            }else{
                return(
                    <ImageBackground source={require('../assets/app_bg.jpg')} style={styles.pageBg}>
                    <KeyboardAvoidingView style={styles.lookupWrap} behavior="height">
                        {/* <Text style={styles.searchTitle}>Code Lookup</Text> */}
                        {/* <Text style={styles.instructions}>Please enter a code below.</Text> */}

                        <View style={styles.searchWrap}>
                            {/* <Text style={styles.searchPrefix}>31R</Text> */}
                            <TextInput
                                style={styles.searchInput}
                                onChangeText={(text)=>{this.searchUpdate(text)}}
                                value={this.state.searchInput}
                                underlineColorAndroid="transparent"
                                //autoFocus={true}
                            />
                        </View>

                        <View style={styles.pdfListWrap}>
                            <ScrollView style={styles.pdfList}>
                                {this.getMatchingPdfs()}
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                    </ImageBackground>
                );
            }
        }else{
            return(
                <View style={styles.offlineMessageWrap}>
                    <Text style={styles.offlineMessage}>Code lookup is not available offline. Please enable a data connection.</Text>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    pageBg:{
        flex:1
    },
    lookupWrap: {
      backgroundColor: 'rgba(23, 23, 23, 0.4)',
      margin:5,
      paddingBottom:20,
      flex:1
    },
    searchTitle: {
      color:"#F3C72F",
      fontFamily:"Open Sans Condensed",
      textAlign:"center",
      fontSize:20,
      backgroundColor:'rgba(23, 23, 23, 0.4)',
      padding:8
    },
    instructions: {
        padding:8,
        color:"#ffffff",
        fontFamily:"Open Sans Condensed",
        textAlign:"center"
    },
    loadingMessage:{
      textAlign:"center", 
      color:"#ffffff", 
      fontFamily:"Open Sans Condensed",
      fontSize:18,
      marginTop:20
    },
    searchWrap:{
        flexDirection: 'row',
        justifyContent:"center",
    },
    searchPrefix:{
        width:"30%",
        textAlign:"right",
        color:"#F3C72F",
        fontFamily:"Open Sans Condensed",
        fontSize:20,
        marginRight:10
    },
    searchInput:{
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        width:"70%",
        backgroundColor:"#ffffff",
        fontFamily:"Open Sans Condensed",
        fontSize:20,
        paddingLeft:20,
        paddingRight:20,
        color:"#565656",
        borderRadius:5,
        marginTop:10
    },
    pdfListWrap:{
        paddingLeft:"13%",
        paddingRight:"13%",
        // flex:1
    },
    pdfList:{
        margin:10,
    },
    pdfLink: {
        backgroundColor:"#ffffff",
        padding:8,
        borderBottomColor:"#eee",
        borderBottomWidth:1,
    },
    pdfLinkText:{
        fontFamily:"Open Sans Condensed",
        fontSize:17,
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
  });