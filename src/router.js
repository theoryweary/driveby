import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import index from '../';


const RouterComponent = () => {
  return (
      <Router>
        <Scene key="root">
          <Scene key="index" component={index} title="DriveBy Home" />
        </Scene>
      </Router>
  );
};

export default RouterComponent;
