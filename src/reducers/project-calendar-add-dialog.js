// Action types
const TOGGLE = 'www.laboratoriodigital.pe/cohortCalendarAddDialog/TOGGLE';
const UPDATE_FIELD = 'www.laboratoriodigital.pe/cohortCalendarAddDialog/UPDATE_FIELD';
const VALIDATE_AND_SUBMIT = 'www.laboratoriodigital.pe/cohortCalendarAddDialog/VALIDATE_AND_SUBMIT';
const RESET = 'www.laboratoriodigital.pe/cohortCalendarAddDialog/RESET';


// Action Creators
export const toggleCohortCalendarAddDialog = obj => ({
  type: TOGGLE,
  payload: obj,
});

export const updateCohortCalendarAddDialogField = (key, value) => ({
  type: UPDATE_FIELD,
  payload: { key, value },
});

export const validateAndSubmitCohortCalendarAddDialogForm = () => ({
  type: VALIDATE_AND_SUBMIT,
});

export const resetCohortCalendarAddDialog = () => ({
  type: RESET,
});


const validTypes = ['classroom', 'webinar', 'interview', 'milestone', 'other'];


export const validateCalendarEventField = (key, value, state) => {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  switch (key) {
    case 'type':
      return {
        err: validTypes.indexOf(value) === -1
          ? `Invalid type. Must be one of ${validTypes} and got ${value}`
          : null,
        sanitized: value,
      };
    case 'title':
      return {
        err: (!trimmed) ? 'Title is required' : null,
        sanitized: trimmed,
      };
    case 'allDay':
      return {
        err: (typeof value !== 'boolean') ? 'allDay must be a boolean' : null,
        sanitized: value,
      };
    case 'start':
      return {
        err: (!(value instanceof Date)) ? 'Start must be a date/time' : null,
        sanitized: value,
      };
    case 'end':
      return {
        err: (!state.data.allDay && !(value instanceof Date))
          ? 'End must be a date/time when allDay is false'
          : null,
        sanitized: value,
      };
    case 'allCohort':
      return {
        err: (typeof value !== 'boolean')
          ? 'allCohort must be a boolean'
          : null,
        sanitized: value,
      };
    case 'invitees':
      return {
        err: (!Array.isArray(value))
          ? 'invitees must be an array of user uids'
          : null,
        sanitized: value,
      };
    default:
      return {
        err: null,
        sanitized: value,
      };
  }
};


const initialState = {
  open: false,
  data: {
    id: null,
    type: '',
    title: '',
    description: '',
    start: null,
    end: null,
    allDay: false,
    allCohort: true,
    invitees: [],
  },
  errors: {},
  isValid: undefined,
};


const validateCalendarEventFields = (data, state) =>
  Object.keys(state.data).reduce((memo, key) => {
    const { err, sanitized } = validateCalendarEventField(key, data[key], state);
    return err
      ? { ...memo, errors: { ...memo.errors, [key]: err } }
      : { ...memo, sanitized: { ...memo.sanitized, [key]: sanitized } };
  }, {
    errors: {},
    sanitized: {},
  });


const handleToggleAction = (state, payload) => {
  if (state.open) {
    return { ...initialState };
  }

  if (!payload) {
    return { ...state, open: !state.open };
  }

  const { sanitized } = validateCalendarEventFields(payload, state);

  return {
    ...state,
    open: !state.open,
    data: (payload && payload.id)
      ? { ...state.data, ...sanitized }
      : state.data,
  };
};


const handleUpdateFieldAction = (state, action) => {
  const { key, value } = action.payload;
  const { err, sanitized } = validateCalendarEventField(key, value, state);
  if (err) {
    return {
      ...state,
      isValid: undefined,
      data: { ...state.data, [key]: sanitized },
      errors: { ...state.errors, [key]: err },
    };
  }
  return {
    ...state,
    isValid: undefined,
    data: { ...state.data, [key]: sanitized },
    errors: !state.errors[key]
      ? state.errors
      : Object.keys(state.errors).reduce((memo, errorKey) => {
        if (errorKey === key) {
          return memo;
        }
        return { ...memo, [errorKey]: state.errors[errorKey] };
      }, {}),
  };
};


const handleValidateAndSubmitAction = (state) => {
  const errors = Object.keys(state.data).reduce((memo, key) => {
    const { err } = validateCalendarEventField(key, state.data[key], state);
    return (err) ? { ...memo, [key]: err } : memo;
  }, {});
  return {
    ...state,
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};


// Reducer
export default (state = { ...initialState }, action = {}) => {
  switch (action.type) {
    case TOGGLE:
      return handleToggleAction(state, action.payload);
    case UPDATE_FIELD:
      return handleUpdateFieldAction(state, action);
    case VALIDATE_AND_SUBMIT:
      return handleValidateAndSubmitAction(state);
    case RESET:
      return { ...initialState };
    default:
      return state;
  }
};
