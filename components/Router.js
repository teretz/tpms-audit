import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import SearchType from './SearchType';
import VinScanner from './VinScanner';
import PartFinderSearch from './PartFinderSearch';
import CodeLookup from './CodeLookup';
import TrainingVideos from './TrainingVideos';
import Contact from './Contact';

export default class RouterComponent extends Component {

    render(){
        return(
            <Router>
                <Scene key="root" hideNavBar>
                    <Scene key="partFinderSearch" hideNavBar>
                        <Scene key="searchType" component={SearchType} title="Search Type" isConnected={this.props.isConnected} initial barcodeScanner={this.props.barcodeScanner}/>
                        <Scene key="vinScanner" component={VinScanner} title="Vin Scanner" isConnected={this.props.isConnected} barcodeScanner={this.props.barcodeScanner}/>
                        <Scene key="partFinderSearch2" component={PartFinderSearch} title="Part Finder" isConnected={this.props.isConnected}/>
                    </Scene>
                    <Scene key="codeLookup" hideNavBar>
                        <Scene key="codeLookup2" component={CodeLookup} title="Code Lookup" isConnected={this.props.isConnected}/>
                    </Scene>
                    <Scene key="trainingVideos" hideNavBar>
                        <Scene key="trainingVideos2" component={TrainingVideos} title="Training Videos" isConnected={this.props.isConnected}/>
                    </Scene>
                    <Scene key="contact" hideNavBar>
                        <Scene key="contact2" component={Contact} title="Contact" />
                    </Scene>
                </Scene>
            </Router>
        );
    }
}
