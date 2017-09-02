'use strict';


import React from 'react';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Content from './content';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '760px',
    height: '100%',
    background: '#fff',
    margin: '0 auto',
    padding: '30px',
  },
  meta: {
    display: 'flex',
    alignItems: 'left',
    marginBottom: 32,
  },
  metaChip: {
    marginRight: 4
  }
});


const UnitPart = props => (
  <div className={props.classes.root}>
    <div className={props.classes.meta}>
      <Chip
        className={props.classes.metaChip}
        label={`Tipo: ${props.part.type}`}
      />
      <Chip
        className={props.classes.metaChip}
        label={`Formato: ${props.part.format}`}
      />
      <Chip
        className={props.classes.metaChip}
        label={`Duración: ${props.part.duration}`}
      />
    </div>
    {props.part.body && <Content html={props.part.body} />}
  </div>
);


export default withStyles(styles)(UnitPart);
