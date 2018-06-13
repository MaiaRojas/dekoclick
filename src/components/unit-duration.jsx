import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ScheduleIcon from 'material-ui-icons/Schedule';


// eslint-disable-next-line no-confusing-arrow
const pad = num => num < 10 ? `0${num}` : `${num}`;


class UnitDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0 };
  }

  componentDidMount() {
    this.initTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  expiredQuiz() {
    const { progress, part } = this.props;
    return progress.startedAt.toDate() < (Date.now() - (part.duration * 60 * 1000));
  }

  quizInProgress() {
    return this.props.part.type === 'quiz' &&
      this.props.part.duration &&
      !this.props.progress.results &&
      !!this.props.progress.startedAt;
  }

  elapsedToRemainingString() {
    let secondsLeft = (this.props.part.duration * 60) - this.state.elapsed;
    const minutesLeft = Math.floor(secondsLeft / 60);

    if (minutesLeft >= 1) {
      secondsLeft %= 60;
    }

    return `${pad(minutesLeft)}:${pad(secondsLeft)}`;
  }

  initTimer() {
    const { progress } = this.props;

    if (!this.quizInProgress() || this.expiredQuiz()) {
      this.clearTimer();
      return;
    }

    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - progress.startedAt.toDate()) / 1000, 10);
      this.setState({ elapsed });
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  render() {
    let label = `${this.props.part.duration}min`;

    if (this.quizInProgress()) {
      if (!this.expiredQuiz()) {
        label = this.elapsedToRemainingString();
        this.initTimer();
      } else {
        label = 'expired';
        this.clearTimer();
      }
    } else {
      this.clearTimer();
    }

    return (
      <Chip
        avatar={<Avatar><ScheduleIcon /></Avatar>}
        label={label}
      />
    );
  }
}


UnitDuration.propTypes = {
  part: PropTypes.shape({
    duration: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    startedAt: PropTypes.instanceOf(firebase.firestore.Timestamp),
    results: PropTypes.shape({}),
  }).isRequired,
};


export default UnitDuration;
