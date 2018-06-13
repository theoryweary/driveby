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
import { Container, Content, Button, Picker, Form } from 'native-base';

import { PhoneCaller } from './src/components/NativeModules';
import { Card, CardSection, } from './src/common';
import Header from './src/common/Header';
//import Router from './src/router';
//import DriveByHome from './src/components/DriveByHome.js';

export class App extends Component {
  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      index: 0,
      phoneList: [], //['', '']
      appState: AppState.currentState,
      autoDial: false,
      callStartTime: null,
      callEndTime: null,
      msBetweenCalls: 5000,
      msToNextCall: 0,
    };
  }

  componentDidMount() {
    this.mountAndroid();
    this.mountiOS();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  mountAndroid() {
    if (Platform.OS === 'android') {
      console.log('Platform android');
      Linking.getInitialURL().then(url => {
        if (url) {
          this.parseFile(url);
        }
      });
    }
  }

  mountiOS() {
    if (Platform.OS === 'ios') {
         Linking.addEventListener('url', this.handleOpenURL);
       }
  }

  componentWillUnmount() {
    unmountiOS();
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  unmountiOS() {
    if (Platform.OS === 'ios') {
      Linking.removeEventListener('url', this.handleOpenURL);
    }
  }

  resetBetweenCalls() {
    this.setState({
      callStartTime: null,
      callEndTime: new Date(),
      msToNextCall: this.state.msBetweenCalls
    })
  }


  handleAppStateChange = (nextAppState) => {
    const callIsNotInitiatied = !this.state.callStartTime;
    if (callIsNotInitiatied) { return; }

    //App state flips twice when first making the call, so we need to wait a second before checking.
    const appStateNotSettled  = (new Date() - this.state.callStartTime) < 1000;
    if ( appStateNotSettled) { return; }

    const returnsToApp = nextAppState === 'active';
    if (returnsToApp && this.state.autoDial) {
      this.resetBetweenCalls();

      this.startCallCountdownUI();

      this.startCallInXTime(this.state.msBetweenCalls);
    }

    this.setState({ appState: nextAppState }); //necessary for AppState
  }

  makeCall() {
    if (this.state.autoDial) {
      this.circularIncrement();
      this.makeCallAndroid();
      this.makeCalliOS();
    }
  }

  makeCallAndroid() {
    if (Platform.OS === 'android') {
      PhoneCaller.makeCall(`tel:${this.state.phoneList[this.state.index][1]}`);
      this.setState({ callStartTime: new Date(), callEndTime: null });
    }
  }

  makeCalliOS() {
    if (Platform.OS === 'ios') {
      Linking.openURL(`tel:${this.state.phoneList[this.state.index][1]}`)
      .then((_successMessage) => {
        this.setState({ callStartTime: new Date(), callEndTime: null });
        this.circularIncrement();
      })
      .catch((err) => {
        this.setState({ callStartTime: null, autoDial: false });
      });

      //When user waits too long to click OK, circularIncrement is not called even though the call goes through on iOS.
      //This causes the user to call the same person twice
    }
  }


  onTextPress() {
    this.makeCall();
    this.setState({ autoDial: true });
  }

  onStopCallingButton() {
    this.setState({ autoDial: false, msToNextCall: 0 });
  }


  handleOpenURL = (event) => {
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
    try {
      RNFS.readFile(filePath).then((contents) => {
        console.log(contents);
        this.setState({
          phoneList: Papa.parse(contents).data
        });
        this.setState({
          numContacts: this.state.phoneList.length
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

  startCallInXTime(msBetweenCalls) {
    setTimeout(
      () => {
        this.makeCall();
      },
      msBetweenCalls
    );
  }

  startCallCountdownUI = () => {
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

  displayStartCallCountdownUI() {
    if (this.state.msToNextCall === 0) { return 'Call'; }

    return (
      `Seconds to next call: ${Math.round(this.state.msToNextCall / 1000)}, calling:`
    );
  }

//disable call button if no contacts are added
  callButtonText() {
    if (this.state.phoneList.length === 0) {
      return 'Load some contacts';
    }

      return  `Call: ${this.state.phoneList[this.state.index][0]}`;
    }


  handlemsBetweenCallsPickerUpdate(value) {
    this.setState({ msBetweenCalls: value });
  }

  // <Text>
  //   Name: {this.state.phoneList[this.state.index][0] }
  //   {'\n'} Number: { this.state.phoneList[this.state.index][1] }
  //   {'\n'} Contacts Loaded: { this.state.phoneList.length }
  //   {'\n'} # Contacts left to call: { this.state.phoneList.length
  //       - this.state.index }
  // </Text>
  //
  render() {
    return (
        <View style={styles.mainViewStyle}>
          <Header style={{ flex: 1 }} headerText={'Driveby'} />
          <Card>
            <CardSection>
                <Button onPress={this.onTextPress.bind(this)}>
                  <Text> {this.callButtonText()} </Text>
                </Button>
            </CardSection>

            <Text> {this.displayStartCallCountdownUI()}</Text>

            <CardSection>
                <Button onPress={this.onStopCallingButton.bind(this)}>
                <Text> Stop Calling </Text>
                </Button>
            </CardSection>
          </Card>


          <Container>
            <Content>
              <Form>
               <Text>Choose Delay Between Calls</Text>
                <Picker
                    iosHeader="Contact Type"
                    mode="dropdown"
                    selectedValue={`${this.state.msBetweenCalls / 1000} 'Seconds'`}
                    onValueChange={this.handlemsBetweenCallsPickerUpdate.bind(this)}
                >
                    <Picker.Item label="3 Seconds" value='3000' />
                    <Picker.Item label="5 Seconds" value='5000' />
                    <Picker.Item label="10 Seconds" value='10000' />
                    <Picker.Item label="20 Seconds" value='20000' />
                  </Picker>
              </Form>
            </Content>
          </Container>


          <ScrollView style={styles.scrollViewStyle}>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row data={['Name', 'Number']} style={styles.head} textStyle={styles.text} />
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
