/**
 * Created by dpcui on 18/01/2018.
 */

import React from 'react';
import { Modal } from '../../../src/components';

const numReg = /(?!^[-\d\.][\d\.]*)[^\d\.]/g;

const indexColumn = {
  className: 'ro-data-table-first-td',
  title: '',
  dataIndex: '__i',
  key: '__i',
  width: 40,
  sortCode: '0',
  render: (text, record, index) => (
    <div
      key="__i"
      record={record}
      readOnly
    >
      {index + 1}
    </div>
  ),
};

const getDefaultWidthStyle = (item) => {
  switch (item.dataType) {
    case 'Date':
      return item.code === 'createdTime' ? '100px' : '150px';
    case 'Double':
      return '100px';
    default:
      return 'auto';
  }
};

const getDefaultAlignStyle = () => {
  return 'left';
};

export const useSortCode = (array) => {
  return array.sort((v1, v2) => {
    if (v1.sortCode && v2.sortCode) {
      return v1.sortCode.valueOf() - v2.sortCode.valueOf();
    }
    return 0;
  });
};

const setTableCellWidth = (htmlStyle,column) => {
  if (htmlStyle.width) {
    const ret = htmlStyle.width;
    return (typeof ret !== 'number' || (new RegExp(/^(100|[1-9]?\d(\.\d\d?)?)%$/).test(ret))) ?
      ret : Number(htmlStyle.width.replace(/[^0-9]/ig,''));
  }
  return getDefaultWidthStyle(column);
};

const divideIntoGroups = (value) => {
  return value.map((item) => {
    if (item.colSource.group) {
      if (item.colSource.subGroup) {
        return {
          ...item,
          group:item.colSource.group.indexOf(':') !== -1 ? item.colSource.group.split(':')[1] : item.colSource.group,
          subGroup:item.colSource.subGroup.indexOf(':') !== -1 ? item.colSource.subGroup.split(':')[1] : item.colSource.subGroup,
        };
      }
      return {
        ...item,
        group:item.colSource.group.indexOf(':') !== -1 ? item.colSource.group.split(':')[1] : item.colSource.group,
      };
    }
    return item;
  });
};
/* eslint-disable */
const transformColumns = (value,group) => {
  const finallyData = [];
  let itemObj = {};
  const exit = [];
  for (let i = 0; i < value.length; i ++) {
    if (!value[i][group]) {
      finallyData.push(value[i]);
    } else if (!exit.includes(value[i][group])){
      itemObj.title = value[i][group];
      itemObj.children = [].concat(value[i]);
      for (let j = i + 1; j < value.length; j ++) {
        if (value[i][group] === value[j][group]) {
          itemObj.children.push(value[j]);
        }
      }
      exit.push(value[i][group]);
      finallyData.push(itemObj);
      itemObj = {};
    }
  }
  return finallyData;
};

export const columnsHandler = (columns, renderColumn, lineNumber) => {
  let filtCol = columns && columns.filter(column => column.elementUIHint.visible) || [];
  useSortCode(filtCol);
  filtCol = filtCol.map((column) => {
    let htmlStyle = {};
    try {
      htmlStyle = (column.elementUIHint.htmlStyle && JSON.parse(column.elementUIHint.htmlStyle))
        || {};
    } catch (e) {
      Modal.error({
        title: '字段htmlStyle格式出错，请填写正确的JSON数据，检查是否有中文字符',
        content: `${column.name}[${column.code}]${column.elementUIHint.htmlStyle}`,
      });
    }
    return {
      title: column.name,
      dataIndex: column.code,
      key: column.code,
      sortCode: column.sortCode,
      sorter: column.sortable,
      align: htmlStyle.align || getDefaultAlignStyle(column),
      width: setTableCellWidth(htmlStyle,column),
      // width: htmlStyle.width && Number(htmlStyle.width) || getDefaultWidthStyle(column),
      render: (text, record, index) => renderColumn(text || column.defaultValue || text,
        column.elementUIHint.editStyle, record, index, column),
      colSource: column,
    };
  });
  filtCol = transformColumns(divideIntoGroups(filtCol),'group').map((item) => {
    if (item.children) {
      return {
        ...item,
        children:transformColumns(item.children,'subGroup'),
      };
    }
    return item;
  });
  if (lineNumber) {
    filtCol.unshift(indexColumn);
  }
  return filtCol;
};

export const addUUID = (dataSource) => {
  return dataSource.map((item) => {
    return {
      ...item,
      __key: item.__key || Math.uuid(),
    };
  });
};

export const serializeParam = (params, field) => {
  let str = '';
  if (typeof params === 'string') {
    str = params;
  } else if (Array.isArray(params) && field) {
    params.forEach((p) => {
      if (typeof p === 'string' || typeof p === 'number') {
        str = `${str};${field}=${p}`;
      }
    });
  } else {
    Object.keys(params).forEach((p) => {
      if (Array.isArray(params[p])) {
        str = `${str};${serializeParam(params[p], p)}`;
      } else {
        if (params[p] && params[p] !== 'undefined' || params[p] === null) {
          str = `${str};${p}=${params[p]}`;
        }
        str = `${str}`;
      }
    });
  }
  return str.replace(/^;/g, '');
};

export const updateSorterParam = (params) => {
  const tempParams = {...params};
  Object.keys(params).forEach((param) => {
    if (!params[param].sortType) {
      delete tempParams[param];
    } else {
      tempParams[param] = tempParams[param].sortType;
    }
  });
  return encodeURIComponent(serializeParam(tempParams));
};

export const getDictName = (dict, field, value, comp) => {
  const options = (dict[field] || []);
  if (comp === 'CheckBox' && value) {
    const valueArr = value.split(',');
    const dicArr = options.filter(op => valueArr.includes(op.code));
    return dicArr.length > 0 ? dicArr.map(item => item.name).toString() : value;
  }
  const dicName = options.filter(op => op.code === value)[0];
  if (dicName) {
    return dicName.name || value;
  }
  return value;
};
export const getDictCode = (dict, field, name) => {
  const options = (dict[field] || []);
  const dicCode = options.filter(op => op.name === name)[0];
  if (dicCode) {
    return dicCode.code || name;
  }
  return name;
};
export const getDictItem = (dict, field, value) => {
  const options = (dict[field] || []);
  return options.filter(op => op.code === value)[0];
};

/* eslint-disable */
export const reduceObj = (obj, dict) => {
 for (let key in obj) {
   if (!obj[key]) {
     delete obj[key];
   } else if (dict[key]) {
     obj[key] = getDictCode(dict, key, obj[key]);
   }
 }
 return obj;
};
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
