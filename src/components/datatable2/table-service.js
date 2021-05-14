/**
 * Created by hjtu (hjtu@amarsoft.com) on 2018/1/4.
 */
import * as rest from '../../lib/rest';
/*eslint-disable consistent-return*/
export function queryTableTplAndData(dono, params, pageIndex, pageSize, sortCode = 'ASC') {
  let url = '/dataform/data/list';
  if (!dono) {
    return;
  }
  url += `/${dono}`;
  let paramStr = '1=1';
  if (params) {
    paramStr = Object.keys(params).map((key) => {
      return `${key}=${params[key]}`;
    }).join(';');
  }
  url += `/${paramStr}`;
  url += `/sort_code=${sortCode}`;
  url += `/${pageIndex}-${pageSize}`;
  return rest.get(url);
}

export function saveTableData(dono, listData){
  const url = `/dataform/save/list/${dono}`;
  return rest.post(url, listData);
}

export function deleteTableData(dono, listData){
  const url = `/dataform/delete/list/${dono}`;
  return rest.post(url, listData);
}

