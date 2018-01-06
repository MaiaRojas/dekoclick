# Laboratoria LMS

[![Build Status](https://travis-ci.com/Laboratoria/lms.laboratoria.la.svg?token=4uyuoxi9qhvAfjzUTB6y&branch=master)](https://travis-ci.com/Laboratoria/lms.laboratoria.la)

**Laboratoria LMS** ([lms.laboratoria.la](https://lms.laboratoria.la/)) es la interfaz principal de nustro
entorno de aprendizaje. Este repo lo maneja el _core team_ de productos de
Laboratoria.

* URL de producción: https://lms.laboratoria.la/
* URL de staging/QA: https://laboratoria-la-lms-staging.firebaseapp.com/

## Dependencias

* `node` v8.x
* `yarn`
* `firebase` (`npm i -g firebase-tools`)

## Instalación local

```sh
# clona repo desde tu fork
git clone git@github.com:<github-username>/lms.laboratoria.la.git
# entra en directorio de tu copia local del repo
cd lms.laboratoria.la
# instala las dependencias de Node.js declaradas en `package.json`
yarn install
```

## Arrancando la aplicación localmente

```sh
# arrancar usando backend de producción
yarn start:production

# arrancar usando backend de staging
yarn start:staging

# arrancar usando backend de desarrollo
export FIREBASE_PROJECT=laboratoria-la-dev-lupo
export FIREBASE_API_KEY=xxxxx
export FIREBASE_MESSAGING_SENDER_ID=123456
yarn start
```

## Build

```sh
# arrancar usando backend de producción
yarn build:production

# arrancar usando backend de staging
yarn build:staging

# ejecutar build usando backend de desarrollo
export FIREBASE_PROJECT=laboratoria-la-dev-lupo
export FIREBASE_API_KEY=xxxxx
export FIREBASE_MESSAGING_SENDER_ID=123456
yarn build
```

## Backend/API de desarrollo

...

## Despliegue

```sh
# desplegar usando backend de producción
yarn build:production
yarn deploy:production

# desplegar usando backend de staging
yarn build:staging
yarn deploy:staging

# desplegar usando backend de desarrollo
export FIREBASE_PROJECT=laboratoria-la-dev-lupo
export FIREBASE_API_KEY=xxxxx
export FIREBASE_MESSAGING_SENDER_ID=123456
yarn build
firebase deploy --only hosting --project "${FIREBASE_PROJECT}"
```
