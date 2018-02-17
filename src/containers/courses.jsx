import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import TopBar from '../components/top-bar';
import Alert from '../components/alert';
import CoursesList from '../components/courses-list';


const Courses = ({ cohorts, auth }) => {
  if (!cohorts) {
    return (<CircularProgress />);
  }

  if (!cohorts.length) {
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
      {[...cohorts].reverse().map(cohort => (
        <CoursesList
          key={cohort.id}
          cohort={cohort.id}
          role={cohort.role}
          auth={auth}
        />
      ))}
    </div>
  );
};


Courses.propTypes = {
  auth: PropTypes.shape({}).isRequired,
  cohorts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  })),
};


Courses.defaultProps = {
  cohorts: undefined,
};


export default compose(
  firestoreConnect(({ auth }) => [{
    collection: `users/${auth.uid}/cohorts`,
  }]),
  connect(({ firestore }, { auth }) => ({
    cohorts: firestore.ordered[`users/${auth.uid}/cohorts`],
  })),
)(Courses);
