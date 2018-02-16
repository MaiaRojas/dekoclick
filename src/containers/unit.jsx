import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import UnitNav from '../components/unit-nav';
import UnitDuration from '../components/unit-duration';
import UnitPart from '../components/unit-part';
import UnitExercises from '../components/unit-exercises';
import Quiz from '../components/quiz';
import { withTracker } from '../components/unit-part-tracker';


const styles = theme => ({
  main: {
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


const addSelfAssessment = (parts) => {
  const hasSelfAssessment = parts.reduce(
    (memo, part) => memo || /\d{1,2}-self-assessment/.test(part.id),
    false,
  );

  if (!parts.length || hasSelfAssessment) {
    return parts;
  }

  const lastPartId = parts[parts.length - 1].id;
  const lastNumber = parseInt(lastPartId.substr(0, lastPartId.indexOf('-')), 0);
  const selfAssessment = (lastNumber < 10 ? '0' : '') + (lastNumber + 1);

  return parts.concat({
    id: `${selfAssessment}-self-assessment`,
    ...selfAssessmentPart,
  });
};


const Unit = (props) => {
  console.log('Unit::unitProgressStats', props.unitProgressStats);

  if (!props.unit || !props.parts || props.progress === undefined) {
    return (<CircularProgress />);
  }

  const { classes, ...propsMinusClasses } = props;
  const { partid } = props.match.params;

  if (!partid && props.parts.length) {
    return <Redirect to={`${props.match.url}/${props.parts[0].id}`} />;
  }

  const part = props.parts.filter(part => part.id === partid)[0];
  const partProgress = (part.type === 'self-assessment')
    ? props.progress.find(item => item.type === 'self-assessment')
    : props.progress.find(item => item.partid === partid);

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
          <UnitDuration part={part} progress={partProgress || {}} />
        </TopBar>
        <TrackedComponent
          unit={props.unit}
          unitProgress={props.progress}
          parts={props.parts}
          part={part}
          partProgress={partProgress}
          match={props.match}
          auth={props.auth}
        />
      </div>
    </div>
  );
};


Unit.propTypes = {
  unit: PropTypes.shape({}),
  parts: PropTypes.arrayOf(PropTypes.shape({})),
  progress: PropTypes.arrayOf(PropTypes.shape({})),
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


Unit.defaultProps = {
  unit: undefined,
  parts: undefined,
  progress: undefined,
};


const selectUnit = (data, { cohortid, courseid, unitid }) => {
  const key = `cohorts/${cohortid}/courses/${courseid}/syllabus`;

  if (!data || !data[key] || !data[key][unitid]) {
    return undefined;
  }

  return data[key][unitid];
};


const selectParts = (firestore, { cohortid, courseid, unitid }) => {
  const key = `cohorts/${cohortid}/courses/${courseid}/syllabus/${unitid}/parts`;

  if (!firestore.ordered || !firestore.ordered[key]) {
    return undefined;
  }

  return addSelfAssessment(firestore.ordered[key]);
};


const selectUnitProgress = (data, { cohortid, courseid, unitid }, uid) => {
  const key = `cohorts/${cohortid}/users/${uid}/progress/${courseid}/syllabus`;

  if (!data || !data[key]) {
    return undefined;
  }

  return data[key][unitid];
};


const mapStateToProps = ({ firestore }, { auth, match }) => ({
  unit: selectUnit(firestore.data, match.params),
  parts: selectParts(firestore, match.params),
  progress: firestore.ordered.progress,
  unitProgressStats: selectUnitProgress(firestore.data, match.params, auth.uid),
});


export default compose(
  firestoreConnect(({ auth, match: { params: { cohortid, courseid, unitid } } }) => [
    {
      collection: `cohorts/${cohortid}/courses/${courseid}/syllabus`,
      doc: unitid,
    },
    {
      collection: `cohorts/${cohortid}/courses/${courseid}/syllabus/${unitid}/parts`,
    },
    {
      collection: 'progress',
      where: [
        ['uid', '==', auth.uid],
        ['cohortid', '==', cohortid],
        ['courseid', '==', courseid],
        ['unitid', '==', unitid],
      ],
    },
    {
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress/${courseid}/syllabus`,
      doc: unitid,
    }
  ]),
  connect(mapStateToProps),
  withStyles(styles),
)(Unit);
