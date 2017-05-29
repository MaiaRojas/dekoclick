'use strict';

import React from 'react';
import Typeform from '../components/typeform';

export default class Enrollment extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="enrollment">
        <Typeform url="https://tuexperiencia.typeform.com/to/JHrbZ1" width="100%" height="100%"/>
      </div>
    );
  }
}
