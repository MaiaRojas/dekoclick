import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Hidden from 'material-ui/Hidden';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { displayDrawer } from '../reducers/top-bar';


const styles = theme => ({
  drawer: {
    width: theme.leftDrawerWidth,
    backgroundColor: '#fff',
    borderRight: 0,
  },
  drawerPaper: {
    position: 'relative',
    width: theme.leftDrawerWidth,
    backgroundColor: '#fff',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
    borderRight: 0,
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
    borderRight: 0,
  },
  toolbar: {
    minHeight: 90,
    maxHeight: 90,
    // display: 'flex',
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    // borderBottom: '1px solid #f7f7f7',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  primary: {
    order: 1,
    color: theme.palette.text.secondary,
    fontWeight: '700',
    fontSize: theme.typography.fontSize,
    lineHeight: '125%',
  },
  secondary: {
    order: 0,
    color: '#f1f1f1',
    fontSize: '14px',
  },
  logoLg: {
    height: 85,
    display: 'block',
  },
  logoXs: {
    height: 45,
    display: 'block',
    margin: 'auto',
    padding: 10,
  },
  icon: {
    color: theme.palette.primary.main,
  },
  center: {
    justifyContent: 'center',
  },
});


const getUnitOrder = (unit, match) => {
  if (typeof unit.order === 'number') {
    return unit.order;
  }
  return parseInt(match.params.unitid.slice(0, 2), 10);
};


const LeftDrawerUnit = ({
  classes,
  history,
  match,
  unit,
}) => (
  <div className={classes.toolbar}>
    <ListItem
      button
      onClick={() =>
        history.push(`/cohorts/${match.params.cohortid}/courses/${match.params.courseid}`)
      }
    >
      <ListItemIcon className={classes.icon}>
        <ChevronLeftIcon />
      </ListItemIcon>
      <ListItemText
        classes={{
          root: classes.root,
          primary: classes.primary,
          secondary: classes.secondary,
        }}
        secondary={`Unidad ${getUnitOrder(unit, match)}`}
        primary={`${unit.title}`}
      />
    </ListItem>
  </div>
);


LeftDrawerUnit.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  unit: PropTypes.shape({}).isRequired,
};


const LeftDrawerMain = ({
  classes,
  drawerOpen,
}) => {
  const { className, src } = drawerOpen ?
    { className: classes.logoLg, src: '/img/logo.png' } :
    { className: classes.logoXs, src: '/img/menu+logo.png' };
  return (
    <div className={classes.toolbar}>
      {/* <ListItem className={classes.center}>
        <img
          alt="Dekoclick"
          className={className}
          src={src}
        />
      </ListItem> */}
    </div>
  );
};


LeftDrawerMain.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
};


const LeftDrawer = (props) => {
  const { classes } = props;
  return (
    <div>
      <Hidden mdUp>
        <Drawer
          classes={{ paper: classes.drawer }}
          open={props.drawerOpen}
          onClose={() => props.displayDrawer()}
          variant="temporary"
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          anchor="left"
          style={{ borderRight: 0 }}
        >
          { props.children.length > 1 ?
            (<LeftDrawerUnit {...props} />) :
            (<LeftDrawerMain {...props} />)
          }
          {props.children}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classNames(classes.drawerPaper, !props.drawerOpen && classes.drawerPaperClose),
          }}
          open={props.drawerOpen}
          variant="permanent"
        >
          { props.children.length > 1 ?
            (<LeftDrawerUnit {...props} />) :
            (<LeftDrawerMain {...props} />)
          }
          {props.children}
        </Drawer>
      </Hidden>
    </div>
  );
};


LeftDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  displayDrawer: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    drawer: PropTypes.string.isRequired,
    drawerPaper: PropTypes.string.isRequired,
    drawerPaperClose: PropTypes.string.isRequired,
    toolbar: PropTypes.string.isRequired,
    logoLg: PropTypes.string.isRequired,
    logoXs: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    center: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  unit: PropTypes.shape({
    order: PropTypes.number,
  }),
  match: PropTypes.shape({
    path: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  firebase: PropTypes.shape({}),
};


LeftDrawer.defaultProps = {
  unit: undefined,
  match: undefined,
  history: undefined,
  firebase: undefined,
};


const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});

const mapDispatchToProps = {
  displayDrawer,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { withTheme: true }),
)(LeftDrawer);
