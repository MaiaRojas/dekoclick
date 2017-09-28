import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import CoursesList from '../components/courses-list';


const Dashboard = (props) => {
  if (!isLoaded(props.userCohorts)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.userCohorts)) {
    return (<div>No cohorts :-(</div>);
  }

  return (
    <div className="dashboard">
      <TopBar title="Dashboard" />
      {Object.keys(props.userCohorts).map(key =>
        <CoursesList key={key} cohort={key} role={props.userCohorts[key]} />,
      )}
    </div>
  );
};


Dashboard.propTypes = {
  userCohorts: PropTypes.shape({}),
};


Dashboard.defaultProps = {
  userCohorts: undefined,
};


const mapStateToProps = ({ firebase }, ownProps) => ({
  userCohorts: dataToJS(firebase, `userCohorts/${ownProps.auth.uid}`),
});


export default compose(
  firebaseConnect(props => ([
    `userCohorts/${props.auth.uid}`
  ])),
  connect(mapStateToProps, {}),
)(Dashboard);
