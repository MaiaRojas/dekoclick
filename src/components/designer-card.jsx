import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormattedMessage } from 'react-intl';
import Progress from './progress';


const styles = theme => ({
  card: {
    width: '25%',
    margin: theme.spacing.unit,
    borderBottom: 0,
    boxShadow: theme.shadow,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  cardClose: {
    width: '32%',
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  cardActions: {
    flexWrap: 'wrap',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px`,
    position: 'relative',
  },
  countText: {
    display: 'inline-block',
    fontWeight: 500,
    fontSize: '0.8rem',
  },
  cardContent: {
    backgroundColor: theme.palette.primary.main,
    minHeight: '60px',
  },
});

const getSummary = (elem) => {
  const newSummary = elem.slice(0, 130).split('').reverse().join('');
  return newSummary.slice(newSummary.search(' ')).split('').reverse().join('');
};

const DesignerCard = props => console.log() || (
  <Card
    className={
      classNames(props.classes.card, props.drawerOpen && props.classes.cardClose)
    }
    to={`/designers/${props.designer.id}`}
    component={Link}
  >
    <CardContent className={props.classes.cardContent}>
    </CardContent>
    <CardActions className={props.classes.cardActions}>
      <Typography variant="title">
        Carla Rod
      </Typography>
      <Button
        size="small"
        variant="raised"
        color="primary"
        to={`/designers/${props.designers}`}
        component={Link}
      >
        Ver Perfil
      </Button>
    </CardActions>
  </Card>
);


DesignerCard.propTypes = {

};


DesignerCard.defaultProps = {
  progress: undefined,
  drawerOpen: undefined,

};

const mapStateToProps = ({ topbar }) => ({
  drawerOpen: topbar.drawerOpen,
});


export default withStyles(styles)(DesignerCard);
