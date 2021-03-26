package com.example.heartrate_streamer

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener2
import android.hardware.SensorManager
import android.os.BatteryManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import kotlin.math.roundToInt


class HeartRateService : Service(), SensorEventListener2 {
    private final var STOP_ACTION = "STOP_ACTION";
    private lateinit var mSensorManager : SensorManager;
    private lateinit var mHeartRateSensor: Sensor;
    private lateinit var auth: FirebaseAuth;
    private lateinit var currentUser : FirebaseUser;

    private lateinit var wakeLock : PowerManager.WakeLock;

    private val broadcastReceiver: BroadcastReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent) {
            if(intent.action == STOP_ACTION){
               stopSelf();
                android.os.Process.killProcess(android.os.Process.myPid());
            }
        }
    }


    override fun onCreate() {
        super.onCreate()
        var intentFilter = IntentFilter();
        intentFilter.addAction(STOP_ACTION);

        registerReceiver(broadcastReceiver, intentFilter);

        mSensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        wakeLock = (getSystemService(Context.POWER_SERVICE) as PowerManager).run{
            newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "HeartWear::BackgroundStreaming").apply{
                acquire();
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()

        unregisterReceiver(broadcastReceiver);
        mSensorManager.unregisterListener(this);

        wakeLock.release();
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        createNotificationChannel();
        var notificationIntent = Intent(this, MainActivity::class.java);
        val pendingIntent = PendingIntent.getActivity(
            this,
            0, notificationIntent, 0
        )

        val stopIntent = Intent();
        stopIntent.action = STOP_ACTION;
        var pendingIntentStopAction = PendingIntent.getBroadcast(this, 12345, stopIntent, PendingIntent.FLAG_UPDATE_CURRENT);



        val notification = NotificationCompat.Builder(this, "hrservice")
            .setContentTitle("HeartWear")
            .setContentText("Streaming heart rate in the background...")
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", pendingIntentStopAction)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentIntent(pendingIntent)
            .build();

        startForeground(1, notification)

        mHeartRateSensor?.also { heartRate ->
            mSensorManager.registerListener(this, heartRate, SensorManager.SENSOR_DELAY_NORMAL)
        }

        return START_STICKY;
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    private fun createNotificationChannel(){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                "hrservice",
                "HeartWear Background Service",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager =
                getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(serviceChannel)
        }
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
        var heartRate: Float? = p0?.values?.get(0) ?: return;
        var roundedHeartRate = (heartRate!!).roundToInt();
        if(roundedHeartRate == oldRoundedHeartRate) return;     // If the heart rate only changes a bit, don't bother to update the database.

        //textBPM.text = roundedHeartRate.toString() + "bpm";  // Update UI Text
        var updateHRIntent = Intent();
        updateHRIntent.action = "updateHR";
        updateHRIntent.putExtra("bpm", roundedHeartRate);
        this.sendBroadcast(updateHRIntent);

        if(Firebase.auth.currentUser != null){
            var database = Firebase.database.reference;
            var timestamp = System.currentTimeMillis();

            oldRoundedHeartRate = roundedHeartRate;
            var userDatabaseObject = database.child(Firebase.auth.currentUser!!.uid.toString());
            userDatabaseObject.child("currentHR").setValue(roundedHeartRate);  // Update current heart rate in the database
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
