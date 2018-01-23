import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, getVal, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import CourseCard from './course-card';


const CoursesList = (props) => {
  if (!props.courses) {
    return (<CircularProgress />);
  }

  if (!props.courses.length) {
    return (<div>No courses :-(</div>);
  }

  return (
    <div>
      <Typography type="headline" gutterBottom style={{ marginBottom: 20 }}>
        {props.cohort}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      {props.courses.map(course =>
        (<CourseCard
          key={course.id}
          cohort={props.cohort}
          course={course}
        />))}
      </div>
    </div>
  );
};


CoursesList.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  cohort: PropTypes.string.isRequired,
};


CoursesList.defaultProps = {
  courses: undefined,
};


const sortCourses = (courses) => {
  if (!isLoaded(courses)) {
    return undefined;
  }

  if (isEmpty(courses)) {
    return [];
  }

  const keys = Object.keys(courses || {});

  if (!keys.length) {
    return courses;
  }

  return keys
    .map(key => ({
      id: key,
      ...courses[key],
    }))
    .sort((a, b) => {
      if (a.order > b.order) {
        return 1;
      }
      if (a.order < b.order) {
        return -1;
      }
      return 0;
    });
};


// list courses for a given cohort
export default compose(
  firebaseConnect(props => ([
    `cohortCourses/${props.cohort}`,
  ])),
  connect(({ firebase }, ownProps) => ({
    courses: sortCourses(getVal(firebase, `data/cohortCourses/${ownProps.cohort}`)),
  }), {}),
)(CoursesList);
