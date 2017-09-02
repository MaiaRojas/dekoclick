'use strict';


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
	},
});


const highlightCode = (str) => {
  const el = document.createElement('div');
  el.innerHTML = str;
  const nodeList = el.querySelectorAll('pre code');
  if (nodeList.length) {
    nodeList.forEach(node => {
      node.className = node.className.replace(/^lang-/, '');
      hljs.highlightBlock(node);
    })
  }
  return el.innerHTML;
};


const parseBody = str => {
  return highlightCode(str);
};


const Content = props => {
	return (
		<div
      className={props.classes.body}
      dangerouslySetInnerHTML={{ __html: parseBody(props.html) }}
    ></div>
	);
};


Content.propTypes = {
	html: PropTypes.string.isRequired,
	classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(Content);
