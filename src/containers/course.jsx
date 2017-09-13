import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import UnitCard from '../components/unit-card';


const Course = (props) => {
  if (!isLoaded(props.course)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.course)) {
    return (<div>No course :-(</div>);
  }

  return (
    <div className="course">
      <TopBar title={props.course.title} />
      <div>
        {Object.keys(props.course.syllabus).sort().map((key, idx) =>
          (<UnitCard
            key={key}
            id={key}
            idx={idx}
            unit={props.course.syllabus[key]}
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
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      courseid: PropTypes.string.isRequired,
      cohortid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


Course.defaultProps = {
  course: undefined,
};


const matchParamsToPath = ({ cohortid, courseid }) =>
  `cohortCourses/${cohortid}/${courseid}`;


const mapStateToProps = ({ firebase }, { match }) => ({
  course: dataToJS(firebase, matchParamsToPath(match.params)),
});


export default compose(
  firebaseConnect(({ match }) => [matchParamsToPath(match.params)]),
  connect(mapStateToProps),
)(Course);
