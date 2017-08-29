'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import Part from '../components/part';
import Typography from 'material-ui/Typography';


const Unit = props => {
  if (!isLoaded(props.unit)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.unit)) {
    return (<div>No unit :-(</div>);
  }

  const order = props.match.params.unitid.split('-')[0];

  return (
    <div className="main">
      <Typography type="subheading" component="h3">
        Unidad {order}: {props.unit.title}
      </Typography>
      <ul>
      {Object.keys(props.unit.parts).sort().map(key =>
        <Part key={key} part={props.unit.parts[key]} />
      )}
      </ul>
    </div>
  );
};


const mapStateToProps = ({ firebase }, { match }) => {
  const { cohortid, courseid, unitid } = match.params;
  console.log(`cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`);
  return {
    unit: dataToJS(
      firebase,
      `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`
    )
  };
};


export default compose(
  firebaseConnect(['unit']),
  connect(mapStateToProps, {})
)(Unit);
