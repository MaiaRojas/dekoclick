import React from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';


const parseHTML = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  return el.innerHTML;
};


const QuizQuestionSingle = props => (
  <RadioGroup
    aria-label="answer"
    name="answer"
    value={`${props.progress}`}
    onChange={(e, val) => props.updateProgress(props.idx, [parseInt(val, 10)])}
  >
    {props.question.answers.map((answer, idx) =>
      (<FormControlLabel
        key={answer}
        value={`${idx}`}
        classes={{ label: props.labelClassName(idx) }}
        control={<Radio />}
        label={parseHTML(answer)}
        disabled={props.hasResults}
      />),
    )}
  </RadioGroup>
);


QuizQuestionSingle.propTypes = {
  idx: PropTypes.number.isRequired,
  question: PropTypes.shape({
    answers: PropTypes.array,
  }).isRequired,
  progress: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  hasResults: PropTypes.bool.isRequired,
  updateProgress: PropTypes.func.isRequired,
  labelClassName: PropTypes.func.isRequired,
};


export default QuizQuestionSingle;
