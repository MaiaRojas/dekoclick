'use strict';


import './style/main.scss';
import './img/favicon.png';
import './img/logo.svg';
import './worker.js';

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import api from './middleware/api';
import reducers from './reducers';
import App from './containers/app';


const middlewares = [thunk, api];

if (process.env.NODE_ENV !== 'production') {
  const { logger } = require('redux-logger');
  middlewares.push(logger);
}

const store = createStore(reducers, applyMiddleware(...middlewares));


import { AppContainer } from 'react-hot-loader';


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);


// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/app', () => {

    render(App);
  });
}
