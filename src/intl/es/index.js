export default {
  'signin.signin': 'Iniciar sesión',
  'signin.signup': 'Crear cuenta',
  'signin.forgot': '¿Olvidaste tu contraseña?',
  'signin.signupWithFacebook': 'Crear cuenta con Facebook',
  'signin.signinWithFacebook': 'Inicia sesión con Facebook',
  'signin.name': 'Nombre',
  'signin.email': 'Correo electrónico',
  'signin.password': 'Contraseña',
  'signin.verifyPassword': 'Verifica tu contraseña',
  'signin.errors.invalidName': 'Ingresa tu nombre',
  'signin.errors.invalidEmail': 'Correo electrónico no válido',
  'signin.errors.invalidPassword': 'Contraseña no válida',
  'signin.errors.passwordMissmatch': 'Verificación de contraseña no coincide',
  'signin.enrollment': 'Registro para nuestro proceso de selección en {campus}.',
  'signin.fbAccountExistsWithSameEmail':
    `Ya existe una cuenta registrada con el correo {email}. Si quieres vincular
    tu cuenta de Facebook a tu cuenta de Laboratoria, confirma tu contraseña de
    Laboratoria:`,
  'signin.fbConnect': 'Conecta tu cuenta de Facebook',

  'main-nav.courses': 'Mis cursos',
  'main-nav.settings': 'Configuración',
  'main-nav.signout': 'Cerrar sesión',

  'courses.title': 'Mis Cursos',
  'courses.noCoursesWarning': [
    'Hmmm... parece que todavía no hay ningún curso asociado a',
    'tu cuenta. Si crees que esto es un error, contacta a tu instructor o',
    'training manager para verificar tu cuenta.',
  ].join(' '),

  'course-card.units': '{count, plural, =0 { sin unidades } one {# unidad} other {# unidades}}',
  'course-card.estimatedDuration': 'Duración estimada',
  'course-card.start': 'Empezar',
  'course-card.continue': 'Continuar',

  'unit-card.unit': 'Unidad',
  'unit-card.parts': '{count, plural, =0 { sin partes } one {# parte} other {# partes}}',
  'unit-card.estimatedDuration': 'Duración estimada',
  'unit-card.start': 'Empezar',
  'unit-card.continue': 'Continuar',

  'unit-part.formSubmitted': 'Este formulario ya ha sido enviado',

  'unit-part-tracker:markAsRead': 'Marcar como leido',

  'unit.selfAssessment': 'Autoevaluación',

  'self-assessment.title': 'Autoevaluación',
  'self-assessment.sentiment': 'Así me siento sobre la unidad que acaba de terminar...',
  'self-assessment.feelings': '¿Por qué te sientes así?',
  'self-assessment.topics': 'Marca todos los temas que NO te han quedado claros',
  'self-assessment.improvements': '¿Hay algo que quieras destacar/mejorar de esta unidad?',
  'self-assessment.send': 'Enviar autoevaluación',
  'self-assessment.submittedOn': 'Autoevaluación completada el',

  'quiz.warnBeforeStart': `Puedes responder el cuestionario una sola vez y
    tendrás {duration} minutos para hacerlo. Pasados ese tiempo, el cuestionario
    se bloquea y no podrás seguir respondiendo.`,
  'quiz.areYouSure': '¿Estás segura de que quieres responder ahora?',
  'quiz.start': 'Sí, responder ahora',
  'quiz.send': 'Enviar',
  'quiz.title': 'Evaluación',

  'quiz-confirmation-dialog.title': 'Piénsalo bien...',
  'quiz-confirmation-dialog.content': `¿Estás totalmente segura de que quieres
    comenzar a responder ESTE quiz? Si comienzas ahora, tendrás {duration} para
    completar el cuestionario. Pasado ese tiempo, el cuestionario se bloquea y
    no podrás seguir respondiendo.`,
  'quiz-confirmation-dialog.cancel': 'Cancelar',
  'quiz-confirmation-dialog.start': 'Sí, comenzar ahora',

  'quiz-results.score': 'Ya respondiste este cuestionario y acertaste el',

  'exercise-card.pending': 'Pendiente',
  'exercise-card.complete': 'Completado',
  'exercise-card.incomplete': 'Incompleto',

  'exercise.problem': 'Enunciado',
  'exercise.code': 'Código',
  'exercise.runTests': 'Ejecutar tests',
  'exercise.reset': 'Resetear',

  'exercise-test-results.failures': '{failures} de {tests} tests fallaron',
  'exercise-test-results.passes': '{passes} tests pasaron ;-)',
};
