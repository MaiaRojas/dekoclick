import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import QuizConfirmationDialog from './quiz-confirmation-dialog';
import QuizQuestion from './quiz-question';
import QuizResults from './quiz-results';
import {
  toggleQuizConfirmationDialog,
  resetQuizConfirmationDialog,
} from '../reducers/quiz-confirmation-dialog';


const styles = {
  root: {
    maxWidth: 760,
    margin: '0 auto',
  },
  p: {
    marginBottom: 10,
  },
  startButton: {
    marginTop: 10,
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


const matchParamsToPath = (uid, {
  cohortid,
  courseid,
  unitid,
  partid,
}) => `cohortProgress/${cohortid}/${uid}/${courseid}/${unitid}/${partid}`;


const start = (firebase, auth, match) =>
  firebase.database()
    .ref(matchParamsToPath(auth.uid, match.params))
    .update({ startedAt: (new Date()).toJSON() });


const updateProgress = (firebase, auth, match) => (questionid, val) =>
  firebase.database()
    .ref(matchParamsToPath(auth.uid, match.params))
    .update({ [`${questionid}`]: val });


const handleSubmit = ({
  part,
  progress,
  firebase,
  auth,
  match,
}) => () => {
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
  const {
    part,
    progress,
    classes,
    firebase,
    auth,
    match,
    startQuiz,
  } = props;

  if (!progress.startedAt && startQuiz) {
    start(firebase, auth, match);
    props.resetQuizConfirmationDialog();
    return null;
  }

  if (!progress.results && !progress.startedAt) {
    return (
      <div className={classes.root}>
        <Typography className={classes.p}>
          Puedes responder el cuestionario una sola vez y
          tendrás {part.duration} minutos para hacerlo. Pasados ese tiempo, el
          cuestionario se bloquea y no podrás seguir respondiendo.
        </Typography>
        <Typography className={classes.p}>
          ¿Estás segura(o) de que quieres responder ahora?
        </Typography>
        <Button
          raised
          color="primary"
          className={classes.startButton}
          onClick={props.toggleQuizConfirmationDialog}
        >
          Sí, responder ahora
        </Button>
        <QuizConfirmationDialog part={part} />
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
        />))
      }
      {!progress.results && (
        <Button raised color="primary" onClick={handleSubmit(props)}>
          Enviar
        </Button>
      )}
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
  startQuiz: PropTypes.bool.isRequired,
  resetQuizConfirmationDialog: PropTypes.func.isRequired,
  toggleQuizConfirmationDialog: PropTypes.func.isRequired,
};


const mapStateToProps = ({ quizConfirmationDialog }) => ({
  quizConfirmationDialogOpen: quizConfirmationDialog.open,
  startQuiz: quizConfirmationDialog.start,
});


const mapDispatchToProps = {
  toggleQuizConfirmationDialog,
  resetQuizConfirmationDialog,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Quiz);
