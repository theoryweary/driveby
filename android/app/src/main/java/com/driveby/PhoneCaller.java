package com.driveby;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.content.Intent;
import android.net.Uri;



public class PhoneCaller extends ReactContextBaseJavaModule {

  public PhoneCaller(ReactApplicationContext reactContext) {
    super(reactContext);
  }
  @Override
  public String getName() {
    return "PhoneCaller";
  }


  @ReactMethod
  public void makeCall(String phoneNumber) {
    new PhoneCallerActivity().makeCall(phoneNumber);
  }

}
