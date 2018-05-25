package com.driveby;
import android.util.Log;
import android.content.Intent;
import android.net.Uri;


import com.facebook.react.ReactActivity;

public class PhoneCallerActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "driveby";
    }

    public void makeCall(String phoneNumber) {
      Intent intent = new Intent(Intent.ACTION_CALL);
      intent.setData(Uri.parse(phoneNumber));
      startActivity(intent);
      Log.w(phoneNumber, "############################arg2");
    }

}
