/* eslint react/no-multi-comp: "off" */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Tabs, { Tab } from 'material-ui/Tabs';
import AppBar from 'material-ui/AppBar';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import GithubCard from '../components/github-card';
import DesignerForm from '../components/designer-form';
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


class RecommendedAsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recomendedAs: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.firebase.firestore().collection('users').doc(this.props.uid).get()
      .then(res => this.setState({ recomendedAs: res.data().recomendedAs }));
  }

  handleChange(event) {
    this.setState({ recomendedAs: event.target.value });
    this.props.firebase.firestore().collection('users').doc(this.props.uid).update({ recomendedAs: event.target.value });
  }

  render() {
    return (
      <FormControl>
        <InputLabel htmlFor="recomended-as">Perfil</InputLabel>
        <Select
          native
          value={this.state.recomendedAs}
          onChange={this.handleChange}
          inputProps={{
            id: 'recomended-as',
          }}
        >
          <option value="" />
          <option value="UX Designer">UX Designer</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Frontend Designer">Frontend Designer</option>
        </Select>
      </FormControl>
    );
  }
}


RecommendedAsForm.propTypes = {
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
};


class EnglishLevelForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      englishLevel: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.firebase.firestore().collection('users').doc(this.props.uid).get()
      .then(res => this.setState({ englishLevel: res.data().englishLevel }));
  }

  handleChange(event) {
    this.setState({ englishLevel: event.target.value });
    this.props.firebase.firestore().collection('users').doc(this.props.uid).update({
      englishLevel: event.target.value,
    });
  }

  render() {
    return (
      <FormControl>
        <InputLabel htmlFor="english-level">Nivel de Ingles</InputLabel>
        <Select
          native
          value={this.state.englishLevel}
          onChange={this.handleChange}
          inputProps={{
            id: 'english-level',
          }}
        >
          <option value="" />
          <option value="basic">Básico</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </Select>
      </FormControl>
    );
  }
}


EnglishLevelForm.propTypes = {
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
};


class ValidationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // githubUrls: [],
      recommendation: '',
      selectedTab: 0,
      githubUrls: {},
    };

    this.handleChange = (event, selectedTab) => {
      this.setState({ ...this.state, selectedTab });
    };
  }

  componentWillMount() {
    const { profile, auth } = this.props;
    if (profile) {
      if (profile.githubUrls) {
        this.setState({
          githubUrls: Object.values(profile.githubUrls),
        });
      }

      if (profile.recommendations && profile.recommendations[auth.uid]) {
        this.setState({
          recommendation: profile.recommendations[auth.uid].detail,
        });
      }
    }
  }

  designerForm() {
    return (
      <div component="div" style={{ padding: 8 * 3 }}>
        <RecommendedAsForm {...this.props} />
        <EnglishLevelForm {...this.props} />
        <DesignerForm {...this.props} />
      </div>
    );
  }

  projectsForm() {
    return this.state.githubUrls && Object.values(this.state.githubUrls).map((url, index) => (
      <GithubCard
        url={url}
        pos={index}
        key={this.props.uid}
        firebase={this.props.firebase}
        uid={this.props.uid}
      />
    ));
  }

  updateRecommendations(authorUid, detail) {
    const db = this.props.firebase.firestore();
    const userDocRef = db.collection('users').doc(this.props.uid);

    if (detail.length === 0) {
      return this.props.firebase.firestore().collection('users').doc(authorUid).get()
        .then(() =>
          userDocRef.update({
            [`recommendations.${authorUid}`]: this.props.firebase.firestore.FieldValue.delete(),
          }));
    }
    return this.props.firebase.firestore().collection('users').doc(authorUid).get()
      .then(adminUser =>
        userDocRef.update({
          [`recommendations.${authorUid}`]: {
            from: adminUser.data().name,
            authorLinkedin: adminUser.data().linkedin,
            company: 'Dekoclick',
            companyUrl: 'Dekoclick',
            detail,
          },
        }));
  }

  endorseForm() {
    const {
      uid, auth, profile, firebase,
    } = this.props;

    return (
      <div>
        <LifeSkillsForm firebase={firebase} uid={uid} auth={auth} />
        <FormControl component="fieldset" fullWidth>
          <TextField
            id="recommendation"
            label={`Escribe una recomendación para ${profile.name}`}
            value={this.state.recommendation || ''}
            multiline
            rowsMax="5"
            // margin="normal"
            error={this.state.recommendation.length > 280}
            helperText={
              this.state.recommendation.length > 280
                ? 'Error: use solo 280 caracteres'
                : 'Puedes usar hasta 280 caracteres.'
            }
            margin="dense"
            onChange={(e) => {
              this.setState({ recommendation: e.target.value });
              this.updateRecommendations(this.props.auth.uid, e.target.value);
            }}
          />
        </FormControl>
      </div>
    );
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
            <Tab label="About her" />
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
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  profile: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(ValidationForm);
