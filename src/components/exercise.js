'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import brace from 'brace';
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
import Content from './content';
import ExerciseTestResults from './exercise-test-results';


const camelCased = str => str.replace(/-([a-z])/g, g => g[1].toUpperCase());


const idToFilename = id => `${camelCased(id.replace(/^\d{2}\-/, ''))}.js`;


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
    marginBottom: 30,
  },
  button: {
    margin: theme.spacing.unit,
  },
});


const onTabsChange = props => (e, val) =>
  props.dispatch({ type: 'EXERCISE_TAB_SELECT', payload: val });


const matchParamsToPath = (uid, { cohortid, courseid, unitid, partid, exerciseid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}/${partid}/${exerciseid}`;


const updateCode = props => text => props.firebase.database()
  .ref(`${matchParamsToPath(props.auth.uid, props.match.params)}/code`)
  .set(text);


const runTests = props => e => {
  const code = (props.progress || {}).code || getBoilerplate(props.exercise.files, props.id);
  const tests = props.exercise.files.test;
  const worker = new Worker('/worker.js');

  worker.onmessage = (e) => {
    props.firebase.database()
      .ref(matchParamsToPath(props.auth.uid, props.match.params))
      .set({ code, testResults: e.data, updatedAt: (new Date()).toJSON() });
    worker.terminate();
  };

  worker.postMessage({ code, tests });
};


const reset = props => e => {
  props.firebase.database()
    .ref(matchParamsToPath(props.auth.uid, props.match.params))
    .set({
      code: getBoilerplate(props.exercise.files, props.id),
      testResults: null,
    });
};


const Exercise = props => {
  const progress = props.progress || {};
  const code = progress.code || getBoilerplate(props.exercise.files, props.id);

  return (
  	<div>
      <Typography type="display1" gutterBottom component="h2" className={props.classes.title}>
        {props.exercise.title}
      </Typography>
      <AppBar position="static" color="default">
        <Tabs
          value={props.currentTab}
          onChange={onTabsChange(props)}
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
          <Content html={props.exercise.body} />
        </TabContainer>
      }
      {props.currentTab === 1 &&
        <TabContainer style={{ padding: 20 }}>
          <AceEditor
            style={{ width: '100%', marginBottom: 30 }}
            name={props.id}
            mode="javascript"
            theme="github"
            editorProps={{}}
            value={code}
            onChange={updateCode(props)}
          />
          <Button raised className={props.classes.button} onClick={runTests(props)}>
            <PlayArrowIcon />
            Ejecutar tests
          </Button>
          <Button raised className={props.classes.button} onClick={reset(props)}>
            <RefreshIcon />
            Resetear
          </Button>
          {progress.testResults &&
            <ExerciseTestResults testResults={progress.testResults} />
          }
        </TabContainer>
      }
  	</div>
  );
};


Exercise.propTypes = {
  id: PropTypes.string.isRequired,
  exercise: PropTypes.object.isRequired,
  progress: PropTypes.object,
  match: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = ({ exerciseUI }) => ({
  currentTab: exerciseUI.currentTab,
});


export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
  withStyles(styles),
)(Exercise);
