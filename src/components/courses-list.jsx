import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import { FormattedMessage } from 'react-intl';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import CourseCard from './course-card';


const styles = theme => ({
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  headline: {
    marginBottom: theme.spacing.unit * 2,
  },
  headingButton: {
    top: theme.spacing.unit * -1,
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
  profile,
  history,
}) => {
  if (!courses) {
    return (<CircularProgress />);
  }

  const canManageCourse =
    ['instructor', 'admin'].indexOf(cohort.role) > -1
    || (profile.roles && profile.roles.admin);

  return (
    <div>
      <div className={classes.heading}>
        <Typography variant="headline" gutterBottom className={classes.headline}>
          {cohort.id}
        </Typography>
        {canManageCourse && (
          <IconButton
            className={classes.headingButton}
            aria-label="Manage"
            onClick={() => history.push(`/cohorts/${cohort.id}`)}
          >
            <SettingsIcon />
          </IconButton>
        )}
      </div>
      <div className={classes.container}>
        {!courses.length
          ? <FormattedMessage id="course-list.content" />
          : (courses.map(course => (
            <CourseCard
              key={course.id}
              cohort={cohort.id}
              course={course}
              auth={auth}
            />
          )))}
      </div>
    </div>
  );
};


CoursesList.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
  })),
  cohort: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    container: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};


CoursesList.defaultProps = {
  courses: undefined,
};


export default compose(
  firestoreConnect(props => [{
    collection: `cohorts/${props.cohort.id}/courses`,
    orderBy: ['order'],
  }]),
  connect(({ firestore }, { cohort }) => ({
    courses: firestore.ordered[`cohorts/${cohort.id}/courses`],
  })),
  withStyles(styles),
)(CoursesList);
