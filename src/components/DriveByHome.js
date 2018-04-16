
import React, { Component } from 'react';
//https://www.npmjs.com/package/react-native-table-component
import { Table, Row, Rows } from 'react-native-table-component';

import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Card, CardSection, Button, Header } from '../common';

class DriveByHome extends Component {
  render() {
    return (
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

export default DriveByHome;
