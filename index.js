
// import a library to help create a component
import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { phonecall } from 'react-native-communications';

import RNFS from 'react-native-fs';
import Papa from 'papaparse';

import { Card, CardSection, Button, Header } from './src/common';
//import Router from './src/router';

// create a component
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      numContacts: 0,
      phoneList: [['', '']]
     };
     console.log(this.props.fileName);
     this.parseFile(this.props.fileName);
  }

  onTextPress() {
    phonecall(this.state.phoneList[this.state.index][1], false);
    this.circularIncrement();
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

  circularIncrement() {
    let newIndex = this.state.index + 1;
    if (newIndex >= this.state.phoneList.length) {
      newIndex = 0;
    }
    this.setState({ index: newIndex });
  }

  render() {
    // console.log(this.props);
    // console.log(this.state.phoneList);
    //RNImmediatePhoneCall.immediatePhoneCall('0123456789');
      return (
//        <driveByHome />

        <View>
          <Header style={{ flex: 1 }} headerText={'Driveby'} />
          <Card>
          <CardSection>
            <Text>
              Name: {this.state.phoneList[this.state.index][0] }
              {'\n'} Number: { this.state.phoneList[this.state.index][1] }
              {'\n'} Contacts Loaded: { this.state.numContacts }
              {'\n'} # Contacts left to call: { this.state.numContacts
                  - this.state.index }
            </Text>
          </CardSection>

            <CardSection>
                <Button onPress={this.onTextPress.bind(this)}>
                   Call {this.state.phoneList[this.state.index][0] }
                </Button>
            </CardSection>

            <CardSection>
                <Button>
                  Stop Calling
                </Button>
            </CardSection>
          </Card>
        </View>
     );
  }
}

// render our component to the device
AppRegistry.registerComponent('driveby', () => App);
