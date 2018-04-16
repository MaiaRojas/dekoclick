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


const Courses = ({
  cohorts,
  auth,
  profile,
  history,
  drawerOpen,
}) => (
  <div className="courses">
    <TopBar title={<FormattedMessage id="courses.title" />} />
    {!cohorts && <CircularProgress />}
    {cohorts && !cohorts.length && (
      <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
    )}
    {cohorts && cohorts.length > 0 && (
      [...cohorts].reverse().map(cohort => (
        <CoursesList
          drawerOpen={drawerOpen}
          key={cohort.id}
          cohort={cohort}
          auth={auth}
          profile={profile}
          history={history}
        />
      ))
    )}
  </div>
);


Courses.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })),
  auth: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  drawerOpen: PropTypes.bool,
};


Courses.defaultProps = {
  cohorts: undefined,
  drawerOpen: undefined,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

export default compose(
  firestoreConnect(({ auth }) => [{
    collection: `users/${auth.uid}/cohorts`,
  }]),
  connect(({ firestore }, { auth }) => ({
    cohorts: firestore.ordered[`users/${auth.uid}/cohorts`],
  })),
  connect(mapStateToProps),
)(Courses);
