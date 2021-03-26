package com.example.heartrate_streamer

import android.annotation.SuppressLint
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.hardware.SensorEventListener2
import android.os.Bundle
import android.support.wearable.activity.WearableActivity
import android.util.Log
import android.view.GestureDetector
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.android.synthetic.main.activity_main.*


class MainActivity : WearableActivity() {
    private lateinit var  mGoogleSignInClient: GoogleSignInClient;
    private val RC_SIGN_IN: Int = 8562;

    private lateinit var gestureDetector: GestureDetector;

    private var broadcastReceiver = object : BroadcastReceiver() {
        @SuppressLint("SetTextI18n")
        override fun onReceive(context: Context?, intent: Intent?) {
            var bpm: Any? = intent?.extras?.get("bpm") ?: return;
            textBPM.text = "$bpm bpm";
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        checkPermission(android.Manifest.permission.BODY_SENSORS, 100);

        // Enables Always-on
        setAmbientEnabled()

        // Long press to show/hide UI for energy saving.
        mainScreen.setOnLongClickListener{
            if(textBPM.visibility == View.VISIBLE)
                Toast.makeText(this, "Long press to show UI again", Toast.LENGTH_LONG).show();

            textBPM.visibility = if(textBPM.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            textCode.visibility = if(textCode.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            titleText.visibility = if(titleText.visibility == View.VISIBLE) View.GONE else View.VISIBLE;
            true;
        }

        val filter = IntentFilter()
        filter.addAction("updateHR")
        registerReceiver(broadcastReceiver, filter)

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

        Intent(this, HeartRateService::class.java).also { intent ->
            startService(intent);
        }

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
        Firebase.auth.signInWithCredential(credential)
            .addOnCompleteListener(this) { task ->
                if (task.isSuccessful) {
                    // Sign in success
                    val user = Firebase.auth.currentUser
                } else {
                    // TODO: If sign in fails, display a message to the user.
                    Log.w("error", "signInWithCredential:failure", task.exception)
                }
            }
    }

    override fun onResume() {
        super.onResume();

    }

    override fun onPause() {
        super.onPause()


        Intent(this, HeartRateService::class.java).also { intent ->
            startService(intent);
        }

        Toast.makeText(this, "Streaming will continue in the background", Toast.LENGTH_LONG).show();
    }




}


