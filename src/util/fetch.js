import 'whatwg-fetch';
import { getBaseUrl } from '../util';

const isField = (val) => (typeof val === 'object') && !(val instanceof Array) && 'value' in val && !(val._d);

const isTokenInvalid = (json) => json.resultCode === '0004' || json.resultCode === '0002';

const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  const res = {};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = params[key];
    if (isField(value)) {
      if (value.type === 'month') {
        res[key] = value.format('YYYY-MM');
      } else if (value.type === 'datetimeRange' || value.type === 'numberRange') {
        res[`${key}Start`] = value[0];
        res[`${key}End`] = value[1];
      } else if (value.type === 'dateRange') {
        res[`${key}Start`] = value[0].format('YYYY-MM-DD 00:00:00');
        res[`${key}End`] = value[1].format('YYYY-MM-DD 23:59:59');
      } else if (value.type === 'monthRange') {
        res[`${key}Start`] = value[0].format('YYYY-MM');
        res[`${key}End`] = value[1].format('YYYY-MM');
      } else {
        res[key] = value.value;
        (typeof res[key] === 'string') && res[key].trim();
      }
    } else {
      res[key] = value;
    }
  }
  return res;
};

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${localStorage.getItem('accessToken')}`,
    },
  };

  const newOpts = {
    ...defaultOpts,
    ...opts,
  };

  if (newOpts.method === 'POST') {
    newOpts.body = JSON.stringify(decorateParams(params));
  }
  return fetch(url.indexOf('//') > -1 ? url : (getBaseUrl() + url), newOpts)
    .then((res) => {
      if (res.status < 200 || res.status >= 300) {
        // location.assign('/Error'); // go to error page
        return {
          resultCode: '-1',
          resultDesc: `${res.status} ${res.statusText}`,
        };
      }
      const contentType = res.headers.get('content-type');
      if (contentType.indexOf('application/json') > -1) {
        return res.json();
      }
      return res.blob();
    })
    .then((json) => {
      if (json.type) { // blob
        return json;
      }
      if (isTokenInvalid(json)) { // 登录过期或未登录
        localStorage.setItem('accessToken', '');
        localStorage.setItem('user', '{}');
        location.assign('/SignIn');
      }
      return json;
    })
    .catch(() => ({
      resultCode: '-1',
      resultDesc: '网络异常，请重试',
    }));
};
