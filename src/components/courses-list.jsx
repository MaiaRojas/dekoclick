import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import CourseCard from './course-card';


const CoursesList = (props) => {
  if (!isLoaded(props.courses)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.courses)) {
    return (<div>No courses :-(</div>);
  }

  return (<div>
    <Typography type="headline" gutterBottom style={{ marginBottom: 20 }}>
      {props.cohort}
    </Typography>
    {Object.keys(props.courses).map(key =>
      (<CourseCard
        key={key}
        id={key}
        cohort={props.cohort}
        course={props.courses[key]}
        courseStats={props.coursesStats[key]}
      />),
    )}
  </div>);
};


CoursesList.propTypes = {
  courses: PropTypes.shape({}),
  coursesStats: PropTypes.shape({}),
  cohort: PropTypes.string.isRequired,
};


CoursesList.defaultProps = {
  courses: undefined,
  coursesStats: undefined,
};


// list courses for a given cohort
export default compose(
  firebaseConnect(props => ([
    `cohortCourses/${props.cohort}`,
  ])),
  connect(({ firebase, coursesStats }, ownProps) => ({
    courses: dataToJS(firebase, `cohortCourses/${ownProps.cohort}`),
    coursesStats,
  }), {}),
)(CoursesList);
