import React from 'react';
import { CircularProgress } from 'material-ui/Progress';

const Loader = () => (
  <div
    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <CircularProgress />
  </div>
);

export default Loader;
