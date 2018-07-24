import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { CircularProgress } from 'material-ui/Progress';
import { addLocaleData, IntlProvider } from 'react-intl';

import es from 'react-intl/locale-data/es';

import messages from './messages';


addLocaleData([ ...es]);


const prefixToLocale = {
  es: 'es-ES',
};


const browserLocale =
  (navigator.languages && navigator.languages[0])
  || navigator.language
  || navigator.userLanguage;


const getLocale = (preferredLang, campuses) => {
  if (preferredLang && messages[preferredLang]) {
    return preferredLang;
  }
  if (preferredLang && messages[prefixToLocale[preferredLang.split('-')[0]]]) {
    return prefixToLocale[preferredLang.split('-')[0]];
  }

  // If in signup page we try to guess locale from signup cohort
  const pathnameParts = window.location.pathname.split('/').slice(1);
  if (pathnameParts[0] === 'signup') {
    const campusid = (pathnameParts[1] || '').split('-')[0];
    const campus = campuses.find(item => item.id === campusid);
    if (campus && campus.locale) {
      if (messages[campus.locale]) {
        return campus.locale;
      }
      if (messages[prefixToLocale[campus.locale.split('-')[0]]]) {
        return prefixToLocale[campus.locale.split('-')[0]];
      }
    }
  }

  if (browserLocale && messages[browserLocale]) {
    return browserLocale;
  }
  if (browserLocale && messages[prefixToLocale[browserLocale.split('-')[0]]]) {
    return prefixToLocale[browserLocale.split('-')[0]];
  }

  return 'es-ES';
};


const Intl = (props) => {
  if (!props.campuses) {
    return <CircularProgress />;
  }

  const locale = getLocale(props.profile.locale, props.campuses);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {props.children}
    </IntlProvider>
  );
};


Intl.propTypes = {
  profile: PropTypes.shape({
    locale: PropTypes.string,
  }).isRequired,
  children: PropTypes.element.isRequired,
  campuses: PropTypes.arrayOf(PropTypes.shape({})),
};


Intl.defaultProps = {
  campuses: undefined,
};


export default compose(
  firestoreConnect(() => [{ collection: 'campuses' }]),
  connect(({ firestore }) => ({
    campuses: firestore.ordered.campuses,
  })),
)(Intl);
