import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';


const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: `0 0 ${theme.spacing.unit * 2}px`,
  },
  headingButton: {
    top: theme.spacing.unit * -2,
    width: theme.spacing.unit * 6,
    height: theme.spacing.unit * 6,
  },
});


const CohortSection = ({
  children,
  classes,
  title,
  onAdd,
}) => (
  <div>
    <div className={classes.heading} style={{ marginTop: 40 }}>
      <Typography type="headline" gutterBottom className={classes.title}>
        {title}
      </Typography>
      {onAdd && typeof onAdd === 'function' && (
        <Button
          fab
          color="default"
          aria-label="add user"
          className={classes.headingButton}
          onClick={onAdd}
        >
          <AddIcon />
        </Button>
      )}
    </div>
    <div>
      {children}
    </div>
  </div>
);


export default withStyles(styles)(CohortSection);
