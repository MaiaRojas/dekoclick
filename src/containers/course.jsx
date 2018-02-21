import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ScheduleIcon from 'material-ui-icons/Schedule';
import TopBar from '../components/top-bar';
import UnitCard from '../components/unit-card';


const Course = (props) => {
  if (!props.course || !props.cohortUser) {
    return (<CircularProgress />);
  }

  const canManageCourse =
    ['instructor', 'admin'].indexOf(props.cohortUser.role) > -1
    || (props.profile.roles && props.profile.roles.admin);

  return (
    <div className="course">
      <TopBar title={props.course.title}>
        {props.course.stats && props.course.stats.durationString &&
          <Chip
            avatar={<Avatar><ScheduleIcon /></Avatar>}
            label={props.course.stats.durationString}
          />
        }
      </TopBar>
      <div>
        {props.syllabus && props.syllabus.map((unit, idx) => (
          <UnitCard
            key={unit.id}
            idx={idx}
            unit={unit}
            progressStats={((props.progressStats || {}).units || {})[unit.id]}
            course={props.match.params.courseid}
            cohort={props.match.params.cohortid}
            canManageCourse={canManageCourse}
            courseSettings={props.courseSettings}
          />
        ))}
      </div>
    </div>
  );
};


Course.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
    }),
  }),
  syllabus: PropTypes.arrayOf(PropTypes.shape({})),
  cohortUser: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }),
  progressStats: PropTypes.shape({}),
  courseSettings: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseid: PropTypes.string.isRequired,
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


Course.defaultProps = {
  course: undefined,
  syllabus: undefined,
  cohortUser: undefined,
  progressStats: undefined,
  courseSettings: undefined,
};


export default compose(
  firestoreConnect(({ auth, match: { params: { cohortid, courseid } } }) => [
    {
      collection: `cohorts/${cohortid}/courses`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/coursesSettings`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/courses/${courseid}/syllabus`,
    },
    {
      collection: `cohorts/${cohortid}/users`,
      doc: auth.uid,
    },
    {
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress`,
      doc: courseid,
    },
  ]),
  connect(({ firestore }, { auth, match: { params: { cohortid, courseid } } }) => ({
    course: firestore.data[`cohorts/${cohortid}/courses`]
      ? firestore.data[`cohorts/${cohortid}/courses`][courseid]
      : undefined,
    syllabus: firestore.ordered[`cohorts/${cohortid}/courses/${courseid}/syllabus`],
    cohortUser: firestore.data[`cohorts/${cohortid}/users`]
      ? firestore.data[`cohorts/${cohortid}/users`][auth.uid]
      : undefined,
    progressStats: firestore.data[`cohorts/${cohortid}/users/${auth.uid}/progress`]
      ? firestore.data[`cohorts/${cohortid}/users/${auth.uid}/progress`][courseid]
      : undefined,
    courseSettings: firestore.data[`cohorts/${cohortid}/coursesSettings`]
      ? firestore.data[`cohorts/${cohortid}/coursesSettings`][courseid]
      : undefined,
  })),
)(Course);
