import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import QuizQuestion from './quiz-question';
import QuizResults from './quiz-results';


const styles = {
  root: {
    maxWidth: 760,
    margin: '0 auto',
  },
};


const arrayEqual = (a, b) => {
  const bArray = (b && b.sort) ? b : Object.keys(b || {}).reduce((memo, key) => {
    if (/^\d+$/.test(key)) {
      // memo[parseInt(key, 10)] = b[key];
      return Object.assign({}, memo, { [parseInt(key, 10)]: b[key] });
    }
    return memo;
  }, []);
  return a.sort().join(',') === bArray.sort().join(',');
};


const matchParamsToPath = (uid, { cohortid, courseid, unitid, partid }) =>
  `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}/${partid}`;


const start = (firebase, auth, match) => () =>
  firebase.database()
    .ref(matchParamsToPath(auth.uid, match.params))
    .update({ startedAt: (new Date()).toJSON() });


const updateProgress = (firebase, auth, match) => (questionid, val) =>
  firebase.database()
    .ref(matchParamsToPath(auth.uid, match.params))
    .update({ [`${questionid}`]: val });


const handleSubmit = ({ part, progress, firebase, auth, match }) => () => {
  const results = part.questions.reduce((memo, question, idx) => {
    const total = memo.total + 1;
    if (arrayEqual(question.solution, progress[idx])) {
      return Object.assign(memo, { passes: memo.passes + 1, total });
    }
    return Object.assign(memo, { failures: memo.failures + 1, total });
  }, { passes: 0, failures: 0, total: 0 });

  firebase.database()
    .ref(matchParamsToPath(auth.uid, match.params))
    .update({ results, submittedAt: (new Date()).toJSON() });
};


const Quiz = (props) => {
  const { part, progress, classes, firebase, auth, match } = props;

  if (!progress.results && !progress.startedAt) {
    return (
      <div>
        <Button raised color="primary" onClick={start(firebase, auth, match)}>
          start quiz
        </Button>
      </div>
    );
  }

  if (!progress.results && progress.startedAt) {
    const startedAt = new Date(progress.startedAt);
    if (startedAt < (Date.now() - (part.duration * 60 * 1000))) {
      setTimeout(() => handleSubmit(props)(), 10);
      return (<CircularProgress />);
    }
  }

  return (
    <div className={classes.root}>
      {progress.results && <QuizResults results={progress.results} />}
      {part.questions.map((question, idx) =>
        (<QuizQuestion
          key={question.title}
          idx={idx}
          question={question}
          progress={(idx in progress) ? progress[idx] : ''}
          hasResults={!!progress.results}
          updateProgress={updateProgress(firebase, auth, match)}
        />),
      )}
      {!progress.results &&
        (<Button raised color="primary" onClick={handleSubmit(props)}>
          Enviar
        </Button>)
      }
    </div>
  );
};


Quiz.propTypes = {
  part: PropTypes.shape({
    questions: PropTypes.array.isRequired,
  }).isRequired,
  progress: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      results: PropTypes.shape({}),
      startedAt: PropTypes.string,
      submittedAt: PropTypes.string,
    }),
  ]).isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
      courseid: PropTypes.string.isRequired,
      unitid: PropTypes.string.isRequired,
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(Quiz);
