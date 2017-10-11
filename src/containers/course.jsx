import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ScheduleIcon from 'material-ui-icons/Schedule';
import TopBar from '../components/top-bar';
import UnitCard from '../components/unit-card';


const Course = (props) => {
  if (!isLoaded(props.course) || !isLoaded(props.progress)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.course)) {
    return (<div>No course :-(</div>);
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
        {Object.keys(props.course.syllabus).sort().map((key, idx) =>
          (<UnitCard
            key={key}
            id={key}
            idx={idx}
            unit={props.course.syllabus[key]}
            progress={(props.progress || {})[key]}
            course={props.match.params.courseid}
            cohort={props.match.params.cohortid}
          />),
        )}
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


const matchParamsToCoursePath = ({ cohortid, courseid }) =>
  `cohortCourses/${cohortid}/${courseid}`;


const matchParamsToProgressPath = (uid, { cohortid, courseid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}`;


const mapStateToProps = ({ firebase }, { auth, match }) => ({
  course: dataToJS(firebase, matchParamsToCoursePath(match.params)),
  progress: dataToJS(firebase, matchParamsToProgressPath(auth.uid, match.params)),
});


export default compose(
  firebaseConnect(({ auth, match }) => [
    matchParamsToCoursePath(match.params),
    matchParamsToProgressPath(auth.uid, match.params),
  ]),
  connect(mapStateToProps),
)(Course);
