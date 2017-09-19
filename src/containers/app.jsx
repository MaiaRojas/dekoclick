import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  pathToJS,
} from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import WrappedRoute from '../components/wrapped-route';
import ScrollToTop from '../components/scroll-to-top';
import SignIn from './signin';
import Dashboard from './dashboard';
import Account from './account';
import Course from './course';
import Unit from './unit';


const App = (props) => {
  if (!isLoaded(props.auth)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.auth)) {
    return (<SignIn error={null} authError={props.authError} />);
  }

  return (
    <Router>
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
          <WrappedRoute path="/account" component={Account} {...props} />
          <WrappedRoute exact path="/" component={Dashboard} {...props} />
        </Switch>
      </ScrollToTop>
    </Router>
  );
};


App.propTypes = {
  auth: PropTypes.shape({}),
  authError: PropTypes.shape({
    code: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }),
};


App.defaultProps = {
  auth: undefined,
  authError: undefined,
};


const mapStateToProps = ({ firebase }) => ({
  authError: pathToJS(firebase, 'authError'),
  auth: pathToJS(firebase, 'auth'),
});


export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(App);
