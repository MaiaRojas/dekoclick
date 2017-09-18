import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import ScheduleIcon from 'material-ui-icons/Schedule';


class UnitDuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = { elapsed: 0 };
  }

  expiredQuiz() {
    const startedAt = new Date(this.props.progress.startedAt);
    return startedAt < (Date.now() - (this.props.part.duration * 60 * 1000));
  }

  quizInProgress() {
    return this.props.part.type === 'quiz' &&
      this.props.part.duration &&
      !this.props.progress.results &&
      !!this.props.progress.startedAt;
  }

  pad(num) {
    return (num < 10) ? `0${num}` : `${num}`;
  }

  elapsedToRemainingString() {
    let secondsLeft = (this.props.part.duration * 60) - this.state.elapsed;
    let minutesLeft = Math.floor(secondsLeft / 60);

    if (minutesLeft >= 1) {
      secondsLeft = secondsLeft % 60;
    }

    return `${this.pad(minutesLeft)}:${this.pad(secondsLeft)}`;
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
      const elapsed = Math.floor((Date.now() - new Date(progress.startedAt)) / 1000, 10);
      this.setState({ elapsed });
    }, 1000);
  }

  clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  componentDidMount() {
    this.initTimer();
  }

  componentWillUnmount() {
    this.clearTimer();
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
  part: PropTypes.shape({}).isRequired,
  progress: PropTypes.shape({}).isRequired,
};


export default UnitDuration;
