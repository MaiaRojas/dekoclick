import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
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
    top: theme.spacing.unit * -1,
  },
});


const ProjectSection = ({
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
        <IconButton
          aria-label="Add user"
          className={classes.headingButton}
          onClick={onAdd}
        >
          <AddIcon />
        </IconButton>
      )}
    </div>
    <div>
      {children}
    </div>
  </div>
);


ProjectSection.propTypes = {
  children: PropTypes.element.isRequired,
  classes: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func,
};


ProjectSection.defaultProps = {
  onAdd: undefined,
};


export default withStyles(styles)(ProjectSection);
