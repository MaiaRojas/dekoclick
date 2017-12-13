import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui-icons/Email';
import DeleteIcon from 'material-ui-icons/Delete';
import SwapHorizIcon from 'material-ui-icons/SwapHoriz';
import DirectionsWalkIcon from 'material-ui-icons/DirectionsWalk';
import { toggleCohortUserMoveDialog } from '../reducers/cohort-user-move-dialog';
import gravatarUrl from '../util/gravatarUrl';
import cohort from '../util/cohort';


const styles = theme => ({
  paper: {
    // padding: 20,
    // display: 'flex',
    // justifyContent: 'space-between',
  },
  heading: {
    marginBottom: theme.spacing.unit,
  },
  emailContainer: {
    display: 'flex',
    justifyContent:
    'space-between',
  },
  truncate: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: theme.spacing.unit / 2,
  },
});


const UserAvatar = ({ user }) => {
  const imgSrc = (user.github) ?
    `https://github.com/${user.github}.png?size=40` :
    gravatarUrl(user.email, { size: 40 });

  return (
    <Avatar aria-label={user.name}>
      <img src={imgSrc} alt={user.name} />
    </Avatar>
  );
};


UserAvatar.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    github: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};


const CohortUser = (props) => {
  if (!isLoaded(props.user)) {
    return (<CircularProgress />);
  }

  if (isEmpty(props.user)) {
    return (<div>No user :-(</div>);
  }

  // Averigua si es un cohort de common core del bootcamp para saber si se puede
  // "migrar" al turno de la mañana o tarde según corresponda.
  const parsedCohortId = cohort.parse(props.cohortid);
  const canMigrate = (parsedCohortId.program === 'bc' && ['am', 'pm'].indexOf(parsedCohortId.name) >= 0);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card className={props.classes.paper}>
        <CardHeader
          avatar={<UserAvatar user={props.user} />}
          title={props.user.name}
          subheader={`Role: ${props.role}`}
        />
        <CardContent>
          <Typography className={props.classes.emailContainer}>
            <EmailIcon />
            <a href={`mailto:${props.user.email}`} className={props.classes.truncate}>
              {props.user.email}
            </a>
          </Typography>
          {props.user.github &&
            <Typography>
              Github:&nbsp;
              <a href={`https://github.com/${props.user.github}`} target="_blank">
                {props.user.github}
              </a>
            </Typography>}
        </CardContent>
        <CardActions>
          {canMigrate && props.role === 'student' && (
            <IconButton
              onClick={() =>
                props.toggleCohortUserMoveDialog({ uid: props.uid, user: props.user })
              }
            >
              <SwapHorizIcon />
            </IconButton>
          )}
          {false && props.role === 'student' && (
            <IconButton onClick={() => console.log('drop out!')}>
              <DirectionsWalkIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() =>
              window.confirm('Estás segura de que quieres desasociar este usuario de este cohort?') &&
                props.firebase.database()
                  .ref(`userCohorts/${props.uid}/${props.cohortid}`)
                  .remove()
                  .catch(console.error)
            }
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Grid>
  );
};


CohortUser.propTypes = {
  uid: PropTypes.string.isRequired,
  cohortid: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
  }),
  role: PropTypes.string.isRequired,
  toggleCohortUserMoveDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    emailContainer: PropTypes.string.isRequired,
    truncate: PropTypes.string.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
};


CohortUser.defaultProps = {
  user: undefined,
};


const mapStateToProps = ({ firebase }, ownProps) => ({
  user: dataToJS(firebase, `users/${ownProps.uid}`),
});

const mapDispatchToProps = {
  toggleCohortUserMoveDialog,
};


export default compose(
  firebaseConnect(props => ([`users/${props.uid}`])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(CohortUser);
