'use strict';

const json2csv = require('json2csv');

const getCohortCourses = (admin, cohortId) =>
  admin
    .database()
    .ref(`/cohortCourses/${cohortId}`)
    .once('value')
    .then(snap => snap.val());

const getCohortProgress = (admin, cohortId) =>
  admin.database()
    .ref(`/cohortProgress/${cohortId}`)
    .once('value')
    .then(snap => snap.val());

const getUsers = (admin, results) =>
  Promise.all(
    Object.keys(results[1]).map(uid =>
      admin.auth().getUser(uid)
    )
  ).then(users => {
    results.push(users);
    return results;
  });

const flatCourses = (ob, acumulator = {}, key = '', titles = '') => {
  for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

    let newKey = i != 'parts' && i != 'syllabus' ?
                    key != '' ? `${key},${i}` : `${i}` : key;

    let newTitles = i != 'parts' && i != 'syllabus' ? titles != '' ?
                      `${titles},${ob[i].title}` : `${ob[i].title}` : titles;

		if (typeof ob[i] == 'object') {
      if (ob[i].type != 'practice' && ob[i].type != 'quiz') {
			  flatCourses(ob[i], acumulator, newKey, newTitles);
    	} else {

        if (ob[i].type == 'practice') {
          for (var ex in ob[i].exercises) {

            let keyTitle = newKey.split(',').reduce((memo,key,index) => {
              memo[key] = newTitles.split(',')[index];
              return memo;
            },{});
            keyTitle[ex] = ob[i].exercises[ex].title;

            acumulator[`${newKey},${ex}`] = {
              duration: ob[i].duration,
              format: ob[i].format,
              type: ob[i].type,
              titles: keyTitle
            }
          }
        } else {
          acumulator[newKey] = {
            duration: ob[i].duration,
            format: ob[i].format,
            type: ob[i].type,
            titles: newKey.split(',').reduce((memo,key,index) => {
              memo[key] = newTitles.split(',')[index];
              return memo;
            },{})
          }
        }
      }
    }
	}
	return acumulator;
}

const flatProgress = (ob, acumulator = {}, key = '') => {
  for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;

    let newKey = key != '' ? `${key},${i}` : `${i}`;

    if (typeof ob[i] == 'object') {
      if (ob[i].testResults == undefined && ob[i].results == undefined) {
        flatProgress(ob[i],acumulator,newKey);
      } else {
        if (ob[i].testResults != undefined) {
          acumulator[newKey] = parseFloat(ob[i].testResults.stats.passes / ob[i].testResults.stats.tests);
        } else {
          acumulator[newKey] =
            ob[i].results ? parseFloat(ob[i].results.passes / ob[i].results.total) : null;
        }
      }
    }
  }
  return acumulator;
}

const createUserNameMap = users => users.reduce((memo,user) => {
    memo[user.uid] = {
      name: user.displayName,
      email: user.email
    }
    return memo;
  },{});

const reportToCSV = data =>
  json2csv({
    data,
    fields: [
      'name','email', 'course','unit','part',
      'exercise','duration','format','type',
      'progress'
    ]
  });

const createNodeTitleMap = titles =>
  node => `${titles[node]} (${node})`

const generateReportData = ({ courses, progress, users }) => {

  let data = [];

  const courseParts = flatCourses(courses);
  const progressParts = flatProgress(progress);
  const userMap = createUserNameMap(users);

  const uids = Object.keys(progress);
  const courseKeyStructure = Object.keys(courseParts);

  uids.forEach(uid => {
    courseKeyStructure.forEach(key => {

      const courseData = courseParts[key];
      const progressData = progressParts[`${uid},${key}`];

      const nodes = key.split(',');
      const nodeTitleMap = createNodeTitleMap(courseData.titles);

      //Dado que no hay manera de saber el tipo (course, unit, part, etc)
      //de nodo, tenemos que definir la estructura hardcoded.
      //Seria ideal que el parser incluya el tipo en todo los nodos del árbol
      data.push(Object.assign({}, userMap[uid], {
        course: nodeTitleMap(nodes[0]),
        unit: nodeTitleMap(nodes[1]),
        part: nodeTitleMap(nodes[2]),
        exercise: courseData.titles[nodes[3]] ? nodeTitleMap(nodes[3]) : null,
        duration: courseData.duration,
        format: courseData.format,
        type: courseData.type,
        progress: progressData ? progressData.toFixed(2) : null
      }));
    });
  });

  return data;
}

const handleCohortProgress = admin => (req, res) => {

  const cohortId = req.url.split('/')[3];
//  const cohortId = 'lim-2017-09-ec-js-functional';

  Promise.all(
    [getCohortCourses(admin, cohortId),
     getCohortProgress(admin, cohortId)]
  )
  .then(results => getUsers(admin, results))
  .then(results =>
    res
      .header(
        'Content-Disposition',
        'attachment;filename=cohortProgress.csv')
      .type('text/csv')
      .send(200,
        reportToCSV(
          generateReportData({
            courses: results[0],
            progress: results[1],
            users: results[2]
          })
        )
      )
  )
  .catch(err => {
    console.log(err);
    res.status(500).send(err)
  });
}

module.exports = handleCohortProgress
