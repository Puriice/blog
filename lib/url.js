const url = (process.env.NODE_ENV === 'development') ? 'http://192.168.1.43:3000/' : ''
console.log(url);
export default url;