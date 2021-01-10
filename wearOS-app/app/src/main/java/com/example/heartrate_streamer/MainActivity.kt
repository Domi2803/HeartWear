package com.example.heartrate_streamer

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener2
import android.hardware.SensorManager
import android.opengl.Visibility
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.support.wearable.activity.WearableActivity
import android.util.Log
import android.view.GestureDetector
import android.view.GestureDetector.SimpleOnGestureListener
import android.view.MotionEvent
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import kotlinx.android.synthetic.main.activity_main.*
import kotlin.math.roundToInt


class MainActivity : WearableActivity(), SensorEventListener2 {
    private lateinit var  mGoogleSignInClient: GoogleSignInClient;
    private val RC_SIGN_IN: Int = 8562;
    private lateinit var mSensorManager : SensorManager;
    private lateinit var mHeartRateSensor: Sensor;
    private lateinit var auth: FirebaseAuth;
    private lateinit var currentUser : FirebaseUser;
    private lateinit var database: DatabaseReference;
    private lateinit var gestureDetector: GestureDetector;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        checkPermission(android.Manifest.permission.BODY_SENSORS, 100);

        // Enables Always-on
        setAmbientEnabled()

        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        auth = Firebase.auth;

        // Long press to show/hide UI for energy saving.
        mainScreen.setOnLongClickListener{
            if(textBPM.visibility == View.VISIBLE)
                Toast.makeText(this, "Long press to show UI again", Toast.LENGTH_LONG).show();

            textBPM.visibility = if(textBPM.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            textCode.visibility = if(textCode.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            titleText.visibility = if(titleText.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            true;
        }

    }



    fun checkPermission(permission: String, requestCode: Int) {
        if (ContextCompat.checkSelfPermission(this@MainActivity, permission)
            == PackageManager.PERMISSION_DENIED
        ) {
            // Requesting the permission
            ActivityCompat.requestPermissions(this@MainActivity, arrayOf(permission), requestCode)
        }
    }

    override fun onStart() {
        super.onStart();

        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()

        this.mGoogleSignInClient = GoogleSignIn.getClient(this, gso);

        // Start the Google Sign In intent.
        val signInIntent = this.mGoogleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)

    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                // Google Sign In was successful, authenticate with Firebase
                val account = task.getResult(ApiException::class.java)!!

                firebaseAuthWithGoogle(account.idToken!!)
            } catch (e: ApiException) {
                // Google Sign In failed
                Log.w("error", "Google sign in failed", e)

                // TODO: Handle failed Sign in
            }
        }
    }


    private fun firebaseAuthWithGoogle(idToken: String) {
        val credential = GoogleAuthProvider.getCredential(idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign in success
                    val user = auth.currentUser
                    database = Firebase.database.reference;
                } else {
                    // TODO: If sign in fails, display a message to the user.
                    Log.w("error", "signInWithCredential:failure", task.exception)
                }
            }
    }

    override fun onResume() {
        super.onResume();
        mHeartRateSensor?.also { heartRate ->
            mSensorManager.registerListener(this, heartRate, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onPause() {
        super.onPause()
        mSensorManager.unregisterListener(this);
    }

    override fun onAccuracyChanged(p0: Sensor?, p1: Int) {
    }

    override fun onFlushCompleted(p0: Sensor?) {
    }

    private var oldRoundedHeartRate : Int = 0;
    private var oldBatteryPercent : Int = 0;

    // Called when the sensor has a new value
    @SuppressLint("SetTextI18n")
    override fun onSensorChanged(p0: SensorEvent?) {
        var heartRate = p0?.values?.get(0);
        if(heartRate == null) return;

        var roundedHeartRate = (heartRate!!).roundToInt();
        if(roundedHeartRate == oldRoundedHeartRate) return;     // If the heart rate only changes a bit, don't bother to update the database.

        textBPM.text = roundedHeartRate.toString() + "bpm";  // Update UI Text

        if(auth.currentUser != null){
            var timestamp = System.currentTimeMillis();

            oldRoundedHeartRate = roundedHeartRate;
            var userDatabaseObject = this.database.child(auth.currentUser!!.uid.toString());
            userDatabaseObject.child("currentHR").setValue(heartRate);  // Update current heart rate in the database
            userDatabaseObject.child("lastUpdateTimestamp").setValue(timestamp);    // set timestamp

            val batteryPercent = getBatteryPercentage(this);
            if(batteryPercent != oldBatteryPercent){
                oldBatteryPercent = batteryPercent;
                userDatabaseObject.child("currentBattery").setValue(batteryPercent);
            }
        }

    }

    private fun getBatteryPercentage(context: Context): Int {
        return if (Build.VERSION.SDK_INT >= 21) {
            val bm: BatteryManager =
                context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
            bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        } else {
            val iFilter = IntentFilter(Intent.ACTION_BATTERY_CHANGED)
            val batteryStatus = context.registerReceiver(null, iFilter)
            val level = batteryStatus?.getIntExtra(
                BatteryManager.EXTRA_LEVEL,
                -1
            ) ?: -1
            val scale = batteryStatus?.getIntExtra(
                BatteryManager.EXTRA_SCALE,
                -1
            ) ?: -1
            val batteryPct = level / scale.toDouble()
            (batteryPct * 100).toInt()
        }
    }
}


