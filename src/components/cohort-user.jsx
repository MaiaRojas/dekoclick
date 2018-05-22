import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Switch from 'material-ui/Switch';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui-icons/Email';
import DeleteIcon from 'material-ui-icons/Delete';
import SwapHorizIcon from 'material-ui-icons/SwapHoriz';
import DirectionsWalkIcon from 'material-ui-icons/DirectionsWalk';
import gravatarUrl from '../util/gravatarUrl';
import { parse } from '../util/cohort';
import CohortUserOpenModalButton from './cohort-user-open-modal-button';


const styles = theme => ({
  subheader: {
    color: theme.palette.text.primary,
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
  const imgSrc = (user.github)
    ? `https://github.com/${user.github}.png?size=40`
    : gravatarUrl(user.email, { size: 40 });

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

class AvailabilityCheck extends React.Component {
  constructor(props) {
    super(props);
    let isFired = false;
    if (this.props.profile) {
      if (this.props.profile.available === false) {
        isFired = true;
      }
    }
    this.state = { isFired };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(isFired) {
    this.setState({ isFired });
    this.props.firebase.firestore().collection('users').doc(this.props.uid).update({ available: !isFired });
  }

  render() {
    return (
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.isFired}
              onChange={(event, checked) => this.handleChange(checked)}
            />
          }
          label={!this.state.isFired ? 'disponible' : 'contratada'}
        />
      </FormGroup>
    );
  }
}


AvailabilityCheck.propTypes = {
  profile: PropTypes.shape({
    available: PropTypes.bool,
  }),
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
};


AvailabilityCheck.defaultProps = {
  profile: undefined,
};


const CohortUser = (props) => {
  // Averigua si es un cohort de common core del bootcamp para saber si se puede
  // "migrar" al turno de la mañana o tarde según corresponda.
  const { program, name } = parse(props.cohortid);
  const canMigrate = (program === 'bc' && ['am', 'pm'].indexOf(name) >= 0);

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card>
        <CardHeader
          classes={{ subheader: props.classes.subheader }}
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

          { (props.cohortUser.role === 'student' && props.parsedCohortId && props.parsedCohortId.program === 'jp') && (
            <CohortUserOpenModalButton
              profile={props.profile}
              firebase={props.firebase}
              uid={props.uid}
              auth={props.auth}
            />
          )}

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
          {
            (props.cohortUser.role === 'student' && props.parsedCohortId && props.parsedCohortId.program === 'jp') && <AvailabilityCheck {...props} />
          }
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
  auth: PropTypes.shape({}),
  toggleMoveDialog: PropTypes.func.isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    emailContainer: PropTypes.string.isRequired,
    truncate: PropTypes.string.isRequired,
    subheader: PropTypes.string.isRequired,
  }).isRequired,
  parsedCohortId: PropTypes.shape({
    program: PropTypes.string.isRequired,
  }).isRequired,
};


CohortUser.defaultProps = {
  auth: undefined,
};


export default withStyles(styles)(CohortUser);
