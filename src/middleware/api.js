//
// API Middleware
//


import Axios from 'axios';


const internals = {
  baseUrl: 'http://api.laboratoria.la'
};


if (process.env.NODE_ENV === 'development') {
  internals.baseUrl = 'http://lvh.me:3001';
}


export default store => next => action => {

  if (action.type !== 'API_REQUEST') {
    return next(action);
  }

  const id = action.payload.id;

  const options = {
    method: action.payload.method,
    url: internals.baseUrl + action.payload.path,
    withCredentials: true
  };

  if (action.payload.payload) {
    options.data = action.payload.payload;
  }

  next({ type: id + '_PENDING' });

  return Axios(options)
    .then(response => {

      next({
        type: id + '_SUCCESS',
        payload: response.data
      });
    })
    .catch(err => {

      next({
        type: id + '_FAILURE',
        payload: err
      });
    });
};
