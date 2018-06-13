import React from 'react';
import {} from 'react-native';


import { Container, Content, Button, Picker, Form } from 'native-base';
import { Table, Row, Rows } from 'react-native-table-component';
//https://www.npmjs.com/package/react-native-table-component  - consider replacing this with NativeBase?

import Header from './src/common/Header';


class DriveByHome extends Component {
  render() {
    return (
        <View style={styles.mainViewStyle}>
          <Header style={{ flex: 1 }} headerText={'Driveby'} />
          <Card>
            <CardSection>
                <Button onPress={this.onCallButtonPress.bind(this)}>
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

export default DriveByHome;
