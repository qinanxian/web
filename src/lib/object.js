export const filter = (obj, str) => {
  const tempObj = {...obj};
  let arr = str;
  if (!Array.isArray(arr)) {
    arr = str.split('.').filter(i => !!i);
  }
  if (arr.length === 1) {
    delete tempObj[arr[0]];
    return tempObj;
  }
  const field = arr.splice(0, 1);
  return filter(tempObj[field], arr);
};

export const filterProps = (obj, propNames) => {
  const objTmp = {...obj};
  if (Array.isArray(propNames)) {
    propNames.forEach((item) => {
      delete objTmp[item];
    });
  } else {
    delete objTmp[propNames];
  }
  return objTmp;
};


export const changeDecimal = (n, dicimal) => {
  let fn = parseFloat(n);
  let dici = parseInt(dicimal, 10);
  if (isNaN(fn) || isNaN(dici)) { // eslint-disable-line
    console.log('function:changeDecimal->parameter error');
    return false;
  }
  dici = Math.pow(10, dici); // eslint-disable-line
  fn = Math.round(fn * dici) / dici;
  return fn;
};
