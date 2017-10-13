import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormGroup, FormControl, FormLabel } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
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
};


class SelfAssessment extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      sentiment: null,
      feelings: '',
      improvements: '',
      errors: {
        sentiment: '',
        feelings: '',
      },
    };
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

  submit() {
    const { sentiment, feelings, improvements } = this.state;
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
        submittedAt: new Date(),
      });

    return false;
  }

  render() {
    const { classes, selfAssessment } = this.props;

    if (selfAssessment && selfAssessment.submittedAt) {
      return (
        <div className={classes.root}>
          <Typography type="headline" gutterBottom className={classes.headline}>
            Auto evaluación completada el {selfAssessment.submittedAt}
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
            3. ¿Hay algo que quieras destacar/mejorar de esta unidad?
          </Typography>
          <Typography gutterBottom>
            {selfAssessment.improvements}
          </Typography>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <Typography type="headline" gutterBottom className={classes.headline}>
          Auto evaluación
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

        <Paper className={classes.paper}>
          <FormControl className={classes.fieldset} component="fieldset">
            <FormLabel component="legend">
              3. ¿Hay algo que quieras destacar/mejorar de esta unidad?
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
          Enviar auto evaluación
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
};


SelfAssessment.defaultProps = {
  selfAssessment: undefined,
};


export default withStyles(styles)(SelfAssessment);
