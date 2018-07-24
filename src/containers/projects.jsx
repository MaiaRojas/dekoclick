import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
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
import ProjectNewDialog from '../components/project-new-dialog';
import ProjectCard from '../components/project-card';
import { toggleProjectNewDialog } from '../reducers/project-new-dialog';
import { setProjectsCampusFilter, setProjectsProgramFilter } from '../reducers/projects';
import { parse as parseProjectId } from '../util/project';
import programs from '../util/programs';


console.log(programs);

const drawerWidth = 320;
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
  appBar: {
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: 'calc(100% - 73px)',
      marginLeft: '73px',
    },
  },
  appBarShift: {
    width: '100%',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  constainer: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'start',
  }
});


const parseDate = (str) => {
  const parts = str.split('-');
  return new Date(
    parseInt(parts[0], 10),
    parseInt(parts[1], 10) - 1,
    parseInt(parts[2], 10),
  );
};


const processProjects = ({
  projects,
  // cohortUsers,
  // cohortCourses,
}) =>
  projects
    .reduce((memo, project) => [
      ...memo,
      {
        ...project,
        start: project && project.start ? parseDate(project.start) : new Date(),
        // courses: Object.keys(cohortCourses[project.id] || {}),
        // users: Object.keys(cohortUsers[project.id] || {}).length,
        // students: Object.keys(cohortUsers[project.id] || {})
        //   .filter(uid => cohortUsers[project.id][uid] === 'student')
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


const Projects = (props) => {
  if (!props.projects) {
    return (<CircularProgress />);
  }

  const projects = processProjects(props);

  return (
    <div className={`projects ${props.classes.root}`}>
      <TopBar title="Projects">
        <IconButton onClick={props.toggleProjectNewDialog}>
          <AddIcon />
        </IconButton>
      </TopBar>
      <div
        position="absolute"
        className={
          classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)}
      >
        <Typography variant="title" >Proyectos</Typography>
        <IconButton onClick={props.toggleProjectNewDialog}>
          <AddIcon />
        </IconButton>
        <div className={props.classes.filterContainer}>
          <FormControl className={props.classes.formControl}>
            <InputLabel htmlFor="campus">Estado</InputLabel>
            <Select
              value={props.estadoFilter}
              onChange={e => props.setProjectsEstadoFilter(e.target.value)}
              inputProps={{ name: 'campus', id: 'campus' }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {props.campuses.map(campus => (
                <MenuItem key={campus.id} value={campus.id}>{campus.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={props.classes.formControl}>
            <InputLabel htmlFor="program">Program</InputLabel>
            <Select
              value={props.programFilter}
              onChange={e => props.setProjectsProgramFilter(e.target.value)}
              inputProps={{ name: 'program', id: 'program' }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {programs.sorted.map(program => (
                <MenuItem key={program.id} value={program.id}>{program.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl className={props.classes.formControl}>
            <InputLabel htmlFor="type">Estilo</InputLabel>
            <Select
              value={props.typeFilter}
              onChange={e => props.setProjectsTypeFilter(e.target.value)}
              inputProps={{ name: 'type', id: 'type' }}
            >
              {types.sorted.map(type => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={props.classes.formControl}>
            <InputLabel htmlFor="program">Tiempo</InputLabel>
            <Select
              value={props.programFilter}
              onChange={e => props.setProjectsProgramFilter(e.target.value)}
              inputProps={{ name: 'time', id: 'time' }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              {times.sorted.map(time => (
                <MenuItem key={time.id} value={time.id}>{time.name}</MenuItem>
              ))}
            </Select>
          </FormControl> */}
        </div>
        <div
          className={props.classes.container}
          // position="absolute"
          // className={
          //   classNames(props.classes.appBar, props.drawerOpen && props.classes.appBarShift)}
        >
        {projects.map(project => (
          <Paper key={project.id} className={props.classes.paper}>
            <ProjectCard
              key={project.id}
              project={project.id}
              project={project}
            />
            <div>
              <Tooltip placement="left" title="Gestionar project">
                <IconButton onClick={() => props.history.push(`/projects/${project.id}`)}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                placement="left"
                title={(Object.keys(project.coursesIndex || {}).length > 0 || project.usersCount > 0)
                  ? 'Antes de borrar un project debes borrar sus cursos y miembros'
                  : 'Borrar project'
                }
              >
                <div>
                  <IconButton
                    disabled={
                      Object.keys(project.coursesIndex || {}).length > 0
                        || project.usersCount > 0
                    }
                    onClick={() =>
                      window.confirm(`Estás segura de que quieres borrar el project ${project.id}?`) &&
                        props.firebase.firestore()
                          .doc(`projects/${project.id}`)
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
        </div>
        {props.newDialogOpen &&
          <ProjectNewDialog campuses={props.campuses} />
        }
      </div>
    </div>
  );
};


Projects.propTypes = {
  // projects: PropTypes.arrayOf(PropTypes.shape({})),
  // campuses: PropTypes.arrayOf(PropTypes.shape({})),
  // campusFilter: PropTypes.string,
  // programFilter: PropTypes.string,
  // newDialogOpen: PropTypes.bool.isRequired,
  // toggleCohortNewDialog: PropTypes.func.isRequired,
  // setProjectsCampusFilter: PropTypes.func.isRequired,
  // setProjectsProgramFilter: PropTypes.func.isRequired,
  // classes: PropTypes.shape({
  //   root: PropTypes.string.isRequired,
  //   paper: PropTypes.string.isRequired,
  //   filterContainer: PropTypes.string.isRequired,
  //   formControl: PropTypes.string.isRequired,
  //   appBar: PropTypes.string.isRequired,
  //   appBarShift: PropTypes.string.isRequired,
  // }).isRequired,
  // // eslint-disable-next-line react/no-unused-prop-types
  // firebase: PropTypes.shape({
  //   firestore: PropTypes.func.isRequired,
  // }).isRequired,
  // drawerOpen: PropTypes.bool,
};


Projects.defaultProps = {
  projects: undefined,
  campuses: undefined,
  estadoFilter: '',
  programFilter: '',
  drawerOpen: undefined,
};


const filterProjects = (projects, filters) => {
  if (!projects || !projects.length) {
    return projects;
  }

  return projects.reduce((memo, project) => {
    const parsed = parseProjectId(project.id);
    if (filters.campus && filters.campus !== parsed.campus) {
      return memo;
    }
    if (filters.program && filters.program !== parsed.program) {
      return memo;
    }
    return memo.concat({ ...project, ...parsed });
  }, []);
};


const mapStateToProps = ({
  firestore, projects, projectNewDialog, topbar,
}) => ({
  projects: filterProjects(firestore.ordered.projects, {
    campus: projects.campusFilter,
    program: projects.programFilter,
  }),
  campuses: firestore.ordered.campuses,
  estadoFilter: projects.estadoFilter,
  programFilter: projects.programFilter,
  newDialogOpen: projectNewDialog.open,
  drawerOpen: topbar.drawerOpen,
});


const mapDispatchToProps = {
  toggleProjectNewDialog,
  setProjectsCampusFilter,
  setProjectsProgramFilter,
};


export default compose(
  firestoreConnect(() => ['projects', 'campuses']),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(Projects);
