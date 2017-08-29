'use strict';


import React from 'react';


const Part = props => {

  console.log('Part', props.part);

  return (
    <li>{props.part.title}</li>
  );
};


export default Part;
