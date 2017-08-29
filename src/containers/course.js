//
// Group page/container
//

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import UnitCard from '../components/unit-card';


const Course = props => {
  if (!isLoaded(props.course)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.course)) {
    return (<div>No course :-(</div>);
  }

  return (
    <div className="main">
      <Typography type="headline" component="h1">
        {props.course.title}
      </Typography>
      <Typography type="title" component="h2">
        Syllabus
      </Typography>
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


const mapStateToProps = ({ firebase }, { match }) => ({
  course: dataToJS(
    firebase,
    `cohortCourses/${match.params.cohortid}/${match.params.courseid}`
  )
});


export default connect(mapStateToProps, {})(Course);
