import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import CoursesList from '../components/courses-list';


const Dashboard = (props) => {
  if (!isLoaded(props.cohortMembership)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.cohortMembership)) {
    return (<div>No cohorts :-(</div>);
  }

  // const isInstructor = Object.keys(props.cohortMembership)
  //   .filter(key => props.cohortMembership[key] === 'instructor').length > 0;
  // console.log(isInstructor, props.cohortMembership);

  return (
    <div className="dashboard">
      <TopBar title="Dashboard" />
      {Object.keys(props.cohortMembership).map(key =>
        <CoursesList key={key} cohort={key} role={props.cohortMembership[key]} />,
      )}
    </div>
  );
};


Dashboard.propTypes = {
  cohortMembership: PropTypes.shape({}).isRequired,
};


Dashboard.defaultProps = {
  cohortMembership: undefined,
};


const mapStateToProps = ({ firebase }, ownProps) => ({
  cohortMembership: dataToJS(firebase, `cohortMembership/${ownProps.auth.uid}`),
});


export default compose(
  firebaseConnect(['cohortMembership']),
  connect(mapStateToProps, {}),
)(Dashboard);
