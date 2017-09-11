'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel, FormHelperText } from 'material-ui/Form';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import QuizQuestionSingle from './quiz-question-single';
import QuizQuestionMulti from './quiz-question-multi';
import Content from './content';


const styles = {
  passes: {
    color: green[500],
    fontWeight: 'bold',
  },
  failures: {
    color: red[500],
    fontWeight: 'bold',
  },
};


const labelClassName = props => idx => {
  if (!props.hasResults) {
    return {};
  }
  else if (props.question.solution.indexOf(idx) > -1) {
    return props.classes.passes;
  }
  else if (props.progress.indexOf(idx) > -1) {
    return props.classes.failures;
  }
};


const QuizQuestion = props => (
  <Paper style={{ padding: 20, marginBottom: 30 }}>
    <FormControl component="fieldset" required>
      <FormLabel component="legend">{props.question.title}</FormLabel>
      <Content html={props.question.description} />
      {props.question.solution.length > 1 ?
        <QuizQuestionMulti {...props} labelClassName={labelClassName(props)} /> :
        <QuizQuestionSingle {...props} labelClassName={labelClassName(props)} />
      }
      {/*<FormHelperText>Some important helper text</FormHelperText>*/}
    </FormControl>
  </Paper>
);


QuizQuestion.propTypes = {
  idx: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  //progress: PropTypes.array,
  hasResults: PropTypes.bool.isRequired,
  updateProgress: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(QuizQuestion);
