'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import GroupsList from '../components/groups-list';
import CoursesList from '../components/courses-list';


const Dashboard = props => {
  if (!isLoaded(props.cohortMembership)) {
    return (<div>Loading...</div>);
  }

  // const rootRef = props.firebase.database().ref();
  // rootRef.child('courses').on('value', snap => {
  //   console.log('COURSES', snap.val());
  // });
  //console.log(props.auth.uid);
  //rootRef.child('cohortMembership').child(props.auth.uid).on('value', snap => {
  //  console.log('SNAP', snap.val());
  //});

  console.log(props.cohortMembership);
  return null;

  return (
    <div>
      <h2>Cursos</h2>
      <CoursesList courses={courses.courses} />
      {/*<h2>Grupos matriculados</h2>*/}
      {/*<GroupsList groups={groups.groups} />*/}
    </div>
  );
};


const mapStateToProps = ({ firebase }) => ({
  cohortMembership: dataToJS(firebase, 'cohortMembership')
});


export default compose(
  firebaseConnect(['cohortMembership']),
  connect(mapStateToProps, {})
)(Dashboard);
