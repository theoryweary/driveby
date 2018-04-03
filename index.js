
// import a library to help create a component
import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import { phonecall } from 'react-native-communications';
//import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
// or https://www.npmjs.com/package/react-native-immediate-phone-call ?
import Header from './src/common/Header';
import { Card, CardSection, Button } from './src/common';


const phoneList = [
  { name: 'Walter Melon',
  number:	'(978) 709-1111' },
  { name: 'Nick R. Bocker',
  number: '(978) 709-2222' }];

// create a component
//const App = () => {
export class App extends Component {
  state={ index: 0 };

  onTextPress() {
    phonecall(phoneList[this.state.index].number, false);
    this.circularIncrement();
  }

  circularIncrement() {
    let newIndex = this.state.index + 1;
    if (newIndex >= phoneList.length) {
      newIndex = 0;
    }
    this.setState({ index: newIndex });
  }

  render() {

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
