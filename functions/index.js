'use strict';


const functions = require('firebase-functions');
const admin = require('firebase-admin');
const updateCohortUsers = require('./lib/updateCohortUsers');
const updateCoursesIndex = require('./lib/updateCoursesIndex');
const deleteCohortRelatedData = require('./lib/deleteCohortRelatedData');


admin.initializeApp(functions.config().firebase);


exports.updateCohortUsers = updateCohortUsers(functions, admin);
exports.updateCoursesIndex = updateCoursesIndex(functions, admin);
exports.deleteCohortRelatedData = deleteCohortRelatedData(functions, admin);
