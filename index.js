
// import a library to help create a component
import React, { Component } from 'react';
import { AppRegistry, View, Text } from 'react-native';
import { phonecall } from 'react-native-communications';

import RNFS from 'react-native-fs';
import Papa from 'papaparse';

import { Card, CardSection, Button } from './src/common';
import Header from './src/common/Header';


//import FileHandler from './src/components/FileHandler';


// const phoneList = [
//   { name: 'Walter Melon',
//   number:	'(978) 709-1111' },
//   { name: 'Nick R. Bocker',
//   number: '(978) 709-2222' }];

// create a component
export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      phoneList: []
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
    RNFS.readFile(filePath).then((contents) => {
      console.log(contents);
      this.setState({
        phoneList: Papa.parse(contents).data
      });
    });
  }

  circularIncrement() {
    let newIndex = this.state.index + 1;
    if (newIndex >= this.state.phoneList.length) {
      newIndex = 0;
    }
    this.setState({ index: newIndex });
  }

  render() {
    console.log('First');
    console.log(this.props);
    console.log('DriveBy!');
    console.log(this.state.phoneList);
    //RNImmediatePhoneCall.immediatePhoneCall('0123456789');
      return (
        <View>
          <Header style={{ flex: 1 }} headerText={'Driveby'} />
          <Card>
            <CardSection>
                <Button>
                  Load CSV with Peeps to call
                </Button>
            </CardSection>

            <CardSection>
                <Button onPress={this.onTextPress.bind(this)}>
                   Call Next Person
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

// render it to the device
AppRegistry.registerComponent('driveby', () => App);
