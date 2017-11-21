import md5 from 'blueimp-md5';


const gravatarUrl = (email, opts) =>
  `https://www.gravatar.com/avatar/${md5(email)}?s=${opts.size || 40}`;


export default gravatarUrl;
