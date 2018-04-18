export default {
  'signin.signin': 'Sign in',
  'signin.signup': 'Create account',
  'signin.forgot': 'Reset password',
  'signin.signupWithFacebook': 'Sign up with Facebook',
  'signin.signinWithFacebook': 'Sign in with Facebook',
  'signin.name': 'Full name',
  'signin.email': 'Email',
  'signin.password': 'Password',
  'signin.verifyPassword': 'Verify password',
  'signin.errors.invalidName': 'Please enter your full name',
  'signin.errors.invalidEmail': 'Please enter a valid email',
  'signin.errors.invalidPassword': 'Password can not be empty',
  'signin.errors.passwordMissmatch': 'Password missmatch',
  'signin.enrollment': 'Admissions enrollment for our {campus} campus.',
  'signin.fbAccountExistsWithSameEmail':
    `An account already exists for {email}. If you want to connect your facebook
    account to your Laboratoria account, please confirm your Laboratoria
    password:`,
  'signin.fbConnect': 'Connect your Facebook account',

  'main-nav.courses': 'My courses',
  'main-nav.settings': 'Settings',
  'main-nav.signout': 'Sign out',

  'courses.title': 'Courses',
  'courses.noCoursesWarning': [
    'It looks like no courses are associated to your account. If you think',
    'this is a mistake, please contact your instructor or training manager',
    'to verify your account.',
  ].join(' '),

  'course-card.units': '{count, plural, =0 { no units } one {# unit} other {# units}}',
  'course-card.estimatedDuration': 'Estimated duration',
  'course-card.start': 'Start',
  'course-card.continue': 'Continue',
  'course-list.content': 'This cohort does not have any courses.',


  'unit-card.unit': 'Unit',
  'unit-card.parts': '{count, plural, =0 { no parts } one {# part} other {# parts}}',
  'unit-card.estimatedDuration': 'Estimated duration',
  'unit-card.start': 'Start',
  'unit-card.continue': 'Continue',

  'unit-part.formSubmitted': 'This form has already been submitted',

  'unit-part-tracker:markAsRead': 'Mark as read',

  'unit.selfAssessment': 'Self assessment',

  'self-assessment.title': 'Self assessment',
  'self-assessment.sentiment': 'This is how I feel about the unit I just completed...',
  'self-assessment.feelings': 'Why do you feel like that?',
  'self-assessment.topics': 'Check all parts that you feel you don\'t yet understand',
  'self-assessment.improvements': 'Is there anything you would like to highlight or improve in this unit?',
  'self-assessment.send': 'Send self assessment',
  'self-assessment.submittedOn': 'Self assessment submitted on',

  'quiz.warnBeforeStart': `You can answer this quiz only once and you will
    have {duration} minutes to do so. After this time has passed, the quiz
    will be blocked and you will not be able to continue answering questions.`,
  'quiz.areYouSure': 'Are you sure you want to start the quiz now?',
  'quiz.start': 'Yes, start quiz',
  'quiz.send': 'Submit',
  'quiz.title': 'Evaluation',

  'quiz-confirmation-dialog.title': 'Think twice...',
  'quiz-confirmation-dialog.content': `¿Are you absolutely sure that you want
    to start answering this quiz? If you start now, you will have {duration}
    to complete it. After this time has passed, the quiz will be blocked and
    you will not be able to continue answering questions.`,
  'quiz-confirmation-dialog.cancel': 'Cancel',
  'quiz-confirmation-dialog.start': 'Yes, start now',

  'quiz-results.score': 'You already took this quiz and got a score of',

  'exercise-card.pending': 'Pending',
  'exercise-card.complete': 'Done',
  'exercise-card.incomplete': 'Unfinished',

  'exercise.problem': 'Problem',
  'exercise.code': 'Code',
  'exercise.runTests': 'Run tests',
  'exercise.reset': 'Reset',

  'exercise-test-results.failures': '{failures} out of {tests} tests failed',
  'exercise-test-results.passes': '{passes} tests passed ;-)',
};
