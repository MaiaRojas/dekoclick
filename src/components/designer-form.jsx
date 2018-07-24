import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel } from 'material-ui/Form';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import GithubCard from '../components/github-card';
import isUrl from '../util/isUrl';
import { parse as parseCohortid } from '../util/project';


const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 3,
  },
  legend: {
    marginBottom: theme.spacing.unit * 2,
  },
  root: {
    color: theme.palette.text.primary,
  },
});


const FormControlWrapper = (props) => {
  const content = (
    <FormControl component="fieldset" fullWidth>
      <TextField
        id={props.inputId}
        label={props.inputLabel}
        value={props.inputValue || ''}
        multiline={props.multiline}
        rowsMax="5"
        className={props.classes.textField}
        error={!!props.error}
        helperText={props.helperText}
        FormHelperTextProps={{
          classes: {
            root: props.classes.root,
          },
        }}
        margin="dense"
        disabled={props.disabled}
        onChange={(e) => {
          if (props.updateValueOnProfile) {
            props.updateValueOnProfile(e.target.id, e.target.value);
          }
        }}
      />
    </FormControl>
  );

  if (props.usePaperContainer) {
    return (<Paper className={props.classes.paper}>{content}</Paper>);
  }

  return (<div>{content}</div>);
};


class DesignerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      github: '',
      linkedin: '',
      portfolio: '',
      photo: '',
      aboutMe: {
        summary: '', // newbio
        highlights: {
          strengthsAndWeaknesses: '',
          biggestChallenges: '',
          biggestAchievements: '',
          careerGoals: '',
          areaOfInterest: '',
        },
      },
      githubUrls: {
        0: '',
        1: '',
        2: '',
      },
      open: false,
      isUserInJobPlacementProgram: false,
    };

    this.handleOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.updateValueOnProfile = (columnName, newValue) => {
      let dicc = this.state;
      // let column = '';
      const items = columnName.split('/');
      let [column] = items;
      const maindicc = dicc;

      for (let i = 0; i < items.length; i += 1) {
        column = items[i];
        if (i === items.length - 1) {
          dicc[column] = newValue || '';
        } else {
          dicc = dicc[column];
        }
      }

      this.setState(maindicc);
      const fieldStructure = columnName.split('/').join('.');
      const obj = { [`${fieldStructure}`]: newValue };
      this.props.firebase.firestore().collection('users').doc(this.props.uid).update(obj);
    };
  }

  componentWillMount() {
    if (this.props.profile.name) {
      const res = Object.assign({}, this.state, this.props.profile);
      if (this.props.profile.aboutMe) {
        res.aboutMe = Object.assign({}, this.state.aboutMe, this.props.profile.aboutMe);
        if (this.props.profile.aboutMe.highlights) {
          res.aboutMe.highlights = Object.assign(
            {},
            this.state.aboutMe.highlights,
            this.props.profile.aboutMe.highlights,
          );
        }
      }
      this.setState(res);
      if (!this.props.showOptsInSettings) {
        this.setState({ isUserInJobPlacementProgram: true });
        return;
      }
      this.props.firebase.firestore().collection(`/users/${this.props.uid}/cohorts`)
        .get()
        .then((snap) => {
          snap.forEach((doc) => {
            const cohort = parseCohortid(doc.id);
            if (cohort.program === 'jp' && doc.data() && doc.data().role === 'student') {
              this.setState({ isUserInJobPlacementProgram: true });
            }
          });
        });
    }
  }

  createGithubCards() {
    return Object.values(this.state.githubUrls).map((url, index) => (
      <GithubCard
        url={url}
        pos={index}
        key={url}
        firebase={this.props.firebase}
        uid={this.props.uid}
      />
    ));
  }
  isUrlAndMyRepo(url) {
    return isUrl(url) && url.includes(`https://github.com/${this.state.github}`);
  }

  render() {
    const { props } = this;
    const locales = {
      'es-ES': 'Español',
      'pt-BR': 'Portugues',
      'en-US': 'English',
    };

    return (
      <React.Fragment>
        {this.props.showOptsInSettings && (
          <Paper className={props.classes.paper}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={props.classes.legend}>
                Correo electrónico
              </FormLabel>
              <Input
                id="email"
                label="Email"
                margin="none"
                disabled
                value={props.auth.email}
              />
            </FormControl>
          </Paper>
        )}

        {this.props.showOptsInSettings && (
          <Paper className={props.classes.paper}>
            <FormControl>
              <FormLabel component="legend" className={props.classes.legend}>
                Preferred language
              </FormLabel>
              <Select
                value={this.state.locale || props.profile.locale || 'es-ES'}
                onChange={e => this.updateValueOnProfile('locale', e.target.value)}
                input={<Input id="locale" />}
              >
                {Object.keys(locales).map(key => (
                  <MenuItem key={key} value={key}>{locales[key]}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        )}

        <FormControlWrapper
          {...props}
          inputLabel="Nombre"
          inputValue={this.state.name}
          inputId="name"
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer={this.props.showOptsInSettings}
        />

        <FormControlWrapper
          {...props}
          inputLabel="GitHub"
          inputValue={this.state.github}
          helperText="Ejemplo: Si tu github es: entonces escribir solamente el nick"
          error={isUrl(this.state.github)}
          inputId="github"
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer={this.props.showOptsInSettings}
        />

        <FormControlWrapper
          {...props}
          inputLabel="Linkedin"
          inputValue={this.state.linkedin}
          helperText="Ejemplo: Si tu linkedin es: https://www.linkedin.com/in/williamhgates/, entonces escribir solamente el nick 'williamhgates'"
          inputId="linkedin"
          error={isUrl(this.state.linkedin)}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer={this.props.showOptsInSettings}
        />

        <FormControlWrapper
          {...props}
          multiline
          inputLabel="Biografía"
          helperText={this.state.aboutMe.summary.length > 280 ? 'Use solo 280 caracteres' : 'A partir de aqui puedes usar hasta 280 caracteres.'}
          inputValue={this.state.aboutMe.summary}
          error={this.state.aboutMe.summary.length > 280}
          inputId="aboutMe/summary"
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer={this.props.showOptsInSettings}
        />

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            multiline
            inputLabel="Fortalezas y debilidades"
            inputValue={this.state.aboutMe.highlights.strengthsAndWeaknesses}
            error={this.state.aboutMe.highlights.strengthsAndWeaknesses.length > 280}
            helperText={this.state.aboutMe.highlights.strengthsAndWeaknesses.length > 280 ? 'Use solo 280 caracteres' : ''}
            inputId="aboutMe/highlights/strengthsAndWeaknesses"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            multiline
            inputLabel="Mayores retos enfrentados en la vida"
            inputValue={this.state.aboutMe.highlights.biggestChallenges}
            error={this.state.aboutMe.highlights.biggestChallenges.length > 280}
            helperText={this.state.aboutMe.highlights.biggestChallenges.length > 280 ? 'Use solo 280 caracteres' : ''}
            inputId="aboutMe/highlights/biggestChallenges"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            multiline
            inputLabel="Mayores logros conseguidos"
            inputValue={this.state.aboutMe.highlights.biggestAchievements}
            error={this.state.aboutMe.highlights.biggestAchievements.length > 280}
            helperText={this.state.aboutMe.highlights.biggestAchievements.length > 280 ? 'Use solo 280 caracteres' : ''}
            inputId="aboutMe/highlights/biggestAchievements"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            multiline
            inputLabel="Metas profesionales"
            inputValue={this.state.aboutMe.highlights.careerGoals}
            error={this.state.aboutMe.highlights.careerGoals.length > 280}
            helperText={this.state.aboutMe.highlights.careerGoals.length > 280 ? 'Use solo 280 caracteres' : ''}
            inputId="aboutMe/highlights/careerGoals"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            multiline
            inputLabel="Sector de interés"
            inputValue={this.state.aboutMe.highlights.areaOfInterest}
            error={this.state.aboutMe.highlights.areaOfInterest.length > 280}
            helperText={this.state.aboutMe.highlights.areaOfInterest.length > 280 ? 'Use solo 280 caracteres' : ''}
            inputId="aboutMe/highlights/areaOfInterest"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}

        {this.state.isUserInJobPlacementProgram && (
          <FormControlWrapper
            {...props}
            inputLabel="Portafolio"
            inputValue={this.state.portfolio}
            helperText="Ejemplo: Si tu portafolio es: https://Mi.portafolio.com/, entonces escribir solamente el nick 'Mi.portafolio.com'"
            error={isUrl(this.state.portfolio)}
            inputId="portfolio"
            updateValueOnProfile={this.updateValueOnProfile}
            usePaperContainer={this.props.showOptsInSettings}
          />
        )}
        { (this.state.isUserInJobPlacementProgram && this.props.showOptsInSettings) && (
          <Paper className={props.classes.paper}>
            <FormControl component="fieldset">
              <FormLabel component="legend" className={props.classes.legend}>
                Aquí tus 3 proyectos de Github más relevantes.
                Verifica  que respete la siguiente estructura: https://github.com/aocsa/sushi-react-app
              </FormLabel>
              <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[0]}
                error={!this.isUrlAndMyRepo(this.state.githubUrls[0])}
                helperText={!this.isUrlAndMyRepo(this.state.githubUrls[0]) ? 'Verifica que es una Urls de tu  repositorio  de Github.' : ''}
                inputId="githubUrls/0"
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer={false}
              />
              <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[1]}
                error={!this.isUrlAndMyRepo(this.state.githubUrls[1])}
                helperText={!this.isUrlAndMyRepo(this.state.githubUrls[1]) ? 'Verifica que es una Urls de tu repositorio de Github.' : ''}
                inputId="githubUrls/1"
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer={false}
              />
              <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[2]}
                error={!this.isUrlAndMyRepo(this.state.githubUrls[2])}
                helperText={!this.isUrlAndMyRepo(this.state.githubUrls[2]) ? 'Verifica que es una Urls de tu  repositorio  de Github.' : ''}
                inputId="githubUrls/2"
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer={false}
              />
            </FormControl>
          </Paper>
        )}

        { (this.state.isUserInJobPlacementProgram && this.props.showOptsInSettings) && (
          <div>
            <Paper className={props.classes.paper}>
              <Button onClick={this.handleOpen}> Verificar mis projectos de Github</Button>
              <a
                href={`https://profile/${this.props.uid}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver mi perfil en talento
              </a>
            </Paper>

            <Dialog
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={this.state.open}
              onClose={this.handleClose}
            >
              <DialogTitle id="form-dialog-title">Github Projects</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Tus projectos en github.
                </DialogContentText>
                <div>{this.createGithubCards(this.state.githubUrls)}</div>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </React.Fragment>
    );
  }
}


FormControlWrapper.propTypes = {
  inputId: PropTypes.string.isRequired,
  inputLabel: PropTypes.string,
  inputValue: PropTypes.string.isRequired,
  multiline: PropTypes.bool,
  classes: PropTypes.shape({
    textField: PropTypes.string,
    paper: PropTypes.string,
    root: PropTypes.string,
  }),
  error: PropTypes.bool,
  helperText: PropTypes.string,
  disabled: PropTypes.string,
  updateValueOnProfile: PropTypes.func.isRequired,
  usePaperContainer: PropTypes.bool,
};

FormControlWrapper.defaultProps = {
  multiline: undefined,
  classes: undefined,
  error: undefined,
  helperText: undefined,
  inputLabel: undefined,
  disabled: undefined,
  usePaperContainer: undefined,
};

DesignerForm.propTypes = {
  showOptsInSettings: PropTypes.bool,
  firebase: PropTypes.shape({
    firestore: PropTypes.func,
  }).isRequired,
  uid: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    aboutMe: PropTypes.shape({
      highlights: PropTypes.object.isRequired,
    }),
  }).isRequired,
};


DesignerForm.defaultProps = {
  showOptsInSettings: undefined,
};


export default withStyles(styles)(DesignerForm);
