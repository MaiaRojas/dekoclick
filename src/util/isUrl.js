// eslint-disable-next-line no-useless-escape
const urlPattern = /(?:\w+:)?\/\/[^/]+([^?#]+)/;

const isUrl = url => urlPattern.test(url);

export default isUrl;
