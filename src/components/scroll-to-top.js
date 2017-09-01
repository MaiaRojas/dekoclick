//
// HOC que envuelve rutas para asegurar que se haga "scroll to top" cuando
// navegamos a una nueva ruta.
//
// Este componente se usa una sola vez en containers/app.js
//
// Ver: https://reacttraining.com/react-router/web/guides/scroll-restoration
//


'use strict';


import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router'


class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}


ScrollToTop.propTypes = {
	location: PropTypes.object.isRequired,
  children: PropTypes.object,
};


export default withRouter(ScrollToTop);
