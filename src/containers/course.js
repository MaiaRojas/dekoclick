//
// Group page/container
//

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import TopBar from '../components/top-bar';
import UnitCard from '../components/unit-card';


const Course = props => {
  if (!isLoaded(props.course)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.course)) {
    return (<div>No course :-(</div>);
  }

  return (
    <div className="course">
      <TopBar title={props.course.title} />
      <div>
      {Object.keys(props.course.syllabus).sort().map((key, idx) =>
        <UnitCard
          key={key}
          id={key}
          idx={idx}
          unit={props.course.syllabus[key]}
          course={props.match.params.courseid}
          cohort={props.match.params.cohortid}
        />
      )}
      </div>
    </div>
  );
};


const matchParamsToPath = ({ cohortid, courseid, unitid }) =>
  `cohortCourses/${cohortid}/${courseid}`;


const mapStateToProps = ({ firebase }, { match }) => ({
  course: dataToJS(firebase, matchParamsToPath(match.params))
});


export default compose(
  firebaseConnect(({ match }) => [matchParamsToPath(match.params)]),
  connect(mapStateToProps)
)(Course);
