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
    marginTop: 40,
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
    <div className={classes.heading}>
      <Typography variant="headline" gutterBottom className={classes.title}>
        {title}
      </Typography>
      {onAdd && typeof onAdd === 'function' && (
        <Button
          variant="fab"
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


CohortSection.propTypes = {
  children: PropTypes.element.isRequired,
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func,
};


CohortSection.defaultProps = {
  onAdd: undefined,
};


export default withStyles(styles)(CohortSection);
