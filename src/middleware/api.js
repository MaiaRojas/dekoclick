//
// API Middleware
//


import Axios from 'axios';


export default store => next => action => {

  if (action.type !== 'API_REQUEST') {
    return next(action);
  }

  const id = action.payload.id;

  const options = {
    method: action.payload.method,
    url: 'http://lvh.me:3001' + action.payload.path,
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
