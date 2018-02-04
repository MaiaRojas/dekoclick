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
        {Object.keys(props.course.syllabus).sort().map((key, idx) => (
          <UnitCard
            key={key}
            id={key}
            idx={idx}
            unit={props.course.syllabus[key]}
            progress={(props.progress || {})[key]}
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
    syllabus: PropTypes.shape({}).isRequired,
    stats: PropTypes.shape({
      durationString: PropTypes.string.isRequired,
    }),
  }),
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


const mapStateToProps = ({ firestore, firebase }, { auth, match }) => ({
  course: selectCourse(firestore.data, match.params),
  progress: selectProgress(firestore.data, match.params, auth.uid),
});


export default compose(
  firestoreConnect(({ auth, match }) =>[
    {
      collection: `cohorts/${match.params.cohortid}/courses`,
      doc: match.params.courseid,
    },
    {
      collection: `cohorts/${match.params.cohortid}/users/${auth.uid}/progress`,
      doc: match.params.courseid,
    },
  ]),
  connect(mapStateToProps),
)(Course);
