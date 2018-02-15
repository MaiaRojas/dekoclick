import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { FormControl, FormLabel } from 'material-ui/Form';
import Input from 'material-ui/Input';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import TopBar from '../components/top-bar';
import { CircularProgress } from 'material-ui/Progress';
import { firebaseConnect, dataToJS, isLoaded, isEmpty } from 'react-redux-firebase';
import MenuItem from 'material-ui/Menu/MenuItem';
import TextField from 'material-ui/TextField';
import Tabs, { Tab } from 'material-ui/Tabs';
import hasOwnProperty from '../util/hasOwnProperty';
import AppBar from 'material-ui/AppBar';
import GithubCard from '../components/github-card';
import SettingsForm from '../components/settings-form'
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import LifeSkillsForm from '../components/life-skills-form';

const styles = theme => ({
  paper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing.unit * 3,
  },
  legend: {
    marginBottom: theme.spacing.unit * 2,
  },
  listItem: {
   width: '100%',
   maxWidth: 360,
   backgroundColor: theme.palette.background.paper,
 },
});

function TabContainer(props) {
  return (
    <div component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </div>
  );
}

class ValidationForm extends React.Component {
	state = {
    githubUrls :  [],
    recomendation : '',
    selectedTab :0,
    githubUrls : {}
	};

  handleChange = (event, selectedTab) => {
    this.setState({ ...this.state, selectedTab });
  }


  projectsForm () {
    return this.state.githubUrls && Object.values (this.state.githubUrls).map( (url, index) => {
       return <GithubCard url = {url} pos = {index} key = {index} firebase = {this.props.firebase} uid = {this.props.uid} />
    })
  }


  endorseForm () {

    const {classes} = this.props;

    return <div>
        <LifeSkillsForm firebase = {this.props.firebase} uid = {this.props.uid} auth = {this.props.auth}/>

        <FormControl component="fieldset" fullWidth={true}>
           <TextField
             id={'recomendation'}
             label={`Escribe una recomendación para ${this.props.profile.name}`}
             value={this.state.recomendation || ''}
             multiline
             rowsMax="5"
             className={this.props.classes.textField}
             margin="normal"
              error={ this.state.recomendation.length  > 280  }
              helperText={ this.state.recomendation.length  > 280? 'Error: use solo 280 caracteres' : 'Puedes usar hasta 280 caracteres.' }
              margin="dense"
             onChange={(e) => {
                   let detail  = e.target.value;
                   let who  = {
                     from : this.props.auth.displayName,
                     company : 'Laboratoria',
                     companyUrl : 'www.laboratoria.la',
                     detail : detail
                   }
                   this.setState ({
                     recomendation : detail
                   })
                   this.props.firebase.firestore().collection('users').doc(this.props.uid).update( {[`recomendations.${this.props.auth.uid}`] : who} );
             }}
           />
         </FormControl>
      </div>
  }

  settingsForm () {
    const props = this.props;
    return (
        <div  component="div" style={{ padding: 8 * 3 }}>
          <SettingsForm {...this.props}   />
        </div>
      );
  }
  componentWillMount () {
    if (this.props.profile) {
      if (this.props.profile.githubUrls) {
        this.setState ({
          githubUrls: Object.values (this.props.profile.githubUrls)
        })
      }

      if (this.props.profile.recomendations &&  this.props.profile.recomendations[ this.props.auth.uid]) {
        this.setState ({  recomendation:  this.props.profile.recomendations[ this.props.auth.uid].detail});
      }
    }
  }
	render() {
		const props = this.props;
    return (
      <div className="settings">
            <AppBar position="static" color="default">
              <Tabs
                value={this.state.selectedTab}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab label="Info" />
                <Tab label="Projects" />
                <Tab label="Endorse" />
              </Tabs>
            </AppBar>
            {this.state.selectedTab === 0 && this.settingsForm() }
            {this.state.selectedTab === 1 && this.projectsForm() }
            {this.state.selectedTab === 2 && this.endorseForm()}
      </div>
    );
  }
}

const ValidationContainer = (props) => {
	if (!props.profile.name) {
		return <CircularProgress />;
	}
	return <ValidationForm {...props} />;
};

ValidationForm.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(ValidationContainer);
