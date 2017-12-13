import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, dataToJS } from 'react-redux-firebase';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormGroup, FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import SentimentVerySatisfiedIcon from 'material-ui-icons/SentimentVerySatisfied';
import SentimentNeutralIcon from 'material-ui-icons/SentimentNeutral';
import SentimentVeryDissatisfiedIcon from 'material-ui-icons/SentimentVeryDissatisfied';


const styles = {
  root: {
    maxWidth: 760,
    margin: '0 auto',
  },
  headline: {
    margin: '32px 0px',
    fontWeight: 'bold',
  },
  paper: {
    padding: 20,
    marginBottom: 30,
  },
  fieldset: {
    width: '100%',
    marginBottom: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  sentimentIcon: {
    width: 100,
    height: 100,
  },
  hidden: {
    display: 'none',
  },
};

const matchParamsToUnitPath = ({ cohortid, courseid, unitid }) =>
  `cohortCourses/${cohortid}/${courseid}/syllabus/${unitid}`;


const isReadType = part =>
  ['lectura', 'read'].indexOf(part.type) > -1;


const formatDate = (submittedAt) => {
  const date = new Date(submittedAt);
  return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
};


class SelfAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      sentiment: null,
      feelings: '',
      improvements: '',
      hasCheckedOtherTopic: false,
      otherTopics: '',
      topics: [],
      errors: {
        sentiment: '',
        feelings: '',
      },
    };
  }

  getSelfLearningParts() {
    return Object.keys(this.props.unit.parts)
      .filter(key => isReadType(this.props.unit.parts[key]))
      .sort();
  }

  getSelfLearningTitle(selfLearning) {
    return this.props.unit.parts[selfLearning].title;
  }

  sentimentToIcon(val) {
    const className = this.props.classes.sentimentIcon;
    switch (val) {
      case -1:
        return <SentimentVeryDissatisfiedIcon className={className} />;
      case 1:
        return <SentimentVerySatisfiedIcon className={className} />;
      default:
        return <SentimentNeutralIcon className={className} />;
    }
  }

  handleTopicChange(e) {
    const { value: topicId, checked } = e.target;
    const { topics } = this.state;

    if (checked) {
      topics.push(topicId);
    } else {
      topics.splice(topics.indexOf(topicId), 1);
    }

    this.setState({
      topics,
    });
  }

  submit() {
    const {
      sentiment,
      feelings,
      improvements,
      topics,
      hasCheckedOtherTopic,
      otherTopics,
    } = this.state;
    const errors = {};

    if (typeof sentiment !== 'number') {
      errors.sentiment = 'sentiment is required';
    }

    if (!feelings) {
      errors.feelings = 'feelings is required';
    }

    if (Object.keys(errors).length > 0) {
      return this.setState({ errors });
    }

    if (hasCheckedOtherTopic && otherTopics.length > 0) {
      topics.push({ 'other-topics': otherTopics });
    }

    // clear errors from state
    this.setState({
      errors: {
        sentiment: '',
        feelings: '',
      },
    });

    this.props.firebase.database()
      .ref(`cohortProgress/${this.props.unitProgressPath}/selfAssessment`)
      .update({
        sentiment,
        feelings,
        improvements,
        topics,
        submittedAt: new Date(),
      });

    return false;
  }

  render() {
    const { classes, selfAssessment } = this.props;
    const selfLearnings = this.getSelfLearningParts(this.props.unit);
    const hasSelfLearnings = (selfLearnings && selfLearnings.length > 0);

    if (selfAssessment && selfAssessment.submittedAt) {
      return (
        <div className={classes.root}>
          <Typography type="headline" gutterBottom className={classes.headline}>
            Autoevaluación completada el {formatDate(selfAssessment.submittedAt)}
          </Typography>
          <Typography type="subheading" gutterBottom>
            1. Así me siento sobre la unidad que acaba de terminar...
          </Typography>
          <Typography gutterBottom>
            {this.sentimentToIcon(selfAssessment.sentiment)}
          </Typography>
          <Typography type="subheading" gutterBottom>
            2. ¿Por qué te sientes así?
          </Typography>
          <Typography gutterBottom>
            {selfAssessment.feelings}
          </Typography>
          <Typography type="subheading" gutterBottom>
            3. Marca todos los temas que NO te han quedado claros
          </Typography>
          {(selfAssessment.topics || []).map((key, idx) => (
            <Typography key={key || idx}>
              {typeof key === 'object' ?
                  key['other-topics'] :
                  this.getSelfLearningTitle(key)}
            </Typography>
          ))}
          <Typography type="subheading" gutterBottom>
            4. ¿Hay algo que quieras destacar/mejorar de esta unidad?
          </Typography>
          <Typography gutterBottom>
            {selfAssessment.improvements || '-'}
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <Typography type="headline" gutterBottom className={classes.headline}>
          Autoevaluación
        </Typography>

        <Paper className={classes.paper}>
          <FormControl
            error={!!this.state.errors.sentiment}
            className={classes.fieldset}
            component="fieldset"
            required
          >
            <FormLabel component="legend">
              1. Así me siento sobre la unidad que acaba de terminar...
            </FormLabel>
            <FormGroup className={classes.formGroup}>
              <IconButton
                color={this.state.sentiment === 1 ? 'primary' : 'default'}
                onClick={() => this.setState({ sentiment: 1 })}
              >
                {this.sentimentToIcon(1)}
              </IconButton>
              <IconButton
                color={this.state.sentiment === 0 ? 'primary' : 'default'}
                onClick={() => this.setState({ sentiment: 0 })}
              >
                {this.sentimentToIcon(0)}
              </IconButton>
              <IconButton
                color={this.state.sentiment === -1 ? 'primary' : 'default'}
                onClick={() => this.setState({ sentiment: -1 })}
              >
                {this.sentimentToIcon(-1)}
              </IconButton>
            </FormGroup>
          </FormControl>
        </Paper>

        <Paper className={classes.paper}>
          <FormControl
            error={!!this.state.errors.feelings}
            className={classes.fieldset}
            component="fieldset"
            required
          >
            <FormLabel component="legend">
              2. ¿Por qué te sientes así?
            </FormLabel>
            <TextField
              multiline
              className={classes.textField}
              margin="normal"
              value={this.state.feelings}
              onChange={e => this.setState({ feelings: e.target.value })}
            />
          </FormControl>
        </Paper>

        {hasSelfLearnings &&
          <Paper className={classes.paper}>
            <FormControl className={classes.fieldset} component="fieldset">
              <FormLabel component="legend">
                3. Marca todos los temas que NO te han quedado claros
              </FormLabel>
              <FormGroup>
                {selfLearnings.map((key, idx) => (
                  <FormControlLabel
                    key={key}
                    id={key}
                    idx={idx}
                    control={
                      <Checkbox
                        value={key}
                        onChange={this.handleTopicChange}
                      />
                    }
                    label={this.getSelfLearningTitle(key)}
                  />
                ))}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.hasCheckedOtherTopic}
                      onChange={e => this.setState({ hasCheckedOtherTopic: e.target.checked })}
                      value="another-topic"
                    />
                  }
                  label="Otro"
                />
                {this.state.hasCheckedOtherTopic && (
                  <TextField
                    multiline
                    className={classes.textField}
                    margin="normal"
                    onChange={e => this.setState({ otherTopics: e.target.value })}
                    placeholder="Otro tema..."
                  />
                )}
              </FormGroup>
            </FormControl>
          </Paper>
        }

        <Paper className={classes.paper}>
          <FormControl className={classes.fieldset} component="fieldset">
            <FormLabel component="legend">
              {hasSelfLearnings ? '4' : '3'}. ¿Hay algo que quieras destacar/mejorar de esta unidad?
            </FormLabel>
            <TextField
              multiline
              className={classes.textField}
              margin="normal"
              value={this.state.improvements}
              onChange={e => this.setState({ improvements: e.target.value })}
            />
          </FormControl>
        </Paper>

        <Button raised color="primary" onClick={this.submit}>
          Enviar autoevaluación
        </Button>
      </div>
    );
  }
}


SelfAssessment.propTypes = {
  unitProgressPath: PropTypes.string.isRequired,
  selfAssessment: PropTypes.shape({}),
  firebase: PropTypes.shape({
    database: PropTypes.func.isRequired,
  }).isRequired,
  classes: PropTypes.shape({
    sentimentIcon: PropTypes.string.isRequired,
  }).isRequired,
  unit: PropTypes.shape({
    parts: PropTypes.shape({}),
  }),
};


SelfAssessment.defaultProps = {
  unit: undefined,
  selfAssessment: undefined,
};


const mapStateToProps = ({ firebase }, { match }) => ({
  unit: dataToJS(firebase, matchParamsToUnitPath(match.params)),
});


export default compose(
  firebaseConnect(({ match }) => [
    matchParamsToUnitPath(match.params),
  ]),
  connect(mapStateToProps),
  withStyles(styles),
)(SelfAssessment);
