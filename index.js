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

export class App extends Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      index: 0,
      numContacts: 0,
      tableHead: ['Name', 'Number'],
      phoneList: [['', '']],
      appState: AppState.currentState,
      autoDial: false,
      callStartTime: null,
      callEndTime: null,
      inCall: false,
      msBetweenCalls: 5000,
      msToNextCall: 0,
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

      console.log(`Autodial:  ${this.state.autoDial}`);
      if (!this.state.callStartTime) { return; }

      if ((new Date() - this.state.callStartTime) < 1000) { return; }

// this.state.appState.match(/inactive|background/) &&
      if (nextAppState === 'active' && this.state.autoDial) {
       console.log('App has come to the foreground!');
       this.circularIncrement();
       console.log('circularIncrement');
       this.setState({
         callStartTime: null,
         callEndTime: new Date(),
          msToNextCall: this.state.msBetweenCalls
        });

       this.timeToCall();
       setTimeout(() => {
         if (this.state.autoDial) {
           this.makeCall();  //This triggers the phone call and circularIncreme
         }
       },
       this.state.msBetweenCalls
     );
    }

   this.setState({ appState: nextAppState });
 }

 makeCall() {
   if (Platform.OS === 'android') {
      PhoneCaller.makeCall(`tel:${this.state.phoneList[this.state.index][1]}`);
         console.log('Calling');
         this.setState({ callStartTime: new Date(), callEndTime: null });
   } else {
       Linking.openURL(`tel:${this.state.phoneList[this.state.index][1]}`)
        .then(this.setState({ callStartTime: new Date(), callEndTime: null }))
         .catch((err) => Promise.reject(err));
   }
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

  timeToCall = () => {
    if (!this.state.callEndTime) { return; }

    const endTimeDiff = new Date() - this.state.callEndTime;
    if (endTimeDiff > this.state.msBetweenCalls) {
      this.setState({ msToNextCall: 0 });
    } else {
      this.setState({ msToNextCall: (this.state.msBetweenCalls - endTimeDiff) });
      setTimeout(this.timeToCall,
      100);
    }
  }

  displayTimeToCall() {
    if (this.state.msToNextCall === 0) { return; }
//Add Rounding
    return (`Seconds to next call: ${this.state.msToNextCall / 1000}`);
    }

//possibly add option to select time delay to next call.
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
                    Call {this.state.phoneList[this.state.index][0]}
                </Button>
            </CardSection>

            <Text> {this.displayTimeToCall()}</Text>

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
