import React, { Component } from 'react';
import {
  AppRegistry,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { phonecall } from 'react-native-communications';

import { PhoneCaller } from './src/components/NativeModules';

import RNFS from 'react-native-fs';
import Papa from 'papaparse';

//https://www.npmjs.com/package/react-native-table-component
import { Table, Row, Rows } from 'react-native-table-component';

import { Card, CardSection, Button } from './src/common';
import Header from './src/common/Header';
//import Router from './src/router';
//import DriveByHome from './src/components/DriveByHome.js';

// create a component
export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      numContacts: 0,
      tableHead: ['Name', 'Number'],
      phoneList: [['', '']]
     };
     console.log(this.props.fileName);
     this.parseFile(this.props.fileName);
  }
  onTextPress() {
//    phonecall(this.state.phoneList[this.state.index][1], false);
    PhoneCaller.makeCall('tel:7988956271');
    this.circularIncrement();
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
    // console.log(this.props);
    // console.log(this.state.phoneList);
    //RNImmediatePhoneCall.immediatePhoneCall('0123456789');
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
                <Button>
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
