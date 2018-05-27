package com.driveby;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import android.content.Intent;
import android.net.Uri;
import android.app.Activity;
import android.Manifest;
import android.support.v4.content.ContextCompat;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;


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

   Activity thisActivity = getCurrentActivity();
    if (ContextCompat.checkSelfPermission(thisActivity,
        Manifest.permission.CALL_PHONE)
        != PackageManager.PERMISSION_GRANTED) {

          // Permission is not granted
         // Should we show an explanation?
         if (ActivityCompat.shouldShowRequestPermissionRationale(thisActivity,
                 Manifest.permission.CALL_PHONE)) {
             // Show an explanation to the user *asynchronously* -- don't block
             // this thread waiting for the user's response! After the user
             // sees the explanation, try again to request the permission.
         } else {
             // No explanation needed; request the permission
             ActivityCompat.requestPermissions(thisActivity,
                     new String[]{Manifest.permission.CALL_PHONE},
                     1);

             // MY_PERMISSIONS_REQUEST_PHONE_CALL is an
             // app-defined int constant. The callback method gets the
             // result of the request.
         }
     } else {
         // Permission has already been granted
         Intent intent = new Intent(Intent.ACTION_CALL);
         intent.setData(Uri.parse(phoneNumber));
         getReactApplicationContext().startActivity(intent);
         Log.w(phoneNumber, "############################arg2");
     }



  }

}
