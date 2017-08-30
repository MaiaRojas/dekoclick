'use strict';


import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LeftDrawer from './left-drawer';
import UnitNavItem from './unit-nav-item';


const styles = theme => ({
  list: {
    width: 320
  }
});


const goBack = ({ history, match }) => () => {
  const { cohortid, courseid } = match.params;
  history.push(`/cohorts/${cohortid}/courses/${courseid}`);
};


const UnitNav = props => {
  const unitNumber = props.match.params.unitid.split('-')[0];
  return (
    <LeftDrawer>
      <List disablePadding className={props.classes.list}>
        <ListItem button onClick={goBack(props)}>
          <ListItemText primary={`Unidad ${unitNumber}: ${props.unit.title}`} />
        </ListItem>
        <Divider />
        {Object.keys(props.unit.parts).sort().map((key, idx) =>
          <UnitNavItem
            key={key}
            partid={key}
            order={idx}
            match={props.match}
            part={props.unit.parts[key]}
            history={props.history}
          />
        )}
      </List>
    </LeftDrawer>
  );
};


export default withStyles(styles)(UnitNav);
