import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Content from './content';
import SelfAssessment from './self-assessment';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: theme.maxContentWidth,
    height: '100%',
    // background: '#fff',
    margin: '0 auto',
    padding: theme.spacing.unit * 4,
  },
  meta: {
    display: 'flex',
    alignItems: 'left',
    marginBottom: theme.spacing.unit * 4,
  },
  metaChip: {
    marginRight: theme.spacing.unit / 2,
  },
});


const UnitPart = ({
  unit,
  parts,
  part,
  partProgress,
  auth,
  classes,
  match,
}) => (
  <div className={classes.root}>
    <div className={classes.meta}>
      <Chip
        className={classes.metaChip}
        label={`Tipo: ${part.type}`}
      />
      <Chip
        className={classes.metaChip}
        label={`Formato: ${part.format}`}
      />
    </div>
    {part.type === 'self-assessment' &&
      <div>
        <SelfAssessment match={match} unit={unit} parts={parts} progress={partProgress} />
      </div>
    }
    {part.body && <Content html={part.body} />}
  </div>
);


UnitPart.propTypes = {
  unit: PropTypes.shape({}),
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
  auth: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default withStyles(styles)(UnitPart);
