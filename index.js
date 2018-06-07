import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
  Linking,
  AppState
} from 'react-native';
import RNFS from 'react-native-fs';
import { Table, Row, Rows } from 'react-native-table-component';
//https://www.npmjs.com/package/react-native-table-component  - consider replacing this with NativeBase?

import Papa from 'papaparse';

import { PhoneCaller } from './src/components/NativeModules';
import { Card, CardSection, Button } from './src/common';
import Header from './src/common/Header';
//import Router from './src/router';
//import DriveByHome from './src/components/DriveByHome.js';

// create a component
export class App extends Component {
  constructor(props) {
    super(props);
    // this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      index: 0,
      numContacts: 0,
      tableHead: ['Name', 'Number'],
      phoneList: [['', '']],
      appState: AppState.currentState,
      autoDial: false,
      inCall: false,
     };

     console.log(this.props.fileName);
  }

  componentDidMount() { // B
    if (Platform.OS === 'android') {
      console.log('Platform android');
      Linking.getInitialURL().then(url => {
        console.log('Get initial url Ran');
        if (url) {
            this.parseFile(url);
            console.log('Parseurl Ran');
        }
      });
    } else {
        Linking.addEventListener('url', this.handleOpenURL);
    }

    console.log('componentDidMount')
    AppState.addEventListener('change', this.handleAppStateChange);
  }

    componentWillUnmount() {
      Linking.removeEventListener('url', this.handleOpenURL);
      AppState.removeEventListener('change', this.handleAppStateChange);
      console.log('componentWillUnmount')
    }

    handleAppStateChange = (nextAppState) => {
      console.log('nextAppState:');
      console.log(nextAppState);
      if (this.state.inCall) { return; }

      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && this.state.autoDial ) {
       console.log('App has come to the foreground!');
       this.circularIncrement();
       console.log('circularIncrement');

     // this.onTextPress();  //This triggers the phone call and circularIncreme
   }

   this.setState({ appState: nextAppState });
 }

 makeCall() {
   if (Platform.OS === 'android') {
     PhoneCaller.makeCall(`tel:${this.state.phoneList[this.state.index][1]}`);
             console.log('Calling');
   } else {

       Linking.openURL(`tel:${this.state.phoneList[this.state.index][1]}`)
         .catch((err) => Promise.reject(err));
   }

   this.setState({ inCall: true });
 }

    onTextPress() {
      this.makeCall();
      this.setState({ autoDial: true });
      // TestExport.testConsole();
    }

    onStopCallingButton() {
      this.setState({ autoDial: false });
    }


  handleOpenURL = (event) => { // D
    this.parseFile(event.url);
  }

  circularIncrement() {
    let newIndex = this.state.index + 1;
    if (newIndex >= this.state.phoneList.length) {
      newIndex = 0;
    }
    this.setState({ index: newIndex });
  }

  parseFile(filePath) {
    //const filePath = 'content://com.android.externalstorage.documents/document/primary%3ADownload%2FdrivebyContacts.csv';
    try {
      RNFS.readFile(filePath).then((contents) => {
        console.log(contents);
        this.setState({
          phoneList: Papa.parse(contents).data
        });
        //Set numContacts after loading the phonelist
        this.setState({
          numContacts: this.state.phoneList.length
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
      return (
        //https://github.com/StephenGrider/ReactNativeReduxCasts/blob/master/manager/src/Router.js
    //    <Router />  // Need to pass the state to DriveByHome
    //    <DriveByHome />
        <View style={styles.mainViewStyle}>
          <Header style={{ flex: 1 }} headerText={'Driveby'} />
          <Card>
            <CardSection>
                <Button onPress={this.onTextPress.bind(this)}>
                   Call {this.state.phoneList[this.state.index][0] }
                </Button>
            </CardSection>

            <CardSection>
                <Button onPress={this.onStopCallingButton.bind(this)}>
                  Stop Calling
                </Button>
            </CardSection>
          </Card>

          <CardSection>
            <Text>
              Name: {this.state.phoneList[this.state.index][0] }
              {'\n'} Number: { this.state.phoneList[this.state.index][1] }
              {'\n'} Contacts Loaded: { this.state.numContacts }
              {'\n'} # Contacts left to call: { this.state.numContacts
                  - this.state.index }
            </Text>
          </CardSection>

          <ScrollView style={styles.scrollViewStyle}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={this.state.tableHead} style={styles.head} textStyle={styles.text} />
              <Rows data={this.state.phoneList} textStyle={styles.text} />
            </Table>
          </ScrollView>
        </View>
     );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
  scrollViewStyle: { backgroundColor: '#51FA88' },
  mainViewStyle: { backgroundColor: '#fff' } //#fff is white  https://htmlcolorcodes.com/
});

// render our component to the device
AppRegistry.registerComponent('driveby', () => App);
