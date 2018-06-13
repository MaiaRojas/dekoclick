import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import Content from './content';
import SelfAssessment from './self-assessment';
import PartTitle from './part-title';


const styles = theme => ({
  root: {
    maxWidth: theme.maxContentWidth,
    height: '100%',
    margin: '0 auto',
    background: '#fff',
  },
  meta: {
    display: 'flex',
    alignItems: 'left',
    marginBottom: theme.spacing.unit * 4,
  },
  metaChip: {
    marginRight: theme.spacing.unit / 2,
  },
  content: {
    padding: theme.spacing.unit * 4,
  },
});


const paramsToQueryStrign = params =>
  Object.keys(params).reduce(
    (memo, key) => (
      (params[key])
        ? `${memo ? `${memo}&` : ''}${key}=${encodeURIComponent(params[key])}`
        : memo
    ),
    '',
  );


const typeformUrlPattern = /https:\/\/[a-z0-9]+.typeform.com\/to\/([a-zA-Z0-9]+)/;


const partHasTypeforms = part =>
  (part && part.embeds && part.embeds.filter(embed => embed.type === 'form').length);


const processTypeFormUrls = (part, unitProgress, auth, profile, { params }, intl) => {
  if (!partHasTypeforms(part)) {
    return part.body;
  }

  const fragment = document.createElement('div');
  fragment.innerHTML = part.body;
  const iframes = fragment.getElementsByTagName('iframe');

  Array.prototype.slice.call(iframes).forEach((iframe) => {
    const matches = typeformUrlPattern.exec(iframe.src);
    const formProgress = matches && matches.length > 1 && unitProgress.find(
      item => item.partid === params.partid && item.formid === matches[1],
    );

    if (formProgress && formProgress.submittedAt) {
      const newNode = document.createElement('div');
      newNode.innerHTML = intl.formatMessage({ id: 'unit-part.formSubmitted' });
      iframe.parentNode.replaceChild(newNode, iframe);
      return;
    }

    Object.assign(iframe, {
      src: `${iframe.src}?${paramsToQueryStrign({
        uid: auth.uid,
        email: auth.email,
        fname: profile.name || auth.displayName,
        ...params,
      })}`,
    });
  });

  return fragment.innerHTML;
};


// const UnitPart = ({
//   unit,
//   unitProgress,
//   parts,
//   part,
//   partProgress,
//   intl,
//   auth,
//   classes,
//   match,
// }) => (
//   <div className={classes.root}>
//     <div className={classes.meta}>
//       <Chip
//         className={classes.metaChip}
//         label={`Tipo: ${part.type}`}
//       />
//       <Chip
//         className={classes.metaChip}
//         label={`Formato: ${part.format}`}
//       />
//     </div>
//     {part.type === 'self-assessment' &&
//       <SelfAssessment match={match} unit={unit} parts={parts} progress={partProgress} />
//     }
//     {part.body && <Content html={processTypeFormUrls(part, unitProgress, auth, match, intl)} />}
//   </div>
// );

class UnitPart extends React.Component {
  componentDidMount() {
    if (partHasTypeforms(this.props.part)) {
      window.addEventListener('message', this.handleTypeformSubmit);
    }
  }

  componentWillUnmount() {
    if (partHasTypeforms(this.props.part)) {
      window.removeEventListener('message', this.handleTypeformSubmit);
    }
  }


  render() {
    const {
      unit,
      unitProgress,
      parts,
      part,
      partProgress,
      intl,
      auth,
      profile,
      classes,
      match,
    } = this.props;
    return (
      <div className={classes.root}>
        <PartTitle unit={this.props} type={part.type} />
        {part.type === 'self-assessment' &&
          <SelfAssessment
            match={match}
            unit={unit}
            parts={parts}
            progress={partProgress}
          />
        }
        {part.body && (
          <div className={classes.content}>
            <Content html={processTypeFormUrls(part, unitProgress, auth, profile, match, intl)} />
          </div>
        )}
      </div>
    );
  }
}


UnitPart.propTypes = {
  unit: PropTypes.shape({}).isRequired,
  unitProgress: PropTypes.arrayOf(PropTypes.shape({})),
  parts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  part: PropTypes.shape({
    type: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    body: PropTypes.string,
  }).isRequired,
  partProgress: PropTypes.shape({}),
  intl: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    meta: PropTypes.string.isRequired,
    metaChip: PropTypes.string.isRequired,
  }).isRequired,
  auth: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      partid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  profile: PropTypes.shape({}).isRequired,
};


UnitPart.defaultProps = {
  unitProgress: undefined,
  partProgress: undefined,
};


export default compose(
  injectIntl,
  withStyles(styles),
)(UnitPart);
