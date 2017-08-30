'use strict';


import React from 'react';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '760px',
    height: '100%',
    background: '#fff',
    margin: '0 auto',
    padding: '30px',
  },
  body: {
    marginTop: 32,
    fontFamily: theme.typography.fontFamily,
    fontSize: (theme.typography.fontSize + 2),
    fontWeightLight: theme.typography.fontWeightLight,
    fontWeightMedium: theme.typography.fontWeightMedium,
    fontWeightRegular: theme.typography.fontWeightRegular,
  },
  meta: {
    display: 'flex',
    alignItems: 'left',
  },
  metaChip: {
    marginRight: 4
  }
});


const Part = props => {
  props.part.exercises = {
    '01-discount': {}
  };

  console.log('Part', props);

  return (
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
      <div
        className={props.classes.body}
        dangerouslySetInnerHTML={{ __html: props.part.body }}
      ></div>
    </div>
  );
};


export default withStyles(styles)(Part);
