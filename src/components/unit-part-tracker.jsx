import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import firebase from 'firebase/app';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';
import ThumbDownIcon from 'material-ui-icons/ThumbDown';
import { FormattedMessage } from 'react-intl';
import { updateProgress } from '../util/progress';

const drawerWidth = 321;
const styles = theme => ({
  hr: {
    maxWidth: theme.maxContentWidth,
    marginTop: theme.spacing.unit * 4,
  },
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 73px)',
      marginLeft: '73px',
    },
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
});


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
    if (this.canBeMarkedAsRead()) {
      this.checkReadCompleted();
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    if (this.canBeMarkedAsRead()) {
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

  updateProgress(partProgressChanges) {
    updateProgress(
      this.props.firestore,
      this.props.auth.uid,
      this.props.match.params.cohortid,
      this.props.match.params.courseid,
      this.props.match.params.unitid,
      this.props.match.params.partid,
      this.props.part.type,
      partProgressChanges,
    );
  }

  canBeMarkedAsRead() {
    if (this.props.part.type === 'quiz') {
      return false;
    }
    if (this.props.part.type === 'self-assessment') {
      return false;
    }
    if (this.props.part.type === 'practice' && this.props.part.exercises) {
      return false;
    }
    if (this.props.part.embeds && this.props.part.embeds.find(embed => embed.type === 'form')) {
      return false;
    }
    return true;
  }

  markOpened() {
    if (this.props.partProgress && this.props.partProgress.openedAt) {
      return;
    }

    this.updateProgress({ openedAt: new Date() });
  }

  markRead() {
    if (this.props.partProgress && this.props.partProgress.readAt) {
      return;
    }

    this.updateProgress({ readAt: new Date() });
  }

  checkReadCompleted() {
    const { part, partProgress } = this.props;

    if (partProgress && partProgress.readAt) {
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
    this.updateProgress({ like: true, likedAt: new Date() });
  }

  dislike() {
    this.updateProgress({ like: false, dislikedAt: new Date() });
  }

  render() {
    if (!this.props.partProgress || !this.props.partProgress.openedAt) {
      return null;
    }

    const {
      component: Component,
      classes,
      drawerOpen,
      ...rest
    } = this.props;

    const hasLikedOrDisliked = this.props.partProgress && typeof this.props.partProgress.like === 'boolean';
    const liked = hasLikedOrDisliked && this.props.partProgress.like === true;
    const disliked = hasLikedOrDisliked && this.props.partProgress.like === false;
    return (
      <div
        position="absolute"
        className={classNames(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Component {...rest} />
        <hr className={classes.hr} />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          {this.canBeMarkedAsRead() &&
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.props.partProgress && !!this.props.partProgress.readAt}
                  disabled={this.props.partProgress && !!this.props.partProgress.readAt}
                  onChange={e => e.target.checked && this.markRead()}
                />
              }
              label={<FormattedMessage id="unit-part-tracker:markAsRead" />}
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
  drawerOpen: PropTypes.bool,
  component: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.shape({}).isRequired,
  ]).isRequired,
  part: PropTypes.shape({
    type: PropTypes.string.isRequired,
    exercises: PropTypes.shape({}),
    embeds: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  partProgress: PropTypes.shape({
    openedAt: PropTypes.instanceOf(firebase.firestore.Timestamp),
    readAt: PropTypes.instanceOf(firebase.firestore.Timestamp),
    like: PropTypes.bool,
  }),
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      cohortid: PropTypes.string.isRequired,
      courseid: PropTypes.string.isRequired,
      unitid: PropTypes.string.isRequired,
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  firestore: PropTypes.shape({
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    hr: PropTypes.string.isRequired,
    appBar: PropTypes.string.isRequired,
    appBarShift: PropTypes.string.isRequired,
  }).isRequired,
};


UnitPartTracker.defaultProps = {
  partProgress: undefined,
  drawerOpen: undefined,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

const UnitPartTrackerWithStyles = compose(
  connect(mapStateToProps),
  withStyles(styles),
  withFirestore,
)(UnitPartTracker);


export default UnitPartTrackerWithStyles;


export const withTracker = () => component => props =>
  <UnitPartTrackerWithStyles component={component} {...props} />;
