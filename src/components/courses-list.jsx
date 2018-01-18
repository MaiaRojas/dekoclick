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

  return (
    <div>
      <Typography type="headline" gutterBottom style={{ marginBottom: 20 }}>
        {props.cohort}
      </Typography>
      {props.courses.map(course =>
        (<CourseCard
          key={course.id}
          cohort={props.cohort}
          course={course}
        />))}
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
    courses: sortCourses(dataToJS(firebase, `cohortCourses/${ownProps.cohort}`)),
  }), {}),
)(CoursesList);
