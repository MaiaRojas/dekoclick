'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { Redirect } from 'react-router-dom';
import CoursesList from '../components/courses-list';


const Dashboard = props => {
  if (!isLoaded(props.cohortMembership)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.cohortMembership)) {
    return (<div>No cohorts :-(</div>);
  }

  return (
    <div className="main">
      {Object.keys(props.cohortMembership).map(key =>
        <CoursesList key={key} cohort={key} role={props.cohortMembership[key]} />
      )}
    </div>
  );
};


const mapStateToProps = ({ firebase }, ownProps) => ({
  cohortMembership: dataToJS(firebase, 'cohortMembership/' + ownProps.auth.uid)
});


export default compose(
  firebaseConnect(['cohortMembership']),
  connect(mapStateToProps, {})
)(Dashboard);
