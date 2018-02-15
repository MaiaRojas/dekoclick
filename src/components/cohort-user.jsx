import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui-icons/Email';
import DeleteIcon from 'material-ui-icons/Delete';
import SwapHorizIcon from 'material-ui-icons/SwapHoriz';
import DirectionsWalkIcon from 'material-ui-icons/DirectionsWalk';
import gravatarUrl from '../util/gravatarUrl';
import cohort from '../util/cohort';
import CohortUserOpenModalButton from './cohort-user-open-modal-button'

const styles = theme => ({
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
  // Averigua si es un cohort de common core del bootcamp para saber si se puede
  // "migrar" al turno de la mañana o tarde según corresponda.
  const { program, name } = cohort.parse(props.cohortid);
  const canMigrate = (program === 'bc' && ['am', 'pm'].indexOf(name) >= 0);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardHeader
          avatar={<UserAvatar user={props.profile} />}
          title={props.profile.name}
          subheader={`Role: ${props.cohortUser.role}`}
        />
        <CardContent>
          <Typography className={props.classes.emailContainer}>
            <EmailIcon />
            <a href={`mailto:${props.profile.email}`} className={props.classes.truncate}>
              {props.profile.email}
            </a>
          </Typography>
          {props.profile.github &&
            <Typography>
              Github:&nbsp;
              <a href={`https://github.com/${props.profile.github}`} target="_blank">
                {props.profile.github}
              </a>
            </Typography>}
        </CardContent>
        <CardActions>
          {canMigrate && props.cohortUser.role === 'student' && (
            <IconButton
              onClick={() =>
                props.toggleMoveDialog({ uid: props.uid, user: props.profile })
              }
            >
              <SwapHorizIcon />
            </IconButton>
          )}

          {
              props.auth && <CohortUserOpenModalButton profile = {props.profile} firebase = {props.firebase} uid = {props.uid} auth = {props.auth}/>
           }

          {props.cohortUser.role === 'student' && (
            <IconButton onClick={() => console.log('drop out!')}>
              <DirectionsWalkIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() =>
              window.confirm('Estás segura de que quieres desasociar este usuario de este cohort?') &&
                props.firebase.firestore()
                  .collection(`cohorts/${props.cohortid}/users`)
                  .doc(props.uid)
                  .delete()
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
  cohortUser: PropTypes.shape({
    role: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    github: PropTypes.string,
  }).isRequired,
  toggleMoveDialog: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    emailContainer: PropTypes.string.isRequired,
    truncate: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(CohortUser);
