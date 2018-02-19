import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import { FormattedMessage } from 'react-intl';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CoursesList from '../components/courses-list';


const Courses = ({ cohorts, auth }) => (
  <div className="courses">
    <TopBar title={<FormattedMessage id="courses.title" />} />
    {!cohorts
      ? <CircularProgress />
      : !cohorts.length
        ? <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
        : [...cohorts].reverse().map(cohort => (
          <CoursesList
            key={cohort.id}
            cohort={cohort.id}
            role={cohort.role}
            auth={auth}
          />
        ))
    }
  </div>
);


Courses.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })),
};


Courses.defaultProps = {
  cohorts: undefined,
};


export default compose(
  firestoreConnect(({ auth }) => [{
    collection: `users/${auth.uid}/cohorts`,
  }]),
  connect(({ firestore }, { auth }) => ({
    cohorts: firestore.ordered[`users/${auth.uid}/cohorts`],
  })),
)(Courses);
