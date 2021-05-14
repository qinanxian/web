/**
 * Created by dpcui on 05/03/2018.
 */

const numReg = /(?!^[-\d\.][\d\.]*)[^\d\.]/g;

/* eslint-disable */
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

const formatCurrencyInt = (intPartX) => {
  let intPart = intPartX;
  if (intPart.charAt(0) === '-') {
    intPart = '-' + intPart.replace(/[^0-9.]*/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return intPart;
};

const formatCurrencyDecimal = (decimal, decimalDigits) => {
  const decimalPart = decimal.replace(/[^0-9]*/g, '');
  const precisionX = !isNaN(decimalDigits = Math.abs(decimalDigits)) ? decimalDigits : 0;
  return decimalPartRound(decimalPart, precisionX);
};

const decimalPartAddZero = (decimalPart, precision) => {
  if (decimalPart.length <= precision ) {
    let zero = '';
    for (let i = 0; i < precision - decimalPart.length; i++) {
      zero += '0';
    }
    return decimalPart + zero;
  }
  return decimalPart.slice(0, precision);
};

const decimalPartRound = (decimalPart, precision) => {
  if (Number(decimalPart[precision]) > 4) {
    let numberTmp = Number('0.' + decimalPart);
    numberTmp = changeDecimal(numberTmp, precision);
    return decimalPartAddZero(numberTmp.toString().slice(2), precision);
  }
  return decimalPartAddZero(decimalPart, precision);
};

const scopeValidate = (num) => {
  if (num > 9999999999999999) return 9999999999999999;
  else if (num < -9999999999999999) return -9999999999999999;
  else return num;
};

export const formatCurrency = (number, decimalDigits) => {
  let numStr = number.toString().replace(numReg, '');
  let num = scopeValidate(Number(numStr));
  num = changeDecimal(num, decimalDigits);
  numStr = num.toString();
  let decimalIndex = numStr.indexOf('.');
  decimalIndex = decimalIndex === -1 ? numStr.length : decimalIndex;
  let intPart = numStr.slice(0, decimalIndex);
  if (decimalDigits === 0) {
    return formatCurrencyInt(intPart);
  } else {
    intPart = numStr.slice(0, decimalIndex) || '0';
    let decimalPart = numStr.slice(decimalIndex + 1, numStr.length);
    return formatCurrencyInt(intPart) + '.' + formatCurrencyDecimal(decimalPart, decimalDigits);
  }
};


const formatNumberDecimal = (decimal, decimalDigits) => {
  const decimalPart = decimal.replace(/[^0-9]*/g, '');
  const precisionX = !isNaN(decimalDigits = Math.abs(decimalDigits)) ? decimalDigits : 0;
  return decimalPartRound(decimalPart, precisionX);
};

export const formatNumber = (number, decimalDigits) => {
  let numStr = number.toString().replace(numReg, '');
  let num = scopeValidate(Number(numStr));
  num = changeDecimal(num, decimalDigits);
  numStr = num.toString();
  let decimalIndex = numStr.indexOf('.');
  decimalIndex = decimalIndex === -1 ? numStr.length : decimalIndex;
  let intPart = numStr.slice(0, decimalIndex);
  if (decimalDigits === 0) {
    return intPart;
  } else {
    intPart = numStr.slice(0, decimalIndex) || '0';
    let decimalPart = numStr.slice(decimalIndex + 1, numStr.length);
    return intPart + '.' + formatNumberDecimal(decimalPart, decimalDigits);
  }
};

export const accAdd = (arg1, arg2) => {
  let r1, r2, m;
  try{ r1 = arg1.toString().split(".")[1].length } catch(e) { r1 = 0 }
  try{ r2 = arg2.toString().split(".")[1].length } catch(e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
};

export const accMul = (arg1, arg2) => {
  let m = 0,s1 = arg1.toString(), s2 = arg2.toString();
  try{ m += s1.split(".")[1].length } catch(e) {}
  try{ m += s2.split(".")[1].length } catch(e) {}
  return Number(s1.replace(".","")) * Number(s2.replace(".","")) / Math.pow(10,m);
};

export const accDiv = (arg1, arg2) => {
  let t1 = 0, t2 = 0, r1, r2;
  try{ t1 = arg1.toString().split(".")[1].length } catch(e) {}
  try{ t2 = arg2.toString().split(".")[1].length }catch(e) {}
  r1 = Number(arg1.toString().replace(".",""));
  r2 = Number(arg2.toString().replace(".",""));
  return (r1/r2) * Math.pow(10, t2-t1);
};
/* eslint-disable */
