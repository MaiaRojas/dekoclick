const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const handleCohortProgress = require('./cohort-progress')(admin);

exports.cohortProgress = functions.https.onRequest(handleCohortProgress);
