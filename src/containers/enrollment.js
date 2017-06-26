'use strict';

import React from 'react';
import Typeform from '../components/typeform';
import { connect } from 'react-redux';

class Enrollment extends React.Component {

  constructor(props) {
    super(props);
    this.style = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      alignContent: 'stretch'
    }
  }

  componentWillMount() {
    this.typeformUrl = "https://tuexperiencia.typeform.com/to/mnfdER";
    const searchParams = new URLSearchParams(window.location.search);

    if (window.location.search != "" && searchParams.has("name")  &&
        searchParams.has("email") && searchParams.has("phone") &&
        searchParams.has("city")  && searchParams.has("token")) {

        this.typeformUrl += "?name="+searchParams.get("name");
        this.typeformUrl += "&email="+searchParams.get("email");
        this.typeformUrl += "&phone="+searchParams.get("phone");
        this.typeformUrl += "&city="+searchParams.get("city");
        this.typeformUrl += "&token="+searchParams.get("token");
    } else {
      window.location = "http://laboratoria.la/postulacion";
    }
  }

  render() {
    return (
      <div className="enrollment" style={this.style}>
        {!this.props.userCreated ?
          <div>Creando el usuario</div> :
          <Typeform url={this.typeformUrl} width="100%" height="100%" />
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userCreated: state.enrollment.userCreated,
  user: state.enrollment.user
});


const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Enrollment);
