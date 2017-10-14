import React from 'react';
import PropTypes from 'prop-types';


const TabContainer = props => (
  <div style={{ padding: 20 }}>{props.children}</div>
);


TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


export default TabContainer;
