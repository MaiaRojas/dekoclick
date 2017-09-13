import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';


const createCheckboxChangeHandler = (
  updateProgress,
  idx,
  question,
  progress = [],
  answerIdx,
) => (e, checked) =>
  updateProgress(
    idx,
    question.answers.reduce((memo, answer, i) => {
      if (i === answerIdx && checked) {
        memo.push(i);
      } else if (i !== answerIdx && progress.indexOf(i) > -1) {
        memo.push(i);
      }
      return memo;
    }, []),
  );


const QuizQuestionMulti = props => (
  <FormGroup>
    {props.question.answers.map((answer, idx) =>
      (<FormControlLabel
        key={answer}
        classes={{ label: props.labelClassName(idx) }}
        control={
          <Checkbox
            checked={props.progress.indexOf(idx) > -1}
            onChange={createCheckboxChangeHandler(
              props.updateProgress,
              props.idx,
              props.question,
              props.progress,
              idx,
            )}
            value={`${idx}`}
          />
        }
        label={answer}
        disabled={props.hasResults}
      />),
    )}
  </FormGroup>
);


QuizQuestionMulti.propTypes = {
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


export default QuizQuestionMulti;
