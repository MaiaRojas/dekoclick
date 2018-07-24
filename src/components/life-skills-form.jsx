import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';


const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});


class CheckboxList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: [],
    };

    this.lifeSkills = [
      'selfLearning',
      'problemSolving',
      'timeManagement',
      'askForHelp',
      'adaptability',
      'proactivity',
      'decisionMaking',
      'teamWork',
      'communication',
      'feedback',
      'conflictResolution',
    ];

    this.lifeSkillsIntr = [
      'Autoaprendizaje',
      'Solución de problemas',
      'Planificación y manejo del tiempo',
      'Comunica su progreso y pide ayuda a tiempo',
      'Adaptabilidad',
      'Proactividad',
      'Toma de decisiones',
      'Trabajo en equipo',
      'Comunicación eficaz',
      'Dar y recibir feedback',
      'Negociación/resolución de conflictos',
    ];

    this.clearLifeSkill = (authorUid) => {
      this.props.firebase.firestore().collection('users').doc(this.props.uid).get()
        .then((doc) => {
          const { lifeSkills } = doc.data();
          if (lifeSkills) {
            Object.keys(lifeSkills).forEach((skillKeyName) => {
              if (lifeSkills[skillKeyName][authorUid]) {
                const columnName = `lifeSkills/${skillKeyName}/${authorUid}`;
                const fieldStructure = columnName.split('/').join('.');
                this.props.firebase.firestore().collection('users').doc(this.props.uid)
                  .update({
                    [`${fieldStructure}`]: this.props.firebase.firestore.FieldValue.delete(),
                  });
              }
            });
          }
        });
    };

    this.updateLifeSkill = (lifeSkill, authorUid) => {
      const columnName = `lifeSkills/${lifeSkill}/${authorUid}`;
      const fieldStructure = columnName.split('/').join('.');

      this.props.firebase.firestore().collection('users').doc(authorUid).get()
        .then((adminUser) => {
          this.props.firebase.firestore().collection('users').doc(this.props.uid)
            .update({
              [`${fieldStructure}`]: {
                author: adminUser.data().name,
                authorLinkedin: adminUser.data().linkedin || '',
                company: 'Dekoclick',
                companyUrl: 'Dekoclick',
              },
            });
        });
    };

    this.handleToggle = value => () => {
      const { checked } = this.state;
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      this.setState({ checked: newChecked });

      if (newChecked.length === 0) {
        this.clearLifeSkill(this.props.auth.uid);
      } else {
        newChecked.forEach((lifeSkill) => {
          this.updateLifeSkill(lifeSkill, this.props.auth.uid);
        });
      }
    };
  }

  componentWillMount() {
    const findLifeSkill = (authorIds, uid) => authorIds[uid] != null;

    this.props.firebase.firestore().collection('users').doc(this.props.uid).get()
      .then((snap) => {
        const skills = snap.data().lifeSkills;
        const newChecked = [];
        if (skills) {
          Object.keys(skills).forEach((key) => {
            if (findLifeSkill(skills[key], this.props.auth.uid)) {
              newChecked.push(key);
            }
          });
          this.setState({ checked: newChecked });
        }
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List>
          {this.lifeSkills.map((value, index) => (
            <ListItem
              key={value}
              dense
              button
              onClick={this.handleToggle(value)}
              className={classes.listItem}
            >
              <Checkbox
                checked={this.state.checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={`${this.lifeSkillsIntr[index]}`} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}


CheckboxList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  firebase: PropTypes.shape({
    firestore: PropTypes.func.isRequired,
  }).isRequired,
  uid: PropTypes.string.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
};


export default withStyles(styles)(CheckboxList);
