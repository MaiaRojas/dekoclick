import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import { ListItem, ListItemText } from 'material-ui/List';
import { FormattedMessage } from 'react-intl';
import Progress from './progress';


const styles = theme => ({
  card: {
    boxShadow: 'none',
  },
  cardContent: {
    padding: '0px 16px',
    backgroundColor: theme.palette.primary.main,
    minHeight: '50px',
    paddingBottom: '0px !important',
  },
  body: {
    marginRight: theme.spacing.unit * 2,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  primary: {
    fontSize: 24,
    [theme.breakpoints.up('md')]: {
      fontSize: 36,
    },
    fontFamily: theme.typography.title.fontFamily,
    order: 1,
    color: theme.palette.text.primary,
    fontWeight: 'bold',
  },
  secondary: {
    fontSize: 14,
    [theme.breakpoints.up('md')]: {
      fontSize: 16,
    },
    order: 0,
    color: theme.palette.text.primary,
  },
});


const getUnitOrder = (unit, match) => {
  if (typeof unit.order === 'number') {
    return unit.order;
  }
  return parseInt(match.params.unitid.slice(0, 2), 10);
};


const isTrackedPart = type => type !== 'self-assessment' && type !== 'quiz';

const getTitle = (type, unit) => {
  if (type === 'self-assessment') {
    return {
      secondary: <FormattedMessage id="self-assessment.title" />,
      primary: 'Feedback',
    };
  }
  if (type === 'quiz') {
    return {
      secondary: <FormattedMessage id="quiz.title" />,
      primary: 'Quiz',
    };
  }
  return {
    primary: `${unit.part.title}`,
    secondary: `Unidad ${getUnitOrder(unit.unit, unit.match)}`,
  };
};

const PartTitle = ({ classes, unit, type }) => {
  const { primary, secondary } = getTitle(type, unit);
  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <ListItem>
          <ListItemText
            classes={{
              root: classes.root,
              primary: classes.primary,
              secondary: classes.secondary,
            }}
            secondary={secondary}
            primary={primary}
          />
        </ListItem>
      </CardContent>
      { isTrackedPart(type) && <Progress value={(unit.unitProgressStats || {}).percent || 0} /> }
    </Card>
  );
};


PartTitle.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
  unit: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(styles)(PartTitle);
