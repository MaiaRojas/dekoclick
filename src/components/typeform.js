'use strict';

import React from 'react';

class Typeform extends React.Component {

    constructor(props) {
      super(props);
      this.style = {
        display: 'flex',
        width: props.width,
        height: props.height
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
      const classeNames = ["typeform-widget",this.props.className].join(" ");
      return (<div className={classeNames}
                    style={this.style}
                    data-url={this.props.url}
                    ref={(el) => (this.instance = el)}>
              </div>);
    }
}

export default Typeform;
