import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS, isLoaded } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import SettingsIcon from 'material-ui-icons/Settings';
import TopBar from '../components/top-bar';
import CohortNewDialog from '../components/cohort-new-dialog';
import { toggleCohortNewDialog } from '../reducers/cohort-new-dialog';


const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
  },
});


const programIdToName = {
  bc: 'Bootcamp',
  ec: 'Educación continua',
};


const trackIdToName = {
  core: 'Common core',
  js: 'JavaScript',
  ux: 'UX',
  mobile: 'Mobile',
};


const parseDate = (str) => {
  const parts = str.split('-');
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
  );
};


const processCohorts = ({
  cohorts,
  cohortUsers,
  cohortCourses,
  campuses,
}) =>
  Object.keys(cohorts || {})
    .reduce((memo, cohortid) => [
      ...memo,
      {
        ...cohorts[cohortid],
        id: cohortid,
        campus: (campuses[cohortid.split('-')[0]] || {}).name || 'global',
        start: cohorts[cohortid] && cohorts[cohortid].start ?
          parseDate(cohorts[cohortid].start) : new Date(),
        program: programIdToName[cohortid.split('-')[3]],
        track: trackIdToName[cohortid.split('-')[4]],
        subtrack: cohortid.split('-')[5],
        courses: Object.keys(cohortCourses[cohortid] || {}),
        users: Object.keys(cohortUsers[cohortid] || {}).length,
        students: Object.keys(cohortUsers[cohortid] || {})
          .filter(uid => cohortUsers[cohortid][uid] === 'student')
          .length,
      },
    ], [])
    .sort((a, b) => {
      if (a.start < b.start) {
        return 1;
      }
      if (a.start > b.start) {
        return -1;
      }
      return 0;
    });


const Cohorts = (props) => {
  if (!isLoaded(props.cohorts) || !isLoaded(props.campuses) ||
    !isLoaded(props.cohortUsers) || !isLoaded(props.cohortCourses)) {
    return (<CircularProgress />);
  }

  const cohorts = processCohorts(props);

  return (
    <div className={`cohorts ${props.classes.root}`}>
      <TopBar title="Cohorts">
        <IconButton onClick={props.toggleCohortNewDialog}>
          <AddIcon />
        </IconButton>
      </TopBar>
      {cohorts.map(cohort => (
        <Paper key={cohort.id} className={props.classes.paper}>
          <div>
            <Typography type="title" gutterBottom>
              {!cohort.program && cohort.id}
              {cohort.program && cohort.track &&
                `${cohort.program}: ${cohort.track} (${cohort.subtrack})`
              }
            </Typography>
            <Typography>Campus: {cohort.campus}</Typography>
            <Typography>Inicio: {cohort.start.toDateString()}</Typography>
            <Typography>Alumnas: {cohort.students}</Typography>
            <Typography>Courses: {cohort.courses.join(', ')}</Typography>
          </div>
          <div>
            <Tooltip placement="left" title="Gestionar cohort">
              <IconButton onClick={() => props.history.push(`/cohorts/${cohort.id}`)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="left"
              title={(cohort.courses.length && cohort.users) ?
                'Antes de borrar un cohort debes borrar sus cursos y miembros' :
                'Borrar cohort'
              }
            >
              <div>
                <IconButton
                  disabled={!!cohort.courses.length || !!cohort.users}
                  onClick={() =>
                    window.confirm(`Estás segura de que quieres borrar el cohort ${cohort.id}?`) &&
                      props.firebase.database()
                        .ref(`cohorts/${cohort.id}`).remove()
                        .catch(console.error)
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
          </div>
        </Paper>
      ))}
      {props.newDialogOpen &&
        <CohortNewDialog campuses={props.campuses} firebase={props.firebase} />
      }
    </div>
  );
};


Cohorts.propTypes = {
  cohorts: PropTypes.shape({}),
  campuses: PropTypes.shape({}),
  cohortUsers: PropTypes.shape({}),
  cohortCourses: PropTypes.shape({}),
  newDialogOpen: PropTypes.bool.isRequired,
  toggleCohortNewDialog: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
  }).isRequired,
  firebase: PropTypes.shape({}).isRequired,
};


Cohorts.defaultProps = {
  cohorts: undefined,
  campuses: undefined,
  cohortUsers: undefined,
  cohortCourses: undefined,
};


const mapStateToProps = ({ firebase, cohortNewDialog }) => ({
  cohorts: dataToJS(firebase, 'cohorts'),
  campuses: dataToJS(firebase, 'campuses'),
  cohortUsers: dataToJS(firebase, 'cohortUsers'),
  cohortCourses: dataToJS(firebase, 'cohortCourses'),
  newDialogOpen: cohortNewDialog.open,
});


const mapDispatchToProps = {
  toggleCohortNewDialog,
};


export default compose(
  firebaseConnect(() => ([
    'cohorts',
    'campuses',
    'cohortUsers',
    'cohortCourses',
  ])),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Cohorts);
