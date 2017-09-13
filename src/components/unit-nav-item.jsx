import React from 'react';
import PropTypes from 'prop-types';
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


UnitNavItem.propTypes = {
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  order: PropTypes.number.isRequired,
};


export default UnitNavItem;
