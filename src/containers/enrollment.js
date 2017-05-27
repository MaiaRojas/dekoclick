'use strict';

import React from 'react';

const style = {

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
        <label className="form-label" htmlFor={this.props.id}>
          {this.props.label}
          {this.props.instructions && <p>{this.props.instructions}</p> }
        </label>
        <input id={this.props.id} className="form-control" type="text" placeholder={this.props.placeholder}/>
      </div>
    );
  }
}

class TypeForm extends React.Component {

    constructor(props) {
      super(props);
      this.style = {
        display: 'flex',
        width: '100%',
        height: '100%'
      }
    }

    componentDidMount() {
      let s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      const scriptContent = ['var qs,js,q,s,d=document, ',
                             'gi=d.getElementById,',
                             'ce=d.createElement,',
                             'gt=d.getElementsByTagName, ',
                             'id="typef_orm", ',
                             'b="https://embed.typeform.com/";',
                             'if(!gi.call(d,id)) { ',
                             'js=ce.call(d,"script"); ',
                             'js.id=id; ',
                             'js.src=b+"embed.js"; ',
                             'q=gt.call(d,"script")[0]; ',
                             'q.parentNode.insertBefore(js,q) }'].join('');

      s.innerHTML = scriptContent;
      this.instance.appendChild(s);
    }

    render() {
      return (<div className="typeform-widget"
                    style={this.style}
                    data-url={this.props.url}
                    ref={(el) => (this.instance = el)}>
              </div>);
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
        <TypeForm url="https://tuexperiencia.typeform.com/to/JHrbZ1"/>
      </div>
    );
  }
}
