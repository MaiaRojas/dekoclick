'use strict';


import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';


const propsToRoutePath = ({ partid, match }) =>
  `/cohorts/${match.params.cohortid}/courses/${match.params.courseid}` +
  `/${match.params.unitid}/${partid}`;


const UnitNavItem = props => (
  <ListItem
    button
    onClick={() => props.history.push(propsToRoutePath(props))}
  >
    <ListItemText primary={`${props.order}. ${props.part.title}`} />
  </ListItem>
);


export default UnitNavItem;
