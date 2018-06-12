import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel } from 'material-ui/Form';
import red from 'material-ui/colors/red';
import green from 'material-ui/colors/green';
import QuizQuestionSingle from './quiz-question-single';
import QuizQuestionMulti from './quiz-question-multi';
import Content from './content';


const styles = theme => ({
  paper: {
    // padding: theme.spacing.unit * 3 ,
    padding: `${theme.spacing.unit * 1.5}px ${theme.spacing.unit * 0}px`,
    boxShadow: 'none',
  },
  passes: {
    color: green[500],
    fontWeight: 'bold',
  },
  failures: {
    color: red[500],
    fontWeight: 'bold',
  },
});


const labelClassName = props => (idx) => {
  if (!props.hasResults) {
    return '';
  } else if (props.question.solution.indexOf(idx) > -1) {
    return props.classes.passes;
  } else if (props.progress.indexOf(idx) > -1) {
    return props.classes.failures;
  }
  return '';
};


const QuizQuestion = props => (
  <Paper className={props.classes.paper}>
    <FormControl component="fieldset" required>
      <FormLabel component="legend">{props.question.title}</FormLabel>
      <Content html={props.question.description} />
      {props.question.solution.length > 1 ?
        <QuizQuestionMulti {...props} labelClassName={labelClassName(props)} /> :
        <QuizQuestionSingle {...props} labelClassName={labelClassName(props)} />
      }
    </FormControl>
  </Paper>
);


QuizQuestion.propTypes = {
  idx: PropTypes.number.isRequired,
  question: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    solution: PropTypes.array.isRequired,
  }).isRequired,
  progress: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  hasResults: PropTypes.bool.isRequired,
  updateProgress: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    passes: PropTypes.string.isRequired,
    failures: PropTypes.string.isRequired,
  }).isRequired,
};


QuizQuestion.defaultProps = {
  progress: '',
};


export default withStyles(styles)(QuizQuestion);
