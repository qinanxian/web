import { getItem } from './cache';

const getHashUrl = () => {
  const hash = window.location.hash;
  // 1.去除无用的参数
  const url = hash.split('?')[0] || '';
  return url.replace('#', '');
};

const getPermissionData = (matchData, url, permissionData = { datascope: [], action: [], startPath: '' }) => {
  return matchData.reduce((pre, next) => {
    let tempPre = {...pre};
    if (url.startsWith(`/${next.url}`) || (url === `/${next.url}`)) {
      if (next.url) { // 去除空url对数据的影响
        tempPre.startPath = next.path;
      }
      // 获取该节点的权限数据(权限信息保存在children字段中)
      if (next.children) {
        // 获取该子节点数组中的所有权限字段(type:action,datascope)
        tempPre = next.children.reduce((preData, nextChild) => {
          const tempPreData = {...preData};
          const types = ['datascope', 'action'];
          types.forEach((type) => {
            if (type === nextChild.type) {
              // 如果当前的节点存在权限则需要赋值否则取上一层的权限
              const childrenData = nextChild.children;
              tempPreData[type] =
                childrenData.length > 0 ? childrenData : (tempPreData[type] || []);
            }
          });
          return tempPreData;
        }, tempPre);
        // 获取下一层的权限信息,如果下层节点包含权限信息则以下层的权限信息为主
        return getPermissionData(next.children, url, tempPre);
      }
    }
    return tempPre;
  }, permissionData);
};

export const getCurrentPermission = () => {
  // 1.获取地址栏的hash值
  const url = getHashUrl();
  // 2.获取权限缓存值
  const permissionData = JSON.parse(getItem('menu'));
  // 3.合并权限，返回具体的权限数据
  return getPermissionData(permissionData, url);
};

export const hasPermit = (permitCode) => {
  const permission = getCurrentPermission();
  const { action = [] } = permission || {};
  return (action.length === 0) ||
    (action.length > 0 && action.map(a => a.permitCode).includes(permitCode));
};
