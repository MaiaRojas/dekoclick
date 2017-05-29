'use strict';

import React from 'react';
import Typeform from '../components/typeform';

export default class Enrollment extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.typeformUrl = "https://tuexperiencia.typeform.com/to/mnfdER";
    if (window.location.search != "") {
      const searchParams = new URLSearchParams(window.location.search);
      this.typeformUrl += (searchParams.has("name") ? "?name="+searchParams.get("name")   : "");
      this.typeformUrl += (searchParams.has("email") ? "&email="+searchParams.get("email") : "");
      this.typeformUrl += (searchParams.has("phone") ? "&phone="+searchParams.get("phone") : "");
      this.typeformUrl += (searchParams.has("city") ? "&city="+searchParams.get("city")   : "");
      this.typeformUrl += (searchParams.has("token") ? "&token="+searchParams.get("token") : "");
    }
  }

  render() {
    return (
      <div className="enrollment">
        <Typeform url={this.typeformUrl} width="100%" height="100%" />
      </div>
    );
  }
}
