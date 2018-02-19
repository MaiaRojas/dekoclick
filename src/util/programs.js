export const programs = {
  pre: {
    id: 'pre',
    order: 0,
    name: 'Selección',
  },
  bc: {
    id: 'bc',
    order: 1,
    name: 'Bootcamp',
  },
  ec: {
    id: 'ec',
    order: 2,
    name: 'Educación continua',
  },
};


const sortByOrder = (a, b) => {
  if (programs[a].order > programs[b].order) {
    return 1;
  }
  if (programs[a].order < programs[b].order) {
    return 1;
  }
  return 0;
};


export const keys = Object.keys(programs).sort(sortByOrder);


export const sorted = keys.reduce((memo, key) => [
  ...memo,
  programs[key],
], []);


export const getById = id => programs[id];


export default {
  programs,
  keys,
  sorted,
  getById,
};
