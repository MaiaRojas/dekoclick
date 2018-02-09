import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LeftDrawer from './left-drawer';
import UnitNavItem from './unit-nav-item';


const styles = theme => ({
  list: {
    width: theme.leftDrawerWidth,
  },
});


const getUnitOrder = (unit, match) => {
  if (typeof unit.order === 'number') {
    return unit.order;
  }
  return parseInt(match.params.unitid.slice(0, 2), 10);
};


const getPartProgress = (partid, unitProgress) =>
  (/^\d{2}-self-assessment$/.test(partid))
    ? unitProgress.find(item => item.type === 'self-assessment')
    : unitProgress.find(item => item.partid === partid);


const UnitNav = ({
  unit,
  parts,
  progress,
  classes,
  match,
  history,
}) => (
  <LeftDrawer>
    <List disablePadding className={classes.list}>
      <ListItem
        button
        onClick={() =>
          history.push(`/cohorts/${match.params.cohortid}/courses/${match.params.courseid}`)
        }
      >
        <ListItemText
          primary={`Unidad ${getUnitOrder(unit, match)}: ${unit.title}`}
        />
      </ListItem>
      <Divider />
      {parts.map((part, idx) =>
        (<UnitNavItem
          key={part.id}
          partid={part.id}
          order={idx}
          part={part}
          progress={getPartProgress(part.id, progress || [])}
          match={match}
          history={history}
        />))
      }
    </List>
  </LeftDrawer>
);


UnitNav.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  parts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  progress: PropTypes.arrayOf(PropTypes.shape({})),
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
  }).isRequired,
};


UnitNav.defaultProps = {
  progress: null,
};


export default withStyles(styles)(UnitNav);
