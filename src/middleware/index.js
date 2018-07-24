import { getFirebase } from 'react-redux-firebase';


const baseUrl = `https://${process.env.FIREBASE_PROJECT}.firebaseapp.com`;


const apiMiddleware = store => next => (action) => {
  if (!/^api\.dekoclik\.com/.test(action.type)) {
    return next(action);
  }

  return getFirebase().auth().currentUser.getIdToken(false).then((token) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        store.dispatch({ type: action.payload.next[1], payload: xhr.response });
      } else {
        store.dispatch({
          type: action.payload.next[2],
          payload: xhr.response,
        });
      }
    });

    xhr.addEventListener('error', (err) => {
      store.dispatch({ type: action.payload.next[2], payload: err });
    });

    // xhr.addEventListener('abort', () => console.log('abort'));

    xhr.open(action.payload.method || 'GET', baseUrl + action.payload.path);
    xhr.responseType = 'json';
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (action.payload.body) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(action.payload.body));
    } else {
      xhr.send();
    }

    store.dispatch({ type: action.payload.next[0] });
  });
};


export default apiMiddleware;
