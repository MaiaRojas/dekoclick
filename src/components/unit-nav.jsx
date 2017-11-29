import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LeftDrawer from './left-drawer';
import UnitNavItem from './unit-nav-item';


const styles = {
  list: {
    width: 320,
  },
};


const goBack = ({ history, match }) => () => {
  const { cohortid, courseid } = match.params;
  history.push(`/cohorts/${cohortid}/courses/${courseid}`);
};


const getUnitOrder = (props) => {
  if (typeof props.unit.order === 'number') {
    return props.unit.order;
  }
  return parseInt(props.match.params.unitid.slice(0, 2), 10);
};


const UnitNav = props => (
  <LeftDrawer>
    <List disablePadding className={props.classes.list}>
      <ListItem button onClick={goBack(props)}>
        <ListItemText primary={`Unidad ${getUnitOrder(props)}: ${props.unit.title}`} />
      </ListItem>
      <Divider />
      {Object.keys(props.unit.parts).sort().map((key, idx) =>
        (<UnitNavItem
          key={key}
          partid={key}
          order={idx}
          part={props.unit.parts[key]}
          progress={(props.progress || {})[key]}
          match={props.match}
          history={props.history}
        />))
      }
    </List>
  </LeftDrawer>
);


UnitNav.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    parts: PropTypes.shape({}).isRequired,
  }).isRequired,
  progress: PropTypes.shape({}),
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
