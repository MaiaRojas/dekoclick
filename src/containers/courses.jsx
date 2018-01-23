import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, getVal, isLoaded } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CoursesList from '../components/courses-list';


const Courses = (props) => {
  if (!props.userCohorts) {
    return (<CircularProgress />);
  }

  if (!props.userCohorts.length) {
    return (
      <div className="courses">
        <TopBar title="Cursos" />
        <Alert
          message="Hmmm... parece que todavía no hay ningún curso asociado a
            tu cuenta. Si crees que esto es un error, contacta a tu instructor o
            training manager para verificar tu cuenta."
        />
      </div>
    );
  }

  return (
    <div className="courses">
      <TopBar title="Cursos" />
      {props.userCohorts.map(cohort =>
        <CoursesList
          key={cohort.id}
          cohort={cohort.id}
          role={cohort.role}
          auth={props.auth}
        />)}
    </div>
  );
};


Courses.propTypes = {
  userCohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })),
};


Courses.defaultProps = {
  userCohorts: undefined,
};


const sortCohorts = (cohorts) => {
  if (!isLoaded(cohorts)) {
    return undefined;
  }

  const keys = Object.keys(cohorts || {});

  if (!keys.length) {
    return [];
  }

  return keys.sort().reverse().map(key => ({
    id: key,
    role: cohorts[key],
  }));
};


const mapStateToProps = ({ firebase }, { auth }) => ({
  userCohorts: sortCohorts(getVal(firebase, `data/userCohorts/${auth.uid}`)),
});


export default compose(
  firebaseConnect(props => ([
    `userCohorts/${props.auth.uid}`,
  ])),
  connect(mapStateToProps, {}),
)(Courses);
