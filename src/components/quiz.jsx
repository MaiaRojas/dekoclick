import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormattedMessage } from 'react-intl';
import QuizConfirmationDialog from './quiz-confirmation-dialog';
import QuizQuestion from './quiz-question';
import QuizResults from './quiz-results';
import {
  toggleQuizConfirmationDialog,
  resetQuizConfirmationDialog,
} from '../reducers/quiz-confirmation-dialog';
import { updateProgress } from '../util/progress';
import PartTitle from './part-title';


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
  content: {
    marginBottom: theme.spacing.unit * 4,
  },
});


const objectToArray = obj => (
  (Array.isArray(obj))
    ? obj
    : Object.keys(obj || {})
      .sort()
      .reduce((memo, key) => (
        (typeof key === 'number' || /^\d+$/.test(key))
          ? Object.assign(memo, { [parseInt(key, 10)]: obj[key] })
          : memo
      ), [])
);


const arrayEqual = (a, b) =>
  a.sort().join(',') === objectToArray(b).sort().join(',');


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
    submittedAt: new Date(),
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
    unit,
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
          <FormattedMessage id="quiz.warnBeforeStart" values={{ duration: part.duration }} />
        </Typography>
        <Typography className={classes.p}>
          <FormattedMessage id="quiz.areYouSure" />
        </Typography>
        <Button
          variant="raised"
          color="primary"
          className={classes.startButton}
          onClick={props.toggleQuizConfirmationDialog}
        >
          <FormattedMessage id="quiz.start" />
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
      <PartTitle unit={unit} type={part.type} />
      <div className={classes.content}>
        {progress.results && <QuizResults results={progress.results} />}
        {part.questions.map((question, idx) =>
          (<QuizQuestion
            key={question.title}
            idx={idx}
            question={question}
            progress={(idx in progress) ? objectToArray(progress[idx]) : ''}
            hasResults={!!progress.results}
            updateProgress={updateQuestionProgress(firestore, auth, match)}
          />))
        }
        {!progress.results && (
          <Button variant="raised" color="primary" onClick={handleSubmit(props)}>
            <FormattedMessage id="quiz.send" />
          </Button>
        )}
      </div>
    </div>
  );
};


Quiz.propTypes = {
  part: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    questions: PropTypes.array.isRequired,
  }).isRequired,
  partProgress: PropTypes.shape({
    results: PropTypes.shape({}),
    startedAt: PropTypes.instanceOf(Date),
    submittedAt: PropTypes.instanceOf(Date),
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
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    p: PropTypes.string.isRequired,
    startButton: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  startQuiz: PropTypes.bool.isRequired,
  resetQuizConfirmationDialog: PropTypes.func.isRequired,
  toggleQuizConfirmationDialog: PropTypes.func.isRequired,
  unit: PropTypes.shape({}).isRequired,
};


Quiz.defaultProps = {
  partProgress: undefined,
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
