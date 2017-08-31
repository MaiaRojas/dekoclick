'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import UnitNav from '../components/unit-nav';
import TopBar from '../components/top-bar';
import UnitPart from '../components/unit-part';
import UnitExercises from '../components/unit-exercises';


const styles = theme => ({
  main: {
    background: '#ccc',
    height: '100%',
    marginTop: '60px',
    padding: '36px',
    width: '100%',
    minHeight: '100vh',
  }
});


const Unit = props => {
  if (!isLoaded(props.unit)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.unit)) {
    return (<div>No unit :-(</div>);
  }

  const { classes, ...propsMinusClasses } = props;
  const { partid } = props.match.params;
  const current = partid || props.current;
  const first = Object.keys(props.unit.parts).sort()[0];

  if (!current) {
    return <Redirect to={`${props.match.url}/${first}`} />;
  }

  const Component = (props.unit.parts[current].type === 'practice') ?
    UnitExercises : UnitPart;

  return (
    <div className="app">
      <UnitNav {...propsMinusClasses} />
      <div className={classes.main}>
        <TopBar title={props.unit.parts[current].title} />
        <Component part={props.unit.parts[current]} match={props.match} />
      </div>
    </div>
  );
};


const matchParamsToPath = ({ cohortid, courseid, unitid }) =>
  `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`;


const mapStateToProps = ({ firebase, unitUI }, { match }) => ({
  current: unitUI.current,
  unit: dataToJS(firebase, matchParamsToPath(match.params))
});


export default compose(
  firebaseConnect(({ match }) => [matchParamsToPath(match.params)]),
  connect(mapStateToProps),
  withStyles(styles),
)(Unit);
