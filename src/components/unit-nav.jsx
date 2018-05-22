import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import { FormattedMessage } from 'react-intl';
import Divider from 'material-ui/Divider';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import LeftDrawer from './left-drawer';
import UnitNavItem from './unit-nav-item';


const styles = theme => ({
  list: {
    width: theme.leftDrawerWidth,
    overflowY: 'auto',
  },
  divider: {
    backgroundColor: theme.palette.common.white,
  },
  icon: {
    color: theme.palette.primary.main,
  },
  signoutBtn: {
    backgroundColor: theme.palette.common.black,
    // alignItems: 'center',
    // justifyContent: 'center',
    borderTop: '1px solid white',
    // minHeight: '90px',
  },
  listItemIcon: {
    color: theme.palette.common.white,
  },
  logout: {
    display: 'flex',
    height: '90px',
  }
});


const getPartProgress = (partid, unitProgress) => (
  (/^\d{2}-self-assessment$/.test(partid))
    ? unitProgress.find(item => item.type === 'self-assessment')
    : unitProgress.find(item => item.partid === partid)
);


const getPartProgressStats = (part, unitProgressStats) => (
  (part.type === 'self-assessment')
    ? unitProgressStats.selfAssessment
    : (unitProgressStats.parts || {})[part.id]
);


const UnitNav = ({
  unit,
  parts,
  unitProgress,
  unitProgressStats,
  classes,
  match,
  history,
  firebase,
}) => (
  <LeftDrawer
    unit={unit}
    parts={parts}
    match={match}
    history={history}
  >
    <List disablePadding className={classes.list}>
      <Divider className={classes.divider} />
      {parts.map((part, idx) =>
        (<UnitNavItem
          key={part.id}
          partid={part.id}
          order={idx}
          part={part}
          partProgress={getPartProgress(part.id, unitProgress || [])}
          partProgressStats={getPartProgressStats(part, unitProgressStats || {})}
          match={match}
          history={history}
        />))
      }
    </List>
    <div className={classes.logout}>
      <ListItem
        button
        className={classes.signoutBtn}
        onClick={() => firebase.logout()}
      >
        <ListItemIcon className={classes.listItemIcon}>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText
          className="unitNav-text"
          primary={<FormattedMessage id="main-nav.signout" />}
        />
      </ListItem>
    </div>
  </LeftDrawer>
);


UnitNav.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  parts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  unitProgress: PropTypes.arrayOf(PropTypes.shape({})),
  unitProgressStats: PropTypes.shape({}),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      unitid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    list: PropTypes.string.isRequired,
    divider: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    signoutBtn: PropTypes.string.isRequired,
    listItemIcon: PropTypes.string.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }).isRequired,
};


UnitNav.defaultProps = {
  unitProgress: undefined,
  unitProgressStats: undefined,
};


export default withStyles(styles)(UnitNav);
