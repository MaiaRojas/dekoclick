'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import CourseCard from './course-card';


const CoursesList = props => {
  if (!isLoaded(props.courses)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.courses)) {
    return (<div>No courses :-(</div>);
  }

  return (<div>
    {Object.keys(props.courses).map(key =>
      <CourseCard
        key={key}
        id={key}
        cohort={props.cohort}
        course={props.courses[key]}
      />
    )}
  </div>);
};


// list courses for a given cohort
export default compose(
  firebaseConnect(['cohortCourses']),
  connect(({ firebase }, ownProps) => ({
    courses: dataToJS(firebase, 'cohortCourses/' + ownProps.cohort)
  }), {})
)(CoursesList);
