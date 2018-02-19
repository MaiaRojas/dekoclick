import React from 'react';
import PropTypes from 'prop-types';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import pt from 'react-intl/locale-data/pt';
import messages from './messages';


addLocaleData([ ...en, ...es, ...pt ]);


const prefixToLocale = {
  en: 'en-US',
  es: 'es-ES',
  pt: 'pt-BR',
};


const browserLocale =
  (navigator.languages && navigator.languages[0])
  || navigator.language
  || navigator.userLanguage;


const getLocale = (preferredLang) => {
  if (preferredLang && messages[preferredLang]) {
    return preferredLang;
  } else if (preferredLang && messages[prefixToLocale[preferredLang.split('-')[0]]]) {
    return prefixToLocale[preferredLang.split('-')[0]];
  } else if (browserLocale && messages[browserLocale]) {
    return browserLocale;
  } else if (browserLocale && messages[prefixToLocale[browserLocale.split('-')[0]]]) {
    return prefixToLocale[browserLocale.split('-')[0]];
  } else {
    return 'es-ES';
  }
};


const Intl = (props) => {
  const locale = getLocale(props.profile.preferredLang);
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {props.children}
    </IntlProvider>
  );
};


export default Intl;
