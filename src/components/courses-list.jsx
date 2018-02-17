import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import CourseCard from './course-card';


const styles = theme => ({
  headline: {
    marginBottom: theme.spacing.unit * 2,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});


const CoursesList = ({
  cohort,
  courses,
  classes,
  auth,
}) => {
  if (!courses) {
    return (<CircularProgress />);
  }

  if (!courses.length) {
    return (<div>No courses :-(</div>);
  }

  return (
    <div>
      <Typography variant="headline" gutterBottom className={classes.headline}>
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
  auth: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    container: PropTypes.string.isRequired,
  }).isRequired,
};


CoursesList.defaultProps = {
  courses: undefined,
};


// list courses for a given cohort
export default compose(
  firestoreConnect(props => [{
    collection: `cohorts/${props.cohort}/courses`,
    orderBy: ['order'],
  }]),
  connect(({ firestore }, { cohort }) => ({
    courses: firestore.ordered[`cohorts/${cohort}/courses`],
  })),
  withStyles(styles),
)(CoursesList);
