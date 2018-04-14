package com.driveby;
import android.net.Uri;
import android.util.Log;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import android.app.Activity;

public class FileOpenActivity extends ReactActivity {

  /**
  * Returns the name of the main component registered from JavaScript.
  * This is used to schedule rendering of the component.
  */
  @Override
  protected String getMainComponentName() {
    return "driveby";
  }

  public class TestActivityDelegate extends ReactActivityDelegate {
    public TestActivityDelegate(Activity activity, String mainComponentName) {
      super(activity, mainComponentName);
      Log.w("#############", "We are in the FileOpenActivity/TestActivityDelegate  ##########################");

      //  this.mActivity = activity;
    }

    @Override
    protected Bundle getLaunchOptions() {
      Uri data = getIntent().getData();
      Bundle b = new Bundle();

      if(data!=null) {
        getIntent().setData(null);

        try {
          b.putString("fileName", data.toString());
          Log.w("#############", data.toString());
          return b;
        } catch (Exception e) {
          // warn user about bad data here
          finish();
          return b;
        }
      }
      return b;
    }

  }

  @Override
  public ReactActivityDelegate createReactActivityDelegate() {
    Log.w("#############", "We are in the FileOpenActivity/createReactActivityDelegate  ##########################");
    return new TestActivityDelegate(this, getMainComponentName());
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {

    Log.w("#############", "Beginning OnCreate String");
    super.onCreate(savedInstanceState);
    return;
  }
}
