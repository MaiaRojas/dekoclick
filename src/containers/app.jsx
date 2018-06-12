import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Intl from '../intl';
import WrappedRoute from '../components/wrapped-route';
import ScrollToTop from '../components/scroll-to-top';
import SignIn from './signin';
import Dashboard from './dashboard';
import Courses from './courses';
import Cohorts from './cohorts';
import Cohort from './cohort';
import Settings from './settings';
import Course from './course';
import Unit from './unit';
import Loader from '../components/loader';


const App = (props) => {
  if (!props.auth.isLoaded || !props.profile.isLoaded) {
    return (<Loader />);
  }

  return (
    <Intl {...props}>
      <Router>
        {props.auth.isEmpty
          ? (
            <Route
              path="/:action?/:cohortid?"
              component={SignIn}
              authError={props.authError}
            />
          )
          : (
            <ScrollToTop>
              <Switch>
                <WrappedRoute
                  path="/cohorts/:cohortid/courses/:courseid/:unitid/:partid?/:exerciseid?"
                  component={Unit}
                  mainNav={false}
                  {...props}
                />
                <WrappedRoute
                  path="/cohorts/:cohortid/courses/:courseid"
                  component={Course}
                  {...props}
                />
                <WrappedRoute path="/cohorts/:cohortid" component={Cohort} {...props} />
                <WrappedRoute path="/cohorts" component={Cohorts} {...props} />
                <WrappedRoute path="/courses" component={Courses} {...props} />
                <WrappedRoute path="/settings" component={Settings} {...props} />
                <WrappedRoute exact path="/" component={Dashboard} {...props} />
              </Switch>
            </ScrollToTop>
          )
        }
      </Router>
    </Intl>
  );
};


App.propTypes = {
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool,
    isEmpty: PropTypes.bool,
  }),
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
  profile: PropTypes.shape({
    isLoaded: PropTypes.bool,
  }),
};


App.defaultProps = {
  auth: undefined,
  authError: undefined,
  profile: {},
};


const mapStateToProps = ({ firebase: { authError, auth, profile } }) => ({
  authError,
  auth,
  profile,
});


export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(App);
