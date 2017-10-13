import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Content from './content';


const styles = {
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
    marginRight: 4,
  },
};


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
    </div>
    {props.part.body && <Content html={props.part.body} />}
  </div>
);


UnitPart.propTypes = {
  part: PropTypes.shape({
    type: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    body: PropTypes.string,
  }).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    meta: PropTypes.string.isRequired,
    metaChip: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(UnitPart);
