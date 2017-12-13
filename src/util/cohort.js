export default {
  parse: (str) => {
    const parts = str.split('-');
    return {
      campus: parts[0],
      year: parseInt(parts[1], 10),
      month: parseInt(parts[2], 10),
      program: parts[3],
      track: parts[4],
      name: parts.slice(5).join('-'),
    };
  },
  stringify: ({
    campus,
    year,
    month,
    program,
    track,
    name,
  }) => `${campus}-${year}-${month}-${program}-${track}-${name}`,
};
