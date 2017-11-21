'use strict';


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const updateCohortUsers = require('./lib/updateCohortUsers');
const updateCoursesIndex = require('./lib/updateCoursesIndex');


admin.initializeApp(functions.config().firebase);


exports.updateCohortUsers = updateCohortUsers(functions, admin);
exports.updateCoursesIndex = updateCoursesIndex(functions, admin);
