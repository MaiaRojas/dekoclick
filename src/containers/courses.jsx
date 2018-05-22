import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import { FormattedMessage } from 'react-intl';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CoursesList from '../components/courses-list';
import Loader from '../components/loader';


const drawerWidth = 320;
const styles = theme => ({
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 73px)',
      marginLeft: '73px',
    },
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
});


const Courses = ({
  cohorts,
  auth,
  profile,
  history,
  drawerOpen,
  classes,
}) => (
  <div className="courses">
    <TopBar title={<FormattedMessage id="courses.title" />} />
    {!cohorts && <Loader />}
    {cohorts && !cohorts.length && (
      <div
        position="absolute"
        className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Alert message={<FormattedMessage id="courses.noCoursesWarning" />} />
      </div>
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
  withStyles(styles),
)(Courses);
