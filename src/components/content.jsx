/* global hljs */


import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
  body: {
    fontFamily: theme.typography.fontFamily,
    fontSize: (theme.typography.fontSize + 2),
    fontWeightLight: theme.typography.fontWeightLight,
    fontWeightMedium: theme.typography.fontWeightMedium,
    fontWeightRegular: theme.typography.fontWeightRegular,
    maxWidth: '760px',
    margin: '0 auto',
  },
});


const highlightCode = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  const nodeList = el.querySelectorAll('pre code');
  if (nodeList.length) {
    nodeList.forEach(node => hljs.highlightBlock(Object.assign(node, {
      className: node.className.replace(/^lang-/, ''),
    })));
  }
  return el.innerHTML;
};


const parseBody = str => highlightCode(str);


const Content = props => (
  <div
    className={props.classes.body}
    dangerouslySetInnerHTML={{ __html: parseBody(props.html) }}
  />
);


Content.propTypes = {
  html: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    body: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(Content);
