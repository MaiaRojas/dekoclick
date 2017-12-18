import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';
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
import { selectTab, runTestsStart, runTestsEnd } from '../reducers/exercise';
import Content from './content';
import ExerciseTestResults from './exercise-test-results';


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


const matchParamsToPath = (uid, {
  cohortid,
  courseid,
  unitid,
  partid,
  exerciseid,
}) => `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}/${partid}/${exerciseid}`;


const runTests = (editorText, props) => {
  const {
    auth,
    match,
    progress,
    exercise,
    id,
  } = props;
  const progressPath = matchParamsToPath(auth.uid, match.params);
  const boilerplate = getBoilerplate(exercise.files, id);
  const code = editorText || (progress || {}).code || boilerplate;
  const tests = exercise.files.test;
  const worker = new Worker('/worker.js');
  const ref = props.firebase.database().ref(progressPath);

  worker.onerror = (event) => {
    ref.set({ code, error: event.message, updatedAt: (new Date()).toJSON() });
    worker.terminate();
    props.runTestsEnd();
  };

  worker.onmessage = (e) => {
    ref.set({ code, testResults: e.data, updatedAt: (new Date()).toJSON() });
    worker.terminate();
    props.runTestsEnd();
  };

  worker.postMessage({ code, tests });
  props.runTestsStart();
};


const reset = props => () => {
  const code = getBoilerplate(props.exercise.files, props.id);
  const progressPath = matchParamsToPath(props.auth.uid, props.match.params);
  props.firebase.database()
    .ref(progressPath)
    .set({ code, testResults: null });
};


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
      <Typography type="display1" gutterBottom component="h2" className={classes.title}>
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
          <Tab label="Enunciado" />
          <Tab label="Código" />
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
            theme="github"
            editorProps={{
              $blockScrolling: true,
            }}
            value={code}
            onChange={(text) => {
              editorText = text;
            }}
          />
          <Button raised className={classes.button} onClick={() => runTests(editorText, props)}>
            <PlayArrowIcon />
            Ejecutar tests
          </Button>
          <Button raised className={classes.button} onClick={reset(props)}>
            <RefreshIcon />
            Resetear
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
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
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
  firebaseConnect(),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Exercise);
