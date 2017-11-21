import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';
import ThumbDownIcon from 'material-ui-icons/ThumbDown';
import SelfAssessment from './self-assessment';


const styles = {
  hr: {
    maxWidth: 760,
    marginTop: 32,
  },
};


class UnitPartTracker extends React.Component {
  constructor(props) {
    super(props);
    this.checkReadCompleted = this.checkReadCompleted.bind(this);
    this.markRead = this.markRead.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.state = {
      start: Date.now(),
      hasReachedBottom: false,
    };
  }

  componentDidMount() {
    this.markOpened();
    if (this.isReadType()) {
      this.checkReadCompleted();
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (this.isReadType()) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  getUnitProgressPath() {
    const { auth, match } = this.props;
    const { cohortid, courseid, unitid } = match.params;
    return `${cohortid}/${auth.uid}/${courseid}/${unitid}`;
  }

  getPartProgressPath() {
    return `${this.getUnitProgressPath()}/${this.props.match.params.partid}`;
  }

  getDbRef() {
    return this.props.firebase.database()
      .ref(`cohortProgress/${this.getPartProgressPath()}`);
  }

  isReadType() {
    return ['lectura', 'read'].indexOf(this.props.part.type) > -1;
  }

  markOpened() {
    if (this.props.progress && this.props.progress.openedAt) {
      return;
    }

    this.getDbRef().update({ openedAt: new Date() });
  }

  markRead() {
    if (this.props.progress && this.props.progress.readAt) {
      return;
    }

    this.getDbRef().update({ readAt: new Date() });
  }

  checkReadCompleted() {
    const { part, progress } = this.props;

    if (progress && progress.readAt) {
      return;
    }

    const elapsed = Math.floor((Date.now() - this.state.start) / 1000);

    if (!this.state.hasReachedBottom || elapsed < (part.duration * 60) / 2) {
      setTimeout(this.checkReadCompleted, 1000);
      return;
    }

    this.markRead();
  }

  handleScroll() {
    const { body } = document;
    const html = document.documentElement;
    const windowHeight = 'innerHeight' in window ? window.innerHeight : html.offsetHeight;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.setState({ hasReachedBottom: true });
    }
  }

  like() {
    this.getDbRef().update({ like: true, likedAt: new Date() });
  }

  dislike() {
    this.getDbRef().update({ like: false, dislikedAt: new Date() });
  }

  render() {
    const {
      component: Component,
      showSelfAssessment,
      selfAssessment,
      classes,
      ...rest
    } = this.props;
    const hasLikedOrDisliked = typeof this.props.progress.like === 'boolean';
    const liked = hasLikedOrDisliked && this.props.progress.like === true;
    const disliked = hasLikedOrDisliked && this.props.progress.like === false;
    return (
      <div>
        <Component {...rest} />
        {showSelfAssessment &&
          <div>
            <hr className={classes.hr} />
            <SelfAssessment
              unitProgressPath={this.getUnitProgressPath()}
              selfAssessment={selfAssessment}
              firebase={this.props.firebase}
            />
          </div>
        }
        <hr className={classes.hr} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          {this.isReadType() &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!this.props.progress.readAt}
                  disabled={!!this.props.progress.readAt}
                  onChange={e => e.target.checked && this.markRead()}
                />
              }
              label="Marcar como leido"
            />
          }
          <div>
            <IconButton
              onClick={this.dislike}
              color={disliked ? 'primary' : 'default'}
            >
              <ThumbDownIcon />
            </IconButton>
            <IconButton
              onClick={this.like}
              color={liked ? 'primary' : 'default'}
            >
              <ThumbUpIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}


UnitPartTracker.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.shape({}).isRequired,
  ]).isRequired,
  showSelfAssessment: PropTypes.bool.isRequired,
  selfAssessment: PropTypes.shape({}),
  part: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    openedAt: PropTypes.string,
    readAt: PropTypes.string,
    like: PropTypes.bool,
  }).isRequired,
  auth: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


UnitPartTracker.defaultProps = {
  selfAssessment: undefined,
};


const UnitPartTrackerWithStyles = withStyles(styles)(UnitPartTracker);


export default UnitPartTrackerWithStyles;


export const withTracker = () => component => props =>
  <UnitPartTrackerWithStyles component={component} {...props} />;
