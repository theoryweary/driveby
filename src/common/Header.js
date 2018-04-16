// import libaries for making a registerComponent
import React from 'react';
import { Text, View } from 'react-native';


// make a registerComponent
const Header = (props) => {
  const { textStyle, viewStyle } = styles;
  return (
    <View style={viewStyle}>
     <Text style={textStyle}>{props.headerText}</Text>
  </View>
 );
};

const styles = {
  viewStyle: {
    backgroundColor: '#0FE7F6',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    paddingTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    elevation: 2,
    position: 'relative'

  },
  textStyle: {
    fontSize: 24

  }
};

// make the component available to other parts of the app
//export { Header };
export default Header;
