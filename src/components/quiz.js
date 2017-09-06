'use strict';


import React from 'react';
import { firebaseConnect } from 'react-redux-firebase';
import Button from 'material-ui/Button';
import QuizQuestion from './quiz-question';


const arrayEqual = (a, b) => a.sort().join(',') === b.sort().join(',');


const matchParamsToPath = (uid, { cohortid, courseid, unitid, partid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}/${partid}`;


const updateProgress = props => (questionid, val) =>
  props.firebase.database()
    .ref(matchParamsToPath(props.auth.uid, props.match.params))
    .update({ [`${questionid}`]: val });


const handleSubmit = props => () => {
  const results = props.part.questions.reduce((memo, question, idx) => {
    if (arrayEqual(question.solution, props.progress[idx])) {
      memo.passes++;
    }
    else {
      memo.failures++;
    }
    memo.total++;
    return memo;
  }, { passes: 0, failures: 0, total: 0 });

  props.firebase.database()
    .ref(matchParamsToPath(props.auth.uid, props.match.params))
    .update({ results, submittedAt: (new Date()).toJSON() });
};


const Quiz = props => (
  <div style={{ maxWidth: 760, margin: '0 auto' }}>
    {props.part.questions.map((question, idx) =>
      <QuizQuestion
        key={idx}
        idx={idx}
        question={question}
        progress={(idx in props.progress) ? props.progress[idx] : ''}
        hasResults={!!props.progress.results}
        updateProgress={updateProgress(props)}
      />
    )}
    {!props.progress.results &&
      <Button
        raised
        color="primary"
        onClick={handleSubmit(props)}
      >
        Enviar
      </Button>
    }
  </div>
);


export default firebaseConnect()(Quiz);
