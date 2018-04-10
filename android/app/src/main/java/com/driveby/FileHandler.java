package com.driveby;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;


public class FileHandler extends ReactContextBaseJavaModule {

  public FileHandler(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "FileHandler";
  }

  @ReactMethod
  public void test() {
    Log.w("Some string to find#######################","arg2");
  }
}
