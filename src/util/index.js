import config from '../config.json';

/*
* get url prefix according to the env, default development
* */
export const getEnv = () => {
  let env = 'local';
  if (__ONLINE__) {
    env = 'online';
  } else if (__PRE__) {
    env = 'pre';
  } else if (__QAIF__) {
    env = 'qaif';
  } else if (__QAFC__) {
    env = 'qafc';
  } else if (__DEV__) {
    env = 'dev';
  } else if (__LOCAL__) {
    env = 'local';
  }
  return env;
};

export const getBaseUrl = () => {
  const address = config.apiAddress;
  if (__MOCK__) {
    return address.mock || location.origin;
  }
  return address[getEnv()];
};

export function createAction(type, ...argNames) {
  return function ca(...args) {
    const action = { type };
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index];
    });
    return action;
  };
}

export function formatMoney(num, reduce, precision, dropZero, fillZero, notMoney) {
  let newNum = +num;
  if (typeof newNum !== 'number' || Number.isNaN(num)) {
    newNum = 0;
  }
  const numStr = `${newNum}`;
  const nums = numStr.split('.');
  const digitalNum = (nums[1] || '').length;
  let resPrecision = digitalNum;

  if (reduce) {
    const leftNum = `${reduce}`.length - `${reduce}`.replace(/0/g, '').length;
    resPrecision = digitalNum + leftNum;
    newNum /= reduce;
  }

  if (typeof precision === 'number') {
    resPrecision = precision;
  }
  newNum = (+newNum).toFixed(resPrecision);
  const newNums = `${newNum}`.split('.');
  let integer = (newNums[0]).toString();
  if (!notMoney) {
    integer = (newNums[0]).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
  let res = newNums.length > 1 ? `${integer}.${newNums[1]}` : integer;
  if (dropZero) {
    res = res.replace(/0*$/, '').replace(/\.$/, '');
  }
  if (fillZero) {
    const fillNums = res.split('.');
    if ((fillNums[1] || '').length === 0) {
      res = `${res}.${'00000000000'.slice(0, fillZero)}`;
    } else {
      res = `${res}${'00000000000'.slice(0, Math.max(0, fillZero - fillNums[1].length))}`;
    }
  }
  return res;
}
