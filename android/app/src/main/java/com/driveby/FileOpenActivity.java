package com.driveby;
import android.net.Uri;
import android.util.Log;
import android.os.Bundle;
import com.facebook.react.ReactActivity;

public class FileOpenActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "driveby";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {

      Log.w("#############", "Beginning OnCreate String");
      super.onCreate(savedInstanceState);

      Uri data = getIntent().getData();
      if(data!=null) {
        getIntent().setData(null);
        try {
          Log.w("#############", data.toString());
        } catch (Exception e) {
          // warn user about bad data here
          finish();
          return;
        }
      }
    }
}
