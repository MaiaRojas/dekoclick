import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import CommentIcon from 'material-ui-icons/Comment';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class CheckboxList extends React.Component {
  state = {
    checked: [],
  };

  lifeSkills = ["selfLearning", "problemSolving", "timeManagement", "askForHelp", "adaptability", "proactivity", "decisionMaking", "teamWork", "communication", "feedback", "conflictResolution"]
  lifeSkillsIntr = ["Autoaprendizaje", "Solución de problemas", "Planificación y manejo del tiempo", "Comunica su progreso y pide ayuda a tiempo", "Adaptabilidad", "Proactividad", "Toma de decisiones", "Trabajo en equipo", "Comunicación eficaz", "Dar y recibir feedback", "Negociación/resolución de conflictos "]

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });

    newChecked.forEach (lifeSkill => {
      let columnName = `lifeSkills/${lifeSkill}/${ this.props.auth.uid}`

      let who  = {
        author : this.props.auth.displayName,
        company : 'Laboratoria',
        companyUrl : 'www.laboratoria.la'
      }
      const fieldStructure = columnName.split('/').join('.');

      this.props.firebase.firestore().collection ('users').doc(this.props.uid).update ( { [`${fieldStructure}`] : who} )
    })

  };

  componentWillMount () {
    const findLifeSkill = (authorIds, uid) => {
      console.log ('authorids', authorIds)
      console.log ('uid', uid)

      console.log ('authorIds[uid]', authorIds[uid])

      return authorIds[uid] != null
    }

    this.props.firebase.firestore().collection('users').doc(this.props.uid).get().then(res => {
      let skills = res.data().lifeSkills;
      let newChecked = [];
      if (skills) {
          skills.forEach ( key => {
            if ( findLifeSkill( skills[key],  this.props.auth.uid) )
              newChecked.push ( key )
          })
          this.setState({
            checked: newChecked,
          });
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <List>
          { this.lifeSkills.map( (value, index) => (
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
            <ListItemText primary={ `${ this.lifeSkillsIntr [index]}`} />

            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);
