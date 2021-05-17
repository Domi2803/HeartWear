const functions = require("firebase-functions");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const fetch = require("node-fetch");

const api_key = "AIzaSyAMhp9m7k-fwfBFHvXG0WDguZbBfKvDnwM";

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

exports.getHeartrate = functions
	.region("europe-west1")
	.https.onRequest(async (req, res) => {
		var uid = req.query["uid"];
		if (uid == null) {
			res.status(400).send("Please specify a uid GET-Parameter");
			return;
		}
		var snapshot = await admin
			.database()
			.ref("/" + uid + "/currentHR")
			.once("value");
		res.json({ heartrate: snapshot.val() });
	});

exports.generateLinkCode = functions
	.region("europe-west1")
	.https.onRequest(async (req, res) => {
		var linkCodesReq = await admin.database().ref("/linkCodes").once("value");
		var linkCodesObj = linkCodesReq.val();
		var usedLinkCodes = [];
		var deletionPromise;

		if (linkCodesObj != null) {
			usedLinkCodes = Object.keys(linkCodesObj);
			deletionPromise = cleanupLinkCodes(linkCodesObj);
		}

		var possibleLinkCodes = [];

		for (var i = 0; i <= 9999; i++) {
			possibleLinkCodes.push(zeroPad(i, 4));
		}

		for (var usedLinkCode of usedLinkCodes) {
			var index = possibleLinkCodes.indexOf(usedLinkCode);
			if (index > -1) possibleLinkCodes.splice(index, 1);
		}

		var randomIndex = getRandomIndex(possibleLinkCodes.length);
		var assignedLinkCode = possibleLinkCodes[randomIndex];

		var currentTimestamp = Date.now();

		await admin
			.database()
			.ref("/linkCodes/" + assignedLinkCode)
			.set({ created: currentTimestamp });
		await deletionPromise;

		res.json({ code: assignedLinkCode });
	});

exports.setLink = functions
	.region("europe-west1")
	.https.onCall(async (data, context) => {
		if (!context.auth) {
			throw new functions.https.HttpsError(
				"failed-precondition",
				"The function must be called while authenticated"
			);
		}

		var linkCode = data.linkCode;
		var uid = context.auth.uid;

		var secret = fs.readFileSync("./private.key").toString();
		var token = jwt.sign({ uid: uid }, secret);

		var tokenReq = await admin
			.database()
			.ref("/linkCodes/" + linkCode)
			.once("value");
		var tokenVerify = tokenReq.val();

        if(!tokenVerify){
            throw new functions.https.HttpsError("not-found", "Link code not found");
        }

		await admin
			.database()
			.ref("/linkCodes/" + linkCode + "/token")
			.set(token);

		return true;
	});

exports.checkLink = functions
	.region("europe-west1")
	.https.onRequest(async (req, res) => {
		var linkCode = req.query["linkCode"];
        var cleanupPromise = cleanupLinkCodes(await (await admin.database().ref("/linkCodes/").once('value')).val());

		if (!linkCode) {
			res.sendStatus(500);
			return;
		}

		var tokenReq = await admin
			.database()
			.ref("/linkCodes/" + linkCode)
			.once("value");
		var token = tokenReq.val();

        if(!token){
            res.sendStatus(404);
            return;
        }
		res.json({ token: token.token });
        await cleanupPromise;
	});

exports.login = functions
	.region("europe-west1")
	.https.onRequest(async (req, res) => {
		var token = req.query["token"];

		if (!token) {
			res.sendStatus(500);
			return;
		}

		var secret = fs.readFileSync("./private.key").toString();
		var uid;
		try {
			var decoded = jwt.verify(token, secret);
			uid = decoded.uid;
			var customToken = await admin.auth().createCustomToken(uid);
			var loginResponse = await (await fetch(
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=" +
					api_key,
				{
					method: "POST",
					body: JSON.stringify({ token: customToken, returnSecureToken: true }),
                    headers: { 'Content-Type': 'application/json' },
				}
			)).json();

            if(!loginResponse.idToken){
                res.sendStatus(500);
                return;
            }

            

			res.json({ idToken: loginResponse.idToken, uid: uid });
		} catch (e) {
			console.error(e);
			res.sendStatus(401);
		}
	});

function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

function getRandomIndex(length) {
	return Math.floor(Math.random() * length);
}

async function cleanupLinkCodes(linkCodes) {
	var codes = Object.keys(linkCodes);
	var timestamp = Date.now();

	for (var code of codes) {
		var timediff = timestamp - linkCodes[code].created;
		if (timediff > 900000) {
			await admin
				.database()
				.ref("/linkCodes/" + code)
				.remove();
		}
	}
}
