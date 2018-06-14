import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
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

const propsToRoutePath = ({ partid, match }) =>
  `/cohorts/${match.params.cohortid}/courses/${match.params.courseid}` +
  `/${match.params.unitid}/${partid}`;


const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  primary: {
    order: 1,
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: theme.typography.fontSize,
    lineHeight: '125%',
  },
  secondary: {
    order: 0,
    color: theme.palette.text.secondary,
    fontSize: '14px',
  },
  active: {
    opacity: 1,
    color: theme.palette.text.secondary,
  },
  inactive: {
    opacity: 0.7,
  },
  icon: {
    color: theme.palette.text.secondary,
    opacity: 'inherit',
    marginLeft: theme.spacing.unit,
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
    return <DoneIcon style={{ color: '#56f89a' }} />;
  } else if (part.type === 'quiz' && partProgress && partProgress.startedAt && !partProgress.results) {
    return <TimerIcon style={{ color: '#56f89a' }} />;
  } else if (part.type === 'practice' && part.exercises && partProgressStats && partProgressStats && partProgressStats.completed) {
    return <WarningIcon style={{ color: '#56f89a' }} />;
  }
  return null;
};


const isOpenMenu = (props) => {
  if (props.partid === props.match.params.partid && props.drawerOpen) {
    return 'triangle expanded';
  }
  if (props.partid === props.match.params.partid) {
    return 'triangle collapsed';
  }
  return '';
};

const UnitNavItem = props => (
  <ListItem
    style={{ borderBottom: '1px solid #f1f1f1', minHeight: '90px' }}
    button
    onClick={() => props.history.push(propsToRoutePath(props))}
    className={props.partid === props.match.params.partid ?
      props.classes.active :
      props.classes.inactive
    }
  >
    <ListItemIcon className={props.classes.icon}>
      {partTypeToIcon(props.part.type)}
    </ListItemIcon>
    <ListItemText
      classes={{
        root: props.classes.root,
        primary: props.classes.primary,
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
    <div className={isOpenMenu(props)} />
  </ListItem>
);


UnitNavItem.propTypes = {
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  partProgress: PropTypes.shape({}),
  partProgressStats: PropTypes.shape({}),
  partid: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    active: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
    inactive: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
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
