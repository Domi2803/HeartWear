const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();


exports.getHeartrate = functions.region("europe-west1").https.onRequest(async(req,res)=>{
    var uid = req.query['uid'];
    if(uid == null){
        res.status(400).send("Please specify a uid GET-Parameter");
        return;
    }
    var snapshot = await admin.database().ref("/" + uid + "/currentHR").once('value');
    res.json({heartrate: snapshot.val()});

})