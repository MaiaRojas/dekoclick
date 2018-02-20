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
  if (!props.unit || !props.parts || props.unitProgress === undefined) {
    return (<CircularProgress />);
  }

  const { classes, ...propsMinusClasses } = props;
  const { partid } = props.match.params;

  if (!partid && props.parts.length) {
    return <Redirect to={`${props.match.url}/${props.parts[0].id}`} />;
  }

  const part = props.parts.filter(p => p.id === partid)[0];
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
      <UnitNav {...propsMinusClasses} />
      <div className={classes.main}>
        <TopBar title={part.title}>
          <UnitDuration part={part} progress={partProgress || {}} />
        </TopBar>
        <TrackedComponent
          unit={props.unit}
          unitProgress={props.unitProgress}
          unitProgressStats={props.unitProgressStats}
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
  parts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })),
  unitProgress: PropTypes.arrayOf(PropTypes.shape({})),
  unitProgressStats: PropTypes.shape({}),
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
  unitProgress: undefined,
  unitProgressStats: undefined,
};


const selectUnit = (data, { cohortid, courseid, unitid }) => {
  const key = `cohorts/${cohortid}/courses/${courseid}/syllabus`;

  if (!data || !data[key] || !data[key][unitid]) {
    return undefined;
  }

  return data[key][unitid];
};


const selectParts = (firestore, { cohortid, courseid, unitid }, intl) => {
  const key = `cohorts/${cohortid}/courses/${courseid}/syllabus/${unitid}/parts`;

  if (!firestore.ordered || !firestore.ordered[key]) {
    return undefined;
  }

  return addSelfAssessment(firestore.ordered[key], intl);
};


const selectUnitProgress = (data, { cohortid, courseid, unitid }, uid) => {
  const key = `cohorts/${cohortid}/users/${uid}/progress/${courseid}/syllabus`;

  if (!data || !data[key]) {
    return undefined;
  }

  return data[key][unitid];
};


const mapStateToProps = ({ firestore }, { auth, match, intl }) => ({
  unit: selectUnit(firestore.data, match.params),
  parts: selectParts(firestore, match.params, intl),
  unitProgress: firestore.ordered.progress,
  unitProgressStats: selectUnitProgress(firestore.data, match.params, auth.uid),
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
      collection: `cohorts/${cohortid}/users/${auth.uid}/progress/${courseid}/syllabus`,
      doc: unitid,
    },
  ]),
  connect(mapStateToProps),
  withStyles(styles),
)(Unit);
