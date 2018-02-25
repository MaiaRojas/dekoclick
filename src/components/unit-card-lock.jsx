import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import LockIcon from 'material-ui-icons/Lock';
import DoneIcon from 'material-ui-icons/Done';
import ErrorIcon from 'material-ui-icons/Error';


const styles = {
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: 'rgba(255,255,255,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    textAlign: 'center',
    maxWidth: 420,
  },
};


// filters out nested deps when parent is incomplete or insuficient score
const dedupeDeps = (depsCheck) => {
  return Object.keys(depsCheck.results || {}).sort().reduce((memo, depPath) => {
    const depPathParts = depPath.split('/');
    const dupe = depPathParts.reduce((dupe, part, idx) => {
      if (memo.includes(depPathParts.slice(0, idx + 1).join('/'))) {
        return depPathParts.slice(0, idx + 1).join('/');
      }
      return dupe;
    }, null);
    return dupe ? memo : [...memo, depPath];
  }, []);
};


const UnitCardLock = ({ depsCheck, syllabus, classes }) => (
  <div className={classes.root}>
    <div className={classes.container}>
      <LockIcon />
      {!depsCheck.completed && (
        <Typography>Requisitos para desbloquear esta unidad:</Typography>
      )}
      {depsCheck.completed && !depsCheck.score && (
        <Typography>
          Parece que ya completaste los requisitos para desbloquear esta
          unidad, pero desafortunadamente tu puntuación no fue suficiente.
        </Typography>
      )}
      <List dense>
        {dedupeDeps(depsCheck).map(depPath => {
          const [unitid, partid, embedCat, embedid] = depPath.split('/');
          const unit = syllabus.find(unit => unit.id === unitid);
          const result = depsCheck.results[depPath];
          return (
            <ListItem key={depPath}>
              <ListItemIcon>
                {result.ok ? <DoneIcon /> : <ErrorIcon />}
              </ListItemIcon>
              <ListItemText
                primary={`Unidad: ${unit.title}${partid ? ` > Parte: ${partid}` : ''}`}
                secondary={
                  (!result.progress.completed)
                    ? (<span>Incompleto</span>)
                    : (result.dep.score && result.progress.completed === result.dep.completed.value)
                      ? (<span>Puntiación insuficiente</span>)
                      : (<span>Completedo</span>)
                }
              />
            </ListItem>
          );
        })}
      </List>
    </div>
  </div>
);


UnitCardLock.propTypes = {
  depsCheck: PropTypes.shape({}).isRequired,
  syllabus: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
};


export default withStyles(styles)(UnitCardLock);
