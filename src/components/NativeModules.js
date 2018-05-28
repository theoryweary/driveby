import { NativeModules } from 'react-native';


//module.exports = NativeModules.FileHandler;
//module.exports = NativeModules.PhoneCaller;
const PhoneCaller = NativeModules.PhoneCaller;
const TestExport = NativeModules.TestExport;

export { PhoneCaller, TestExport };
