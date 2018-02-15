import React from 'react';
import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Card, { CardHeader, CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel } from 'material-ui/Form';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import TopBar from '../components/top-bar';
import { CircularProgress } from 'material-ui/Progress';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import hasOwnProperty from '../util/hasOwnProperty';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import isUrl from '../util/isUrl'
import GithubCard from '../components/github-card';
import Github  from '@octokit/rest'
let octokit = Github();


const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 3,
  },
  legend: {
    marginBottom: theme.spacing.unit * 2,
  },
});

const FormControlWrapper = (props) => {
    const content = <FormControl component="fieldset" fullWidth={true}>
        <TextField
          id={props.inputId}
          label={props.inputLabel}
          value={props.inputValue || ''}
          multiline = {props.multiline}
          rowsMax="5"
          className={props.classes.textField}
          margin="normal"
          error={ props.error? true : false }
          helperText={props.helperText}
          margin="dense"
          disabled = {props.disabled}
          onChange={(e) => {
            if (props.updateValueOnProfile)
              props.updateValueOnProfile(e.target.id, e.target.value);
          }}
        />
      </FormControl>

    if (props.usePaperContainer) {
      return <Paper className={props.classes.paper}>
        {content}
      </Paper>
    }else {
      return <div>
		    {content}
      </div>
    }
  }

class SettingsForm extends React.Component{
  state = {
		email: '',
		name: '',
		github: '',
		linkedin: '',
		portfolio: '',
		photo: '',
		aboutMe: {
			summary: '', //newbio
			highlights: {
				strengthsAndWeaknesses: '',
				biggestChallenges: '',
				biggestAchievements: '',
				careerGoals: '',
				areaOfInterest: ''
			}
		},
    githubUrls :  {
      '0' : '',
      '1' : '',
      '2' : '',
    },
    open : false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  createGithubCards () {
    return Object.values (this.state.githubUrls).map( (url, index) => {
       return <GithubCard url = {url} pos = {index} key = {index} firebase = {this.props.firebase} uid = {this.props.uid} />
    })
  }
	componentWillMount() {
		if (this.props.profile.name) {
      let res =  Object.assign({}, this.state, this.props.profile);
      if (this.props.profile.aboutMe){
        res.aboutMe =  Object.assign({}, this.state.aboutMe, this.props.profile.aboutMe);
        if (this.props.profile.aboutMe.highlights)
          res.aboutMe.highlights =  Object.assign({}, this.state.aboutMe.highlights, this.props.profile.aboutMe.highlights);
      }
			this.setState(res);
		}
	}

	updateValueOnProfile = (columnName, newValue) => {
		let dicc = this.state;
		let column = '';
		const items = columnName.split('/');
		column = items[0];
		let maindicc = dicc;
		for (let i = 0; i < items.length; i++) {
			column = items[i];
			if (i == items.length - 1) {
				dicc[column] = newValue ? newValue : '';
			} else {
				dicc = dicc[column];
			}
		}
		this.setState(maindicc);
    const fieldStructure = columnName.split('/').join('.');
    const obj = {[`${fieldStructure}`]:  newValue}
    this.props.firebase.firestore().collection('users').doc(this.props.uid).update( obj );
  }

  isUrlAndMyRepo(url) {

    return  isUrl(url) && url.includes(`https://github.com/${this.state.github}`);
  }

  render () {
    const props = this.props;


    return (<React.Fragment>

       {
         this.props.showOpenDialog &&
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
      }

      <FormControlWrapper
          {...props}
          inputLabel={'Nombre'}
          inputValue={this.state.name}
          inputId={'name'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          inputLabel={'GitHub'}
          inputValue={this.state.github}
          helperText = {'Ejemplo: Si tu github es: https://github.com/Laboratoria/, entonces escribir solamente el nick "Laboratoria"'}
          error= { isUrl(this.state.github) }
          inputId={'github'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          inputLabel={'Linkedin'}
          inputValue={this.state.linkedin}
          helperText = {'Ejemplo: Si tu linkedin es: https://www.linkedin.com/in/williamhgates/, entonces escribir solamente el nick "williamhgates"'}
          inputId={'linkedin'}
          error= { isUrl(this.state.linkedin) }
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Biografía'}
          helperText = {this.state.aboutMe.summary.length > 280? 'Use solo 280 caracteres' : 'A partir de aqui puedes usar hasta 280 caracteres.'}
          inputValue={this.state.aboutMe.summary}
          error= {this.state.aboutMe.summary.length > 280}
          inputId={'aboutMe/summary'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Fortalezas y debilidades'}
          inputValue={this.state.aboutMe.highlights.strengthsAndWeaknesses}
          error= {this.state.aboutMe.highlights.strengthsAndWeaknesses.length > 280}
          helperText = {this.state.aboutMe.highlights.strengthsAndWeaknesses.length > 280? 'Use solo 280 caracteres' : ''}
          inputId={'aboutMe/highlights/strengthsAndWeaknesses'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Mayores retos enfrentados en la vida'}
          inputValue={this.state.aboutMe.highlights.biggestChallenges}
          error= {this.state.aboutMe.highlights.biggestChallenges.length > 280}
          helperText = {this.state.aboutMe.highlights.biggestChallenges.length > 280? 'Use solo 280 caracteres' : ''}
          inputId={'aboutMe/highlights/biggestChallenges'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Mayores logros conseguidos'}
          inputValue={this.state.aboutMe.highlights.biggestAchievements}
          error= {this.state.aboutMe.highlights.biggestAchievements.length > 280}
          helperText = {this.state.aboutMe.highlights.biggestAchievements.length > 280? 'Use solo 280 caracteres' : ''}
          inputId={'aboutMe/highlights/biggestAchievements'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Metas profesionales'}
          inputValue={this.state.aboutMe.highlights.careerGoals}
          error= {this.state.aboutMe.highlights.careerGoals.length > 280}
          helperText = {this.state.aboutMe.highlights.careerGoals.length > 280? 'Use solo 280 caracteres' : ''}
          inputId={'aboutMe/highlights/careerGoals'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        <FormControlWrapper
          {...props}
          multiline = {true}
          inputLabel={'Sector de interés'}
          inputValue={this.state.aboutMe.highlights.areaOfInterest}
          error= {this.state.aboutMe.highlights.areaOfInterest.length > 280}
          helperText = {this.state.aboutMe.highlights.areaOfInterest.length > 280? 'Use solo 280 caracteres' : ''}
          inputId={'aboutMe/highlights/areaOfInterest'}
          updateValueOnProfile={this.updateValueOnProfile}
          usePaperContainer = {this.props.showOpenDialog}
        />
        {
         this.props.showOpenDialog  &&
          <Paper className={props.classes.paper}>

          <FormControl component="fieldset">
            <FormLabel component="legend" className={props.classes.legend}>
              Aquí tus 3 proyectos de Github más relevantes.
              Verifica  que respete la siguiente estructura: https://github.com/aocsa/sushi-react-app
            </FormLabel>


            <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[0]}
                error= { !this.isUrlAndMyRepo(this.state.githubUrls[0]) }
                helperText = {!this.isUrlAndMyRepo(this.state.githubUrls[0]) ? 'Verifica que es una Urls de tu  repositorio  de Github.' : ''}
                inputId={'githubUrls/0'}
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer = {false}
            />


            <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[1]}
                error= { !this.isUrlAndMyRepo(this.state.githubUrls[1]) }
                helperText = {!this.isUrlAndMyRepo(this.state.githubUrls[1]) ? 'Verifica que es una Urls de tu  repositorio  de Github.' : ''}
                inputId={'githubUrls/1'}
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer = {false}
            />

            <FormControlWrapper
                {...props}
                inputValue={this.state.githubUrls[2]}
                error= { !this.isUrlAndMyRepo(this.state.githubUrls[2]) }
                helperText = {!this.isUrlAndMyRepo(this.state.githubUrls[2]) ? 'Verifica que es una Urls de tu  repositorio  de Github.' : ''}
                inputId={'githubUrls/2'}
                updateValueOnProfile={this.updateValueOnProfile}
                usePaperContainer = {false}
            />
            </FormControl>
          </Paper>
       }
       {
         this.props.showOpenDialog &&
         <div>
          <Paper className={props.classes.paper}>
            <Button onClick={this.handleOpen}>Ver mis projectos Github</Button>

            <a href={`https://laboratoria-la-talento-aocsa.firebaseapp.com/profile/${this.props.uid}`} target="_blank">Ver mi perfil en talento.laboratoria.la!</a>


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
                <div>
                  {
                     this.createGithubCards(this.state.githubUrls)
                  }
                </div>

            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      }
    </React.Fragment>)
  }
}
export default withStyles(styles)(SettingsForm);
