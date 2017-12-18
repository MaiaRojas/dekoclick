import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import UnitNav from '../components/unit-nav';
import UnitDuration from '../components/unit-duration';
import UnitPart from '../components/unit-part';
import UnitExercises from '../components/unit-exercises';
import Quiz from '../components/quiz';
import { withTracker } from '../components/unit-part-tracker';


const styles = theme => console.log(theme) || ({
  main: {
    // background: '#fff',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    height: '100%',
    marginTop: `${theme.spacing.unit * 7}px`,
    padding: `${theme.spacing.unit * 4}px`,
    width: '100%',
    minHeight: '100vh',
  },
});

const selfAssessmentPart = {
  duration: 10,
  format: 'self-paced',
  title: 'Autoevaluación',
  type: 'self-assessment',
};


const matchParamsToUnitPath = ({ cohortid, courseid, unitid }) =>
  `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`;


const matchParamsToProgressPath = (uid, { cohortid, courseid, unitid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}`;


const addSelfAssessment = (data) => {
  const unit = data;

  if (unit) {
    const partKeys = Object.keys(unit.parts).sort();
    const lastPart = partKeys[partKeys.length - 1];

    const lastNumber = parseInt(lastPart.substr(0, lastPart.indexOf('-')), 0);
    const selfAssessment = (lastNumber < 10 ? '0' : '') + (lastNumber + 1);

    unit.parts[`${selfAssessment}-self-assessment`] = selfAssessmentPart;
  }

  return unit;
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
  const partKeys = Object.keys(props.unit.parts).sort();
  const first = partKeys[0];

  if (!partid) {
    return <Redirect to={`${props.match.url}/${first}`} />;
  }

  const part = props.unit.parts[partid];
  const progress = (props.progress || {})[partid] || {};
  const { selfAssessment } = props.progress || {};

  let Component = UnitPart;
  if (part.type === 'practice' && part.exercises) {
    Component = UnitExercises;
  } else if (part.type === 'quiz') {
    Component = Quiz;
  }

  const TrackedComponent = withTracker()(Component);

  return (
    <div className="app">
      <UnitNav {...propsMinusClasses} />
      <div className={classes.main}>
        <TopBar title={part.title}>
          <UnitDuration part={part} progress={progress} />
        </TopBar>
        <TrackedComponent
          part={part}
          progress={progress}
          match={props.match}
          auth={props.auth}
          firebase={props.firebase}
          showSelfAssessment={part.type === 'self-assessment'}
          selfAssessment={selfAssessment}
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
  firebase: PropTypes.shape({}).isRequired,
};


Unit.defaultProps = {
  unit: undefined,
  progress: undefined,
};


const mapStateToProps = ({ firebase }, { auth, match }) => ({
  unit: addSelfAssessment(dataToJS(firebase, matchParamsToUnitPath(match.params))),
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
