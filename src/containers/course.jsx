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
  if (!props.course) {
    return (<CircularProgress />);
  }

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
            id={unit.id}
            idx={idx}
            unit={unit}
            progress={(props.progress || {})[unit.id]}
            course={props.match.params.courseid}
            cohort={props.match.params.cohortid}
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
  progress: PropTypes.shape({}),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseid: PropTypes.string.isRequired,
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


Course.defaultProps = {
  course: undefined,
  progress: undefined,
  syllabus: undefined,
};


const selectCourse = (data, { cohortid, courseid }) => {
  const key = `cohorts/${cohortid}/courses`;
  if (!data || !data[key] || !data[key][courseid]) {
    return undefined;
  }

  return data[key][courseid];
};


const selectProgress = (data, { cohortid, courseid }, uid) => {
  const key = `cohorts/${cohortid}/users/${uid}/progress`;

  if (!data || !data[key] || !data[key][courseid]) {
    return undefined;
  }

  return data[key][courseid];
};


const selectSyllabus = (firestore, { cohortid, courseid }) => {
  const key = `cohorts/${cohortid}/courses/${courseid}/syllabus`;

  if (!firestore.ordered || !firestore.ordered[key]) {
    return undefined;
  }

  return firestore.ordered[key];
};


const mapStateToProps = ({ firestore, firebase }, { auth, match }) => ({
  course: selectCourse(firestore.data, match.params),
  progress: selectProgress(firestore.data, match.params, auth.uid),
  syllabus: selectSyllabus(firestore, match.params),
});


export default compose(
  firestoreConnect(({ auth, match: { params: { cohortid, courseid } } }) => [
    {
      collection: `cohorts/${cohortid}/courses`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/courses/${courseid}/syllabus`,
    },
    {
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress`,
      doc: courseid,
    },
  ]),
  connect(mapStateToProps),
)(Course);
