const programs = {
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
  jp: {
    id: 'jp',
    order: 2,
    name: 'Job placement',
  },
  ec: {
    id: 'ec',
    order: 3,
    name: 'Educación continua',
  },
};


const sortByOrder = (a, b) => {
  if (programs[a].order > programs[b].order) {
    return 1;
  }
  if (programs[a].order < programs[b].order) {
    return -1;
  }
  return 0;
};


const keys = Object.keys(programs).sort(sortByOrder);


const sorted = keys.reduce((memo, key) => [
  ...memo,
  programs[key],
], []);


const getById = id => programs[id];


export default {
  programs,
  keys,
  sorted,
  getById,
};
