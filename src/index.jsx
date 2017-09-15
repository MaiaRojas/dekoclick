// Añadimos excepciones de linter ya que queremos mantener los imports de
// archivos que va a interceptar webpack al principio.
/* eslint import/extensions: "off", import/first: "off" */


import './style/main.css';
import './img/icon.svg';
import './img/logo.svg';
import './worker.js';


import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import store from './store';
import theme from './style/theme';
import App from './containers/app';


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <Component />
        </MuiThemeProvider>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};


render(App);


// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/app', () => render(App));
}
