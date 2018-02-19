import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Select from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Tooltip from 'material-ui/Tooltip';
import AddIcon from 'material-ui-icons/Add';
import DeleteIcon from 'material-ui-icons/Delete';
import SettingsIcon from 'material-ui-icons/Settings';
import TopBar from '../components/top-bar';
import CohortNewDialog from '../components/cohort-new-dialog';
import { toggleCohortNewDialog } from '../reducers/cohort-new-dialog';
import { setCohortsCampusFilter, setCohortsProgramFilter } from '../reducers/cohorts';
import cohortParser from '../util/cohort';
import programs from '../util/programs';


const styles = theme => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between',
  },
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});


// const trackIdToName = {
//   core: 'Common core',
//   js: 'JavaScript',
//   ux: 'UX',
//   mobile: 'Mobile',
// };


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
  // cohortUsers,
  // cohortCourses,
}) =>
  cohorts
    .reduce((memo, cohort) => [
      ...memo,
      {
        ...cohort,
        start: cohort && cohort.start ? parseDate(cohort.start) : new Date(),
        // courses: Object.keys(cohortCourses[cohort.id] || {}),
        // users: Object.keys(cohortUsers[cohort.id] || {}).length,
        // students: Object.keys(cohortUsers[cohort.id] || {})
        //   .filter(uid => cohortUsers[cohort.id][uid] === 'student')
        //   .length,
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
  if (!props.cohorts || !props.campuses) {
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
      <div className={props.classes.filterContainer}>
        <FormControl className={props.classes.formControl}>
          <InputLabel htmlFor="campus">Campus</InputLabel>
          <Select
            value={props.campusFilter}
            onChange={e => props.setCohortsCampusFilter(e.target.value)}
            inputProps={{ name: 'campus', id: 'campus' }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {props.campuses.map(campus => (
              <MenuItem key={campus.id} value={campus.id}>{campus.name}</MenuItem>
            ))}
            <MenuItem value="global"><em>Global</em></MenuItem>
          </Select>
        </FormControl>
        <FormControl className={props.classes.formControl}>
          <InputLabel htmlFor="program">Program</InputLabel>
          <Select
            value={props.programFilter}
            onChange={e => props.setCohortsProgramFilter(e.target.value)}
            inputProps={{ name: 'program', id: 'program' }}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            {programs.sorted.map(program => (
              <MenuItem key={program.id} value={program.id}>{program.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {cohorts.map(cohort => (
        <Paper key={cohort.id} className={props.classes.paper}>
          <div>
            <Typography variant="title" gutterBottom>
              {!cohort.program && cohort.id}
              {cohort.program && cohort.track &&
                `${(programs.getById(cohort.program) || {}).name || ''}: ${cohort.track} (${cohort.name})`
              }
            </Typography>
            <Typography>Campus: {cohort.campus}</Typography>
            <Typography>Inicio: {cohort.start.toDateString()}</Typography>
            <Typography>Usuarios: {cohort.usersCount || 0}</Typography>
            <Typography>Courses: {Object.keys(cohort.coursesIndex || {}).join(', ')}</Typography>
          </div>
          <div>
            <Tooltip placement="left" title="Gestionar cohort">
              <IconButton onClick={() => props.history.push(`/cohorts/${cohort.id}`)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip
              placement="left"
              title={(Object.keys(cohort.coursesIndex || {}).length > 0 || cohort.usersCount > 0) ?
                'Antes de borrar un cohort debes borrar sus cursos y miembros' :
                'Borrar cohort'
              }
            >
              <div>
                <IconButton
                  disabled={
                    Object.keys(cohort.coursesIndex || {}).length > 0
                      || cohort.usersCount > 0
                  }
                  onClick={() =>
                    window.confirm(`Estás segura de que quieres borrar el cohort ${cohort.id}?`) &&
                      props.firestore.firestore()
                        .doc(`cohorts/${cohort.id}`)
                        .delete()
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
        <CohortNewDialog campuses={props.campuses} {...props} />
      }
    </div>
  );
};


Cohorts.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.shape({})),
  campuses: PropTypes.arrayOf(PropTypes.shape({})),
  campusFilter: PropTypes.string,
  programFilter: PropTypes.string,
  newDialogOpen: PropTypes.bool.isRequired,
  toggleCohortNewDialog: PropTypes.func.isRequired,
  setCohortsCampusFilter: PropTypes.func.isRequired,
  setCohortsProgramFilter: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    filterContainer: PropTypes.string.isRequired,
    formControl: PropTypes.string.isRequired,
  }).isRequired,
  firestore: PropTypes.shape({}).isRequired,
};


Cohorts.defaultProps = {
  cohorts: undefined,
  campuses: undefined,
  campusFilter: '',
  programFilter: '',
};


const filterCohorts = (cohorts, filters) => {
  if (!cohorts || !cohorts.length) {
    return cohorts;
  }

  return cohorts.reduce((memo, cohort) => {
    const parsed = cohortParser.parse(cohort.id);
    if (filters.campus && filters.campus !== parsed.campus) {
      return memo;
    }
    if (filters.program && filters.program !== parsed.program) {
      return memo;
    }
    return memo.concat({ ...cohort, ...parsed });
  }, []);
};


const mapStateToProps = ({ firestore, cohorts, cohortNewDialog }) => ({
  cohorts: filterCohorts(firestore.ordered.cohorts, {
    campus: cohorts.campusFilter,
    program: cohorts.programFilter,
  }),
  campuses: firestore.ordered.campuses,
  campusFilter: cohorts.campusFilter,
  programFilter: cohorts.programFilter,
  newDialogOpen: cohortNewDialog.open,
});


const mapDispatchToProps = {
  toggleCohortNewDialog,
  setCohortsCampusFilter,
  setCohortsProgramFilter,
};


export default compose(
  firestoreConnect(() => ['cohorts', 'campuses']),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Cohorts);
