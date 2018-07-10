// Añadimos excepciones de linter ya que queremos mantener los imports de
// archivos que va a interceptar webpack al principio.
/* eslint import/extensions: "off", import/first: "off" */


import './style/main.css';
import './img/home.png';
import './img/muestra-perfil.png';
import './img/restaurar-contrasena.png';
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


// Clear splash page (beating heart...)
document.body.className = '';
document.getElementsByClassName('spinner-wrapper')[0].remove();


render(App);


// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/app', () => render(App));
}


// TODO: This is a really horrible hack due to a bug in react-redux-firebase
// 1.5.x. This will need to be removed once react-redux-firebase 2.0 is
// released and we upgrade and refactor our code...
window.addEventListener('error', (err) => {
  if (err && err.message === 'Uncaught Error: invalid keyPath') {
    window.location.reload();
  }
});
