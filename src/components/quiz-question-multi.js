'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';


const updateProgress = (props, idx) => (e, checked) =>
  props.updateProgress(
    props.idx,
    props.question.answers.reduce((memo, answer, i) => {
      if (i == idx && checked) {
        memo.push(i);
      }
      else if (i !== idx && props.progress && props.progress.indexOf(i) > -1) {
        memo.push(i)
      }
      return memo;
    }, [])
  );


const QuizQuestionMulti = props => (
  <FormGroup>
    {props.question.answers.map((answer, idx) =>
      <FormControlLabel
        key={idx}
        classes={{ label: props.labelClassName(idx) }}
        control={
          <Checkbox
            checked={props.progress.indexOf(idx) > -1}
            onChange={updateProgress(props, idx)}
            value={`${idx}`}
          />
        }
        label={answer}
        disabled={props.hasResults}
      />
    )}
  </FormGroup>
);


QuizQuestionMulti.propTypes = {
  idx: PropTypes.number.isRequired,
  question: PropTypes.object.isRequired,
  progress: PropTypes.array,
  hasResults: PropTypes.bool.isRequired,
  updateProgress: PropTypes.func.isRequired,
  labelClassName: PropTypes.func.isRequired,
};


export default QuizQuestionMulti;
