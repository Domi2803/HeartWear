# HeartWear - Add your Heartrate into OBS


<a href="https://play.google.com/store/apps/details?id=de.domi2803.heartrate_streamer"><img width=200 src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" /></a>

 
Heartwear is an app for wearOS and Tizen Smartwatches that can be used to integrate the heart rate sensor of your watch into your livestreams. The app uses Google Firebase as backend and stream your heart rate to a website with a personalized embed link, which can be integrated into OBS or any compatible streaming software as a Browser Source.

![demonstration picture](https://i.imgur.com/hhHYXAp.jpg)

# How it works

- Download the app on your smartwatch
- Login with your Google Account on the smartwatch
- Go to heartwear.web.app and login with the same Google Account
- Grab the embed link and paste it into a OBS browser source
- That's it! :)

This repository contains the full source code for the app. You can follow along if you want to deploy HeartWear on your own Firebase backend. If you just want a working version, you can buy the App on the Play Store and support me directly [ much apprechiated :) ]

# Deploy it yourself

First, start by creating a firebase account at https://firebase.google.com/. The free plan will propably do. Create a new project on the Firebase console and then follow along with these steps:

Go into the backend folder and run

    npm install

create a React build with

    npm run-script build

Install the Firebase SDK with

    npm i -g firebase-tools

and login to your Firebase account

    firebase login

Run:

    firebase use --add

and select the project you made on firebase.

Then run:

    firebase deploy

Lastly, go into your Firebase console and go into `Authentication`. Go to Sign-In methods and enable ``Google Sign In``.

And now you should be good to go on the backend side.

---

Go to your firebase dashboard and create a new Android app. Fill out the form and download the google-services.json file and copy it into `/wearOS-app/app` (there should be an empty file that indicates where to put the file)

Open the folder in Android Studio. You can edit the `activity_main.xml` so that it shows your url instead of mine. 

Go to ``Gradle`` and select `Android -> Signing Report` and grab the SHA-1 and SHA-256 of the Debug Keystore that will be shown in the console. Go into your firebase console and add the hashes to your Android application. This is necessary so that Sign In with Google works properly.

Now compile the app and you should be ready to go.

Have fun! :)

