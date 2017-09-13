# Laboratoria LMS

[![Build Status](https://travis-ci.com/Laboratoria/lms.laboratoria.la.svg?token=4uyuoxi9qhvAfjzUTB6y&branch=master)](https://travis-ci.com/Laboratoria/lms.laboratoria.la)

**Laboratoria LMS** ([lms.laboratoria.la](https://lms.laboratoria.la/)) es la interfaz principal de nustro
entorno de aprendizaje. Este repo lo maneja el _core team_ de productos de
Laboratoria.

* URL de producción: https://lms.laboratoria.la/
* URL de staging/QA: https://laboratoria-la-staging.firebaseapp.com/

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
yarn run build
```

## Backend de desarrollo

Si necesitas tu propio backend de desarrollo, crea un proyecto nuevo en
[Firebase](https://firebase.google.com/) y en la sección "Authentication" del
proyecto (en la interfaz web de Firebase) habilita "Correo
electrónico/contraseña" como proveedor de acceso.

```sh
# Exporta usuarios
firebase --project laboratoria-la auth:export auth.json
# Exporta base de datos
firebase --project laboratoria-la database:get / > db.json
# Importa usuarios
firebase --project laboratoria-la-dev-lupo auth:import \
  --hash-algo=SCRYPT \
  --hash-key='rZC0qVE/tDNGuU4eBWlCZLQcoKXZmH7qwf+0MS3DUueBOjrNUQAq98icUXEPk/VqzEG6lvhVGESjTjXZ2PLr2A==' \
  --salt-separator='Bw==' \
  --rounds=8 \
  --mem-cost=14 \
  auth.json
# Importa base de datos
firebase --project laboratoria-la-dev-lupo database:set / db.json
```

## Despliegue

```sh
# desplegar usando backend de producción
yarn run build:production
yarn run deploy:production

# desplegar usando backend de staging
yarn run build:staging
yarn run deploy:staging

# desplegar usando backend de desarrollo
export FIREBASE_PROJECT=laboratoria-la-dev-lupo
export FIREBASE_API_KEY=xxxxx
export FIREBASE_MESSAGING_SENDER_ID=123456
yarn run build
firebase deploy --only hosting --project "${FIREBASE_PROJECT}"
```
