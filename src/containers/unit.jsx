import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';
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
    marginLeft: 0,
    padding: `${theme.spacing.unit * 4}px`,
    width: '100%',
    minHeight: '100vh',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.leftDrawerWidth,
    },
  },
});


const addSelfAssessment = (parts, intl) => {
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
    duration: 10,
    format: 'self-paced',
    title: intl.formatMessage({ id: 'unit.selfAssessment' }),
    type: 'self-assessment',
  });
};


const Unit = (props) => {
  if (props.unit === undefined
    || !props.parts
    || props.unitProgress === undefined
    || props.courseSettings === undefined) {
    return (<CircularProgress />);
  }

  const { classes, ...propsMinusClasses } = props;
  const { unitid, partid } = props.match.params;

  const unitSettings = ((props.courseSettings || {}).units || {})[unitid] || {};
  const selfAssessmentSettings = unitSettings.selfAssessment || {};
  const parts = selfAssessmentSettings.enabled === false
    ? props.parts
    : addSelfAssessment(props.parts, props.intl);

  if (!partid && parts.length) {
    return <Redirect to={`${props.match.url}/${parts[0].id}`} />;
  }

  const part = parts.filter(p => p.id === partid)[0];
  const partProgress = (part.type === 'self-assessment')
    ? props.unitProgress.find(item => item.type === 'self-assessment')
    : props.unitProgress.find(item => item.partid === partid);

  let Component = UnitPart;
  if (part.type === 'practice' && part.exercises) {
    Component = UnitExercises;
  } else if (part.type === 'quiz') {
    Component = Quiz;
  }

  const TrackedComponent = withTracker()(Component);

  return (
    <div className="app">
      <UnitNav {...propsMinusClasses} parts={parts} />
      <div className={classes.main}>
        <TopBar title={part.title}>
          <UnitDuration part={part} progress={partProgress || {}} />
        </TopBar>
        <TrackedComponent
          unit={props.unit}
          unitProgress={props.unitProgress}
          parts={parts}
          part={part}
          partProgress={partProgress}
          match={props.match}
          auth={props.auth}
          profile={props.profile}
        />
      </div>
    </div>
  );
};


Unit.propTypes = {
  unit: PropTypes.shape({}),
  parts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  unitProgress: PropTypes.arrayOf(PropTypes.shape({})),
  unitProgressStats: PropTypes.shape({}),
  courseSettings: PropTypes.shape({}),
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
  }).isRequired,
};


Unit.defaultProps = {
  unit: undefined,
  parts: undefined,
  unitProgress: undefined,
  unitProgressStats: undefined,
  courseSettings: undefined,
};


const mapStateToProps = ({ firestore }, {
  auth: { uid },
  match: { params: { cohortid, courseid, unitid } },
}) => ({
  unit: firestore.data[`cohorts/${cohortid}/courses/${courseid}/syllabus`]
    ? (firestore.data[`cohorts/${cohortid}/courses/${courseid}/syllabus`][unitid] || null)
    : undefined,
  parts: firestore.ordered[`cohorts/${cohortid}/courses/${courseid}/syllabus/${unitid}/parts`],
  unitProgress: firestore.ordered.progress,
  unitProgressStats: firestore.data[`cohorts/${cohortid}/users/${uid}/progress`]
    ? (((firestore.data[`cohorts/${cohortid}/users/${uid}/progress`][courseid] || {}).units || {})[unitid] || null)
    : undefined,
  courseSettings: firestore.data[`cohorts/${cohortid}/coursesSettings`]
    ? (firestore.data[`cohorts/${cohortid}/coursesSettings`][courseid] || null)
    : undefined,
});


export default compose(
  injectIntl,
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
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress`,
      doc: courseid,
    },
    {
      collection: `cohorts/${cohortid}/coursesSettings`,
      doc: courseid,
    },
  ]),
  connect(mapStateToProps),
  withStyles(styles),
)(Unit);
