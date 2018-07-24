const programs = {
  // pre: {
  //   id: 'pre',
  //   order: 0,
  //   name: 'Selección',
  // },
  // bc: {
  //   id: 'bc',
  //   order: 1,
  //   name: 'Bootcamp',
  // },
  // jp: {
  //   id: 'jp',
  //   order: 2,
  //   name: 'Job placement',
  // },
  // ec: {
  //   id: 'ec',
  //   order: 3,
  //   name: 'Educación continua',
  // },
  // l4b: {
  //   id: 'l4b',
  //   order: 4,
  //   name: 'L4B',
  // },
};

const packages = {
  classic: {
    id: 'classic',
    order: 0,
    name: 'Clásico',
  },
  premium: {
    id: 'premium',
    order: 1,
    name: 'Premium',
  },
  exclusive: {
    id: 'exclusive',
    order: 2,
    name: 'Exclusivo',
  },
};

const types = {
  modern: {
    id: 'modern',
    order: 0,
    name: 'Moderno',
  },
  electric: {
    id: 'electric',
    order: 1,
    name: 'Eléctrico',
  },
  contemporary: {
    id: 'contemporary',
    order: 2,
    name: 'Contemporáneo',
  },
  classic: {
    id: 'classic',
    order: 3,
    name: 'Clásico',
  },
};

const times = {
  two: {
    id: 'two',
    order: 0,
    name: '2 días',
  },
  five: {
    id: 'five',
    order: 1,
    name: '5 días',
  },
  eight: {
    id: 'eight',
    order: 2,
    name: '8 días',
  },
  fifteen: {
    id: 'fifteen',
    order: 3,
    name: '15 días',
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
  packages,
  types,
  times,
  keys,
  sorted,
  getById,
};
