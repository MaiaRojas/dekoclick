import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, getVal, isLoaded, isEmpty } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import CourseCard from './course-card';


const styles = theme => ({
  headline: {
    marginBottom: 20,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});


const CoursesList = ({ cohort, courses, classes, auth }) => {
  if (!courses) {
    return (<CircularProgress />);
  }

  if (!courses.length) {
    return (<div>No courses :-(</div>);
  }

  return (
    <div>
      <Typography type="headline" gutterBottom className={classes.headline}>
        {cohort}
      </Typography>
      <div className={classes.container}>
      {courses.map(course =>
        (<CourseCard
          key={course.id}
          cohort={cohort}
          course={course}
          auth={auth}
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
  withStyles(styles),
)(CoursesList);
