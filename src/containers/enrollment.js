'use strict';

import React from 'react';

const style = {
  title: {
    marginBottom: '35px',
    image: {
      width: '75px',
      height: '75px',
      backgroundColor: 'lightgray',
      borderRadius: '100%'
    },
    h2: {
      fontSize: '20px',
      letterSpacing: '1px',
      display: 'inline-block',
      paddingLeft: '35px'
    }
  }
};

const Title = (props) => {
  return (
  <div className="title" style={style.title}>
    <img alt="Datos generales" src={props.image} style={style.title.image}/>
    <h2 style={style.title.h2}>{props.text}</h2>
  </div>);
}

class InputText extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form-group">
        <label className="form-label" for={this.props.id}>
          {this.props.label}
          {this.props.instructions && <p>{this.props.instructions}</p> }
        </label>
        <input id={this.props.id} className="form-control" type="text" placeholder={this.props.placeholder}/>
      </div>
    );
  }
}

export default class Enrollment extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    return false;
  }

  render() {

    return (
      <div className="enrollment">
        <div className="container">
          <Title image="img/enrollment/datos_personales.png" text="datos generales"/>
          <InputText id="name" label="1. Nombre y Apellidos" placeholder="Nombre"/>
          <InputText id="email" label="2. Correo Electrónico" placeholder="ej: ejemplo@gmail.com"/>
          <InputText id="identityId" label="3. Documento de Identidad" instructions="Indica el número de tu DNI/CURP/Cédula de identidad o documento de extranjería" placeholder="ej. 95749345"/>
          <Title image="img/enrollment/blackboard.png" text="educación"/>
          <Title image="img/enrollment/experiencia_laboral.png" text="trabajo"/>
          <Title image="img/enrollment/familia.png" text="contexto familiar"/>
          <Title image="img/enrollment/intereses.png" text="intereses"/>
        </div>
      </div>
    );
  }
}
