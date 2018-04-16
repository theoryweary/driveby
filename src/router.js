import React from 'react';
//import { Scene, Router } from 'react-native-router-flux';
import Scene from '../node_modules/react-native-router-flux/src/Scene.js';
import Router from '../node_modules/react-native-router-flux/src/Router.js'
import DriveByHome from './components/DriveByHome.js';


const RouterComponent = () => {
  return (
      <Router>
        <Scene key="root">
          <Scene key="home" component={DriveByHome} title="DriveByHome" />
        </Scene>
      </Router>
  );
};

export default RouterComponent;
