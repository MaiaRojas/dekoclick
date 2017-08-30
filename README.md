# Laboratoria LMS

**Laboratoria LMS** (_lms.laboratoria.la_) es la interfaz principal de nustro
entorno de aprendizaje. Este repo lo maneja el _core team_ de productos de
Laboratoria.

El objetivo principal de diseño es permitir a las alumnas consumir la curricula
y mostrarla de una forma amigable.

Es una plataforma regional usada para impartir los cursos del bootcamp y
educación continua.

Este enlace contiene la última versión del producto
[https://laboratoria-la.firebaseapp.com/](https://laboratoria-la.firebaseapp.com/)

## Desarrollo

Entorno de desarrollo?

### Dependencias

* `node`
* `yarn`
* `firebase`

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
