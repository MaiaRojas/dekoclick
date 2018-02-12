import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
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
import { updateProgress } from '../util/progress';


const styles = theme => ({
  root: {
    maxWidth: theme.maxContentWidth,
    margin: '0 auto',
  },
  p: {
    marginBottom: theme.spacing.unit * 1.5,
  },
  startButton: {
    marginTop: theme.spacing.unit,
  },
});


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


const updateQuizProgress = (firestore, auth, match, changes) =>
  updateProgress(
    firestore,
    auth.uid,
    match.params.cohortid,
    match.params.courseid,
    match.params.unitid,
    match.params.partid,
    'quiz',
    changes,
  );


const updateQuestionProgress = (firestore, auth, match) => (questionid, val) =>
  updateQuizProgress(
    firestore,
    auth,
    match,
    { [`${questionid}`]: val },
  );


const handleSubmit = ({
  part,
  partProgress,
  firestore,
  auth,
  match,
}) => () => {
  const results = part.questions.reduce((memo, question, idx) => {
    const total = memo.total + 1;
    if (arrayEqual(question.solution, partProgress[idx])) {
      return Object.assign(memo, { passes: memo.passes + 1, total });
    }
    return Object.assign(memo, { failures: memo.failures + 1, total });
  }, { passes: 0, failures: 0, total: 0 });

  updateQuizProgress(firestore, auth, match, {
    results,
    submittedAt: (new Date()).toJSON(),
  });
};


const Quiz = (props) => {
  const {
    part,
    classes,
    firestore,
    auth,
    match,
    startQuiz,
  } = props;

  const progress = props.partProgress || {};

  if (!progress.startedAt && startQuiz) {
    updateQuizProgress(firestore, auth, match, { startedAt: new Date() });
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
          updateProgress={updateQuestionProgress(firestore, auth, match)}
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
  partProgress: PropTypes.shape({
    results: PropTypes.shape({}),
    startedAt: PropTypes.date,
    submittedAt: PropTypes.date,
  }),
  firestore: PropTypes.shape({
    update: PropTypes.func.isRequired,
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


Quiz.defaultProps = {
  progress: undefined,
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
  withFirestore,
)(Quiz);
