# Laboratoria LMS

**Laboratoria LMS** ([lms.laboratoria.la](https://lms.laboratoria.la/)) es la interfaz principal de nustro
entorno de aprendizaje. Este repo lo maneja el _core team_ de productos de
Laboratoria.

## Entorno de desarrollo

### Dependencias

* `node`
* `yarn`
* `firebase`

### Backend de desarrollo

1. Crea un proyecto nuevo en [Firebase](https://firebase.google.com/)
2. En sección "Authentication" del proyecto de Firebase habilita "Correo
   electrónico/contraseña" como proveedor de acceso.
3. En terminal, añade proyecto con `firebase use --add`
4. Selecciona proyecto _default_ (producción): `firebase use default`
5. Exporta usuarios: `firebase auth:export auth.json`
6. Exporta base de datos: `firebase database:get / > db.json`
7. Selecciona proyecto _dev_ (desarrollo): `firebase use dev`
8. Importa usuarios:
   ```
   firebase auth:import \
     --hash-algo=SCRYPT \
     --hash-key='rZC0qVE/tDNGuU4eBWlCZLQcoKXZmH7qwf+0MS3DUueBOjrNUQAq98icUXEPk/VqzEG6lvhVGESjTjXZ2PLr2A==' \
     --salt-separator='Bw==' \
     --rounds=8 \
     --mem-cost=14 \
     auth.json
  ```
9. Importa base de datos: `firebase database:set / db.json`

## Entorno de staging / QA

### Core team

Si eres parte del core team, sigue estos pasos:

- Clona el proyecto
- Crea una nueva rama (`git checkout -b improve-feature`)
- Ejecuta `yarn install` para descargar todas las dependencias
- Para ejecutar el proyecto corre el comando (`npm start`)
- Cuando hayas terminado crea un pull request hacia la rama master para mezclar
  tus cambios

### Externo

Si no eres parte del core team, pero quieres colaborar sigue los siguientes
pasos:

- Haz un fork del proyecto
- Realizar tus cambios necesarios
- Cuando hayas terminado crea un pull request hacia la rama master con tus
  cambios sugeridos

## Despliegue

Firebase...

```sh
yarn run build
firebase deploy --only hosting
```
