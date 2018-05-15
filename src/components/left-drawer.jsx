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
    backgroundColor: theme.palette.common.black,
  },
  drawerPaper: {
    position: 'relative',
    width: theme.leftDrawerWidth,
    backgroundColor: theme.palette.common.black,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      position: 'fixed',
    },
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
  },
  toolbar: {
    maxHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    borderBottom: '1px solid #ffffff',
    ...theme.mixins.toolbar,
  },
  logoLarge: {
    height: 85,
    display: 'block',
    // margin: 'auto',
    // padding: 10,
  },
  logoShort: {
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
        className="leftDrawer-text"
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
}) => (
  <div className={classes.toolbar}>
    <ListItem className={classes.center}>
      { drawerOpen ?
        (<img
          alt="Laboratoria, código que transforma"
          className={classes.logoLarge}
          src="/img/logo.png"
        />)
        : (
          <img
            alt="Laboratoria, código que transforma"
            className={classes.logoShort}
            src="/img/menu+logo.png"
          />
      )}
    </ListItem>
  </div>
);


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
    logoLarge: PropTypes.string.isRequired,
    logoShort: PropTypes.string.isRequired,
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
