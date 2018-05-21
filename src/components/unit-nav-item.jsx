import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import SubjectIcon from 'material-ui-icons/Subject';
import PollIcon from 'material-ui-icons/Poll';
import SchoolIcon from 'material-ui-icons/School';
import CodeIcon from 'material-ui-icons/Code';
import BuildIcon from 'material-ui-icons/Build';
import DoneIcon from 'material-ui-icons/Done';
import WarningIcon from 'material-ui-icons/Warning';
import TimerIcon from 'material-ui-icons/Timer';
import Checkbox from 'material-ui/Checkbox';

const propsToRoutePath = ({ partid, match }) =>
  `/cohorts/${match.params.cohortid}/courses/${match.params.courseid}` +
  `/${match.params.unitid}/${partid}`;


const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  primary: {
    order : 1,
    fontWeight: 'bold',
  },
  secondary: {
    order : 0,
  },
  active: {
    backgroundColor: theme.palette.primary[500],
  },
  read: {
    fontWeight: 300,
  },
  unread: {
    fontWeight: 700,
  },
  icon: {
    color: theme.palette.primary.main,
  },
});


const partTypeToIcon = (type) => {
  if (type === 'quiz') {
    return <PollIcon />;
  }
  if (type === 'seminar') {
    return <SchoolIcon />;
  }
  if (type === 'practice') {
    return <CodeIcon />;
  }
  if (type === 'workshop') {
    return <BuildIcon />;
  }
  return <SubjectIcon />;
};


const progressToIcon = (part, partProgress, partProgressStats) => {
  if (partProgressStats && partProgressStats.completed === 1) {
    return <DoneIcon className="progress-icon" />;
  } else if (part.type === 'quiz' && partProgress && partProgress.startedAt && !partProgress.results) {
    return <TimerIcon className="progress-icon" />;
  } else if (part.type === 'practice' && part.exercises && partProgressStats && partProgressStats && partProgressStats.completed) {
    return <WarningIcon className="progress-icon" />;
  }
  return null;
};


const UnitNavItem = props => (
  <ListItem
    style={{ borderBottom: '1px solid #ffffff' , minHeight: '90px' }}
    button
    onClick={() => props.history.push(propsToRoutePath(props))}
    // className={props.partid === props.match.params.partid ? props.classes.active : ''}
  >
    <ListItemIcon className={props.classes.icon}>
      {partTypeToIcon(props.part.type)}
    </ListItemIcon>
    <ListItemText
      className="unitNav-text"
      classes={{
        root : props.classes.root,
        primary: classNames(
          props.classes.primary,
          (props.partProgress || {}).openedAt
            ? props.classes.read
            : props.classes.unread,
        ),
        secondary: props.classes.secondary,
      }}
      primary={`${props.part.title}`}
      secondary={`Parte: ${props.order}`}
    />
    <ListItemSecondaryAction>
      <IconButton disabled>
        {progressToIcon(props.part, props.partProgress, props.partProgressStats)}
      </IconButton>
    </ListItemSecondaryAction>
    <div
      className={ props.partid === props.match.params.partid && props.drawerOpen ? 'selectorActive open' : props.partid === props.match.params.partid ? 'selectorActive close' : '' }>
    </div>
  </ListItem>
);


UnitNavItem.propTypes = {
  partid: PropTypes.string.isRequired,
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  partProgress: PropTypes.shape({}),
  partProgressStats: PropTypes.shape({}),
  classes: PropTypes.shape({
    active: PropTypes.string.isRequired,
    read: PropTypes.string.isRequired,
    unread: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});


UnitNavItem.defaultProps = {
  partProgress: undefined,
  partProgressStats: undefined,
};


export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(UnitNavItem);
