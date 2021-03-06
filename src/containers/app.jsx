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
import Projects from './projects';
import Project from './project';
import Designers from './designers';
// import Unit from './unit';
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
              path="/:action?/:groupid?"
              component={SignIn}
              authError={props.authError}
            />
          )
          : (
            <ScrollToTop>
              <Switch>
                {/* <WrappedRoute
                  path="/groups/:groupid/projects/:projectid/:unitid/:partid?/:exerciseid?"
                  component={Unit}
                  mainNav={false}
                  {...props}
                /> */}
                <WrappedRoute
                  path="/groups/:groupid/projects/:projectid"
                  component={Project}
                  {...props}
                />
                <WrappedRoute path="/projects/:id" component={Project} {...props} />
                <WrappedRoute path="/projects" component={Projects} {...props} />
                <WrappedRoute path="/designers" component={Designers} {...props} />
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

