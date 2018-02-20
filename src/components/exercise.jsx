import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
// import 'brace/theme/github';
import 'brace/theme/solarized_dark';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import RefreshIcon from 'material-ui-icons/Refresh';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import ErrorIcon from 'material-ui-icons/Error';
import red from 'material-ui/colors/red';
import { LinearProgress } from 'material-ui/Progress';
import { FormattedMessage } from 'react-intl';
import Content from './content';
import ExerciseTestResults from './exercise-test-results';
import { selectTab, runTestsStart, runTestsEnd } from '../reducers/exercise';
import { updateProgress } from '../util/progress';


const camelCased = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase());


const idToFilename = id => `${camelCased(id.replace(/^\d{2}-/, ''))}.js`;


const getBoilerplate = (files, id) =>
  (files.boilerplate && files.boilerplate[idToFilename(id)]) || '';


const TabContainer = props => (
  <div style={{ padding: 20 }}>{props.children}</div>
);

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


const styles = theme => ({
  title: {
    marginBottom: theme.spacing.unit * 4,
  },
  button: {
    margin: theme.spacing.unit,
  },
  linearProgress: {
    marginTop: theme.spacing.unit * 3,
  },
  error: {
    marginTop: theme.spacing.unit * 3,
    color: red[500],
  },
});


const updateExerciseProgress = (firestore, auth, match, changes) =>
  updateProgress(
    firestore,
    auth.uid,
    match.params.cohortid,
    match.params.courseid,
    match.params.unitid,
    match.params.partid,
    'exercise',
    match.params.exerciseid,
    changes,
  );


const runTests = (editorText, props) => {
  const {
    auth,
    match,
    progress,
    exercise,
    id,
    firestore,
  } = props;
  const boilerplate = getBoilerplate(exercise.files, id);
  const code = editorText || (progress || {}).code || boilerplate;
  const tests = exercise.files.test;
  const worker = new Worker('/worker.js');
  const storeResults = changes =>
    updateExerciseProgress(firestore, auth, match, changes);

  worker.onerror = (event) => {
    storeResults({ code, error: event.message, updatedAt: new Date() });
    worker.terminate();
    props.runTestsEnd();
  };

  worker.onmessage = (e) => {
    storeResults({ code, testResults: e.data, updatedAt: new Date() });
    worker.terminate();
    props.runTestsEnd();
  };

  worker.postMessage({ code, tests });
  props.runTestsStart();
};


const reset = ({
  id,
  exercise,
  firestore,
  auth,
  match,
}) => () =>
  updateExerciseProgress(firestore, auth, match, {
    code: getBoilerplate(exercise.files, id),
    testResults: null,
  });


const Exercise = (props) => {
  const {
    exercise,
    classes,
  } = props;
  const progress = props.progress || {};
  const code = progress.code || getBoilerplate(exercise.files, props.id);
  let editorText = '';

  return (
    <div>
      <Typography variant="display1" gutterBottom component="h2" className={classes.title}>
        {exercise.title}
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={props.currentTab}
          onChange={(e, val) => props.selectTab(val)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label={<FormattedMessage id="exercise.problem" />} />
          <Tab label={<FormattedMessage id="exercise.code" />} />
        </Tabs>
      </AppBar>
      {props.currentTab === 0 &&
        <TabContainer>
          <Content html={exercise.body} />
        </TabContainer>
      }
      {props.currentTab === 1 &&
        <TabContainer style={{ padding: 20 }}>
          <AceEditor
            style={{ width: '100%', marginBottom: 30 }}
            name={props.id}
            mode="javascript"
            theme="solarized_dark"
            tabSize={2}
            editorProps={{
              $blockScrolling: Infinity,
            }}
            value={code}
            onChange={(text) => {
              editorText = text;
            }}
          />
          <Button
            variant="raised"
            className={classes.button}
            onClick={() => runTests(editorText, props)}
          >
            <PlayArrowIcon />
            <FormattedMessage id="exercise.runTests" />
          </Button>
          <Button variant="raised" className={classes.button} onClick={reset(props)}>
            <RefreshIcon />
            <FormattedMessage id="exercise.reset" />
          </Button>
          {props.testsRunning &&
            <LinearProgress className={classes.linearProgress} />
          }
          {!props.testsRunning && progress.error &&
            <Typography className={classes.error}>
              <ErrorIcon /> {progress.error}
            </Typography>
          }
          {!props.testsRunning && progress.testResults &&
            <ExerciseTestResults testResults={progress.testResults} />
          }
        </TabContainer>
      }
    </div>
  );
};


Exercise.propTypes = {
  id: PropTypes.string.isRequired,
  exercise: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    files: PropTypes.shape({}).isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    code: PropTypes.string,
    testResults: PropTypes.shape({}),
  }),
  currentTab: PropTypes.number.isRequired,
  testsRunning: PropTypes.bool.isRequired,
  selectTab: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  runTestsStart: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  runTestsEnd: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
      courseid: PropTypes.string.isRequired,
      unitid: PropTypes.string.isRequired,
      partid: PropTypes.string.isRequired,
      exerciseid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  firestore: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    title: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    linearProgress: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
  }).isRequired,
};


Exercise.defaultProps = {
  progress: {},
};


const mapStateToProps = ({ exercise }) => ({
  currentTab: exercise.currentTab,
  testsRunning: exercise.testsRunning,
});

const mapDispatchToProps = {
  selectTab,
  runTestsStart,
  runTestsEnd,
};


export default compose(
  firestoreConnect(),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Exercise);
