'use strict';


import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import DashboardIcon from 'material-ui-icons/Dashboard';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import ExitToAppIcon from 'material-ui-icons/ExitToApp';
import TopBar from '../components/top-bar';
import LeftDrawer from '../components/left-drawer';
import Part from '../components/part';


const styles = theme => ({
  list: {
    width: 250
  }
});


const UnitNavItem = props => (
  <ListItem
    button
    onClick={() => props.dispatch({ type: 'UNIT_SELECT', payload: props.id })}
  >
    <ListItemText primary={`${props.order}. ${props.part.title}`} />
  </ListItem>
);


const UnitNav = props => {
  const unitNumber = props.match.params.unitid.split('-')[0];
  return (
    <LeftDrawer>
      <List disablePadding className={props.classes.list}>
        <ListItem button onClick={() => props.history.goBack() }>
          <ListItemText primary={`Unidad ${unitNumber}: ${props.unit.title}`} />
        </ListItem>
        <Divider />
        {Object.keys(props.unit.parts).sort().map((key, idx) =>
          <UnitNavItem
            key={key}
            id={key}
            order={idx}
            part={props.unit.parts[key]}
            dispatch={props.dispatch}
          />
        )}
      </List>
    </LeftDrawer>
  );
};


const Unit = props => {
  if (!isLoaded(props.unit)) {
    return (<div>Loading...</div>);
  }

  if (isEmpty(props.unit)) {
    return (<div>No unit :-(</div>);
  }

  const current = props.current || Object.keys(props.unit.parts).sort()[0];

  return (
    <div className="app">
      <UnitNav {...props} />
      <div className="main">
        <TopBar title={props.unit.parts[current].title} />
        <Part part={props.unit.parts[current]} />
      </div>
    </div>
  );
};


const mapStateToProps = ({ firebase, unitUI }, { match }) => {
  const { cohortid, courseid, unitid } = match.params;
  return {
    current: unitUI.current,
    unit: dataToJS(
      firebase,
      `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`
    )
  };
};


export default compose(
  firebaseConnect(['unit']),
  connect(mapStateToProps),
  withStyles(styles)
)(Unit);
