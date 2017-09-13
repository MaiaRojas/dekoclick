import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import UnitNav from '../components/unit-nav';
import TopBar from '../components/top-bar';
import UnitPart from '../components/unit-part';
import UnitExercises from '../components/unit-exercises';
import Quiz from '../components/quiz';


const styles = {
  main: {
    background: '#fff',
    height: '100%',
    marginTop: '60px',
    padding: '36px',
    width: '100%',
    minHeight: '100vh',
  },
};


const Unit = (props) => {
  if (!isLoaded(props.unit) || !isLoaded(props.progress)) {
    return (<CircularProgress />);
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

  let Component = UnitPart;
  if (props.unit.parts[current].type === 'practice') {
    Component = UnitExercises;
  } else if (props.unit.parts[current].type === 'quiz') {
    Component = Quiz;
  }

  return (
    <div className="app">
      <UnitNav {...propsMinusClasses} />
      <div className={classes.main}>
        <TopBar title={props.unit.parts[current].title} />
        <Component
          part={props.unit.parts[current]}
          progress={(props.progress || {})[current] || {}}
          match={props.match}
          auth={props.auth}
        />
      </div>
    </div>
  );
};


Unit.propTypes = {
  unit: PropTypes.shape({
    parts: PropTypes.shape({}),
  }),
  progress: PropTypes.shape({}),
  current: PropTypes.string,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
      courseid: PropTypes.string.isRequired,
      unitid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
  }).isRequired,
};


const matchParamsToUnitPath = ({ cohortid, courseid, unitid }) =>
  `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`;


const matchParamsToProgressPath = (uid, { cohortid, courseid, unitid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}`;


const mapStateToProps = ({ firebase, unitUI }, { auth, match }) => ({
  current: unitUI.current,
  unit: dataToJS(firebase, matchParamsToUnitPath(match.params)),
  progress: dataToJS(firebase, matchParamsToProgressPath(auth.uid, match.params)),
});


export default compose(
  firebaseConnect(({ auth, match }) => [
    matchParamsToUnitPath(match.params),
    matchParamsToProgressPath(auth.uid, match.params),
  ]),
  connect(mapStateToProps),
  withStyles(styles),
)(Unit);
