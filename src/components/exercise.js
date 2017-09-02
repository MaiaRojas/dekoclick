'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import brace from 'brace';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/github';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Content from './content';


const idToFilename = id => `${id.replace(/\d{2}\-/, '')}.js`;


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
    marginBottom: 30
  },
  button: {
    margin: theme.spacing.unit,
  },
});


const onTabsChange = props => (e, val) =>
  props.dispatch({ type: 'EXERCISE_TAB_SELECT', payload: val });


const updateCode = props => text =>
  props.dispatch({ type: 'EXERCISE_CODE_UPDATE', payload: text });


const runTests = props => e => {
  const code = props.code || getBoilerplate(props.exercise.files, props.id);
  const tests = props.exercise.files.test;
  const worker = new Worker('/worker.js');

  worker.onmessage = (e) => {
    console.log(e.data);
    //this.props.updateProblemResults(e.data.results);
    worker.terminate();
  };

  worker.postMessage({
    code,
    tests,
    //problem,
  });
};


const Exercise = props => (
	<div>
    <Typography type="display1" gutterBottom component="h2" className={props.classes.title}>
      {props.exercise.title}
    </Typography>
    <AppBar position="static">
      <Tabs value={props.current} onChange={onTabsChange(props)}>
        <Tab label="Enunciado" />
        <Tab label="Código" />
      </Tabs>
    </AppBar>
    {props.current === 0 &&
      <TabContainer>
        <Content html={props.exercise.body} />
      </TabContainer>
    }
    {props.current === 1 &&
      <TabContainer style={{ padding: 20 }}>
        <AceEditor
          style={{ width: '100%', marginBottom: 30 }}
          name={props.id}
          mode="javascript"
          theme="github"
          editorProps={{}}
          value={props.code || getBoilerplate(props.exercise.files, props.id)}
          onChange={updateCode(props)}
        />
        <Button raised className={props.classes.button}>
          Ejecutar código
        </Button>
        <Button raised className={props.classes.button} onClick={runTests(props)}>
          Ejecutar tests
        </Button>
        <Button raised className={props.classes.button}>
          Salvar
        </Button>
        <Button raised className={props.classes.button}>
          Resetear
        </Button>
      </TabContainer>
    }
	</div>
);


Exercise.propTypes = {
  id: PropTypes.string.isRequired,
  exercise: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


const mapStateToProps = ({ exerciseUI }) => ({
  current: exerciseUI.current,
  code: exerciseUI.code,
});


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(Exercise);
