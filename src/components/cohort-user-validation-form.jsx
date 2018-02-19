import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import GithubCard from '../components/github-card';
import SettingsForm from '../components/settings-form';
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
});


class ValidationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      githubUrls: [],
      recomendation: '',
      selectedTab: 0,
      githubUrls: {},
    };

    this.handleChange = (event, selectedTab) => {
      this.setState({ ...this.state, selectedTab });
    };
  }

  projectsForm() {
    return this.state.githubUrls && Object.values(this.state.githubUrls).map((url, index) => (
      <GithubCard
        url={url}
        pos={index}
        key={index}
        firebase={this.props.firebase}
        uid={this.props.uid}
      />
    ));
  }

  endorseForm() {
    const { uid, auth, profile, firebase, classes } = this.props;
    const db = firebase.firestore();
    const userDocRef = db.collection('users').doc(uid);

    return (
      <div>
        <LifeSkillsForm firebase={firebase} uid={uid} auth={auth} />
        <FormControl component="fieldset" fullWidth>
          <TextField
            id="recomendation"
            label={`Escribe una recomendación para ${profile.name}`}
            value={this.state.recomendation || ''}
            multiline
            rowsMax="5"
            className={classes.textField}
            margin="normal"
            error={this.state.recomendation.length > 280}
            helperText={
              this.state.recomendation.length > 280
                ? 'Error: use solo 280 caracteres'
                : 'Puedes usar hasta 280 caracteres.'
            }
            margin="dense"
            onChange={(e) => {
              this.setState({ recomendation: e.target.value });
              userDocRef.update({
                [`recomendations.${auth.uid}`]: {
                  from: auth.displayName,
                  company: 'Laboratoria',
                  companyUrl: 'www.laboratoria.la',
                  detail: e.target.value,
                },
              });
            }}
          />
        </FormControl>
      </div>
    );
  }

  settingsForm() {
    return (
      <div component="div" style={{ padding: 8 * 3 }}>
        <SettingsForm {...this.props} />
      </div>
    );
  }

  componentWillMount() {
    const { profile, auth } = this.props;
    if (profile) {
      if (profile.githubUrls) {
        this.setState({
          githubUrls: Object.values(profile.githubUrls),
        });
      }

      if (profile.recomendations && profile.recomendations[auth.uid]) {
        this.setState({
          recomendation: profile.recomendations[auth.uid].detail,
        });
      }
    }
  }

  render() {
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
        {this.state.selectedTab === 0 && this.settingsForm()}
        {this.state.selectedTab === 1 && this.projectsForm()}
        {this.state.selectedTab === 2 && this.endorseForm()}
      </div>
    );
  }
}


ValidationForm.propTypes = {
  classes: PropTypes.shape({
    paper: PropTypes.string.isRequired,
    legend: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(ValidationForm);
