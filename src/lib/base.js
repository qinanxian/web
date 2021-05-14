import { get } from './rest';
import config from './config';

/**
 * 获取当前登录用户的权限内的菜单数据，无层次结构，程序自行组装
 * 会话级控制不需要参数
 * @returns {*}
 */
export const getUserMenuList = () => {
    return get(config.webApi.userMenuList);
};

export const getUserPilot = () => {
    return get(config.webApi.userPilot);
};

export const getAllPilot = () => {
    return get(config.webApi.allPilot);
};

/**
 * 取所有的代码表集合
 * @param dictCode
 */
export const getDictList = () => {
    return get(config.webApi.dictList);
};
/**
 * 取单个代码项
 * @param dictCode
 */
export const getDictItem = (dictCode) => {
    return get(`${config.webApi.dictItem}/${dictCode}`);
};
/**
 * 取单个代码项树图
 * @param dictCode
 */
export const getDictTree = (dictCode) => {
  return get(`${config.webApi.dictItem}/${dictCode}/tree`);
};
/**
 * 取单个代码项的树结构
 * @param dataFormId
 * @param elementCode
 * @param param
 */
export const getDictItemTree = (dataFormId, elementCode, param) => {
  return get(`${config.webApi.dataFormDictTree}/${dataFormId}/${elementCode}/${param}`);
};
/**
 * 取参数项树图
 * @param paramCode
 */
export const getParamItemsTree = (paramCode) => {
    return get(`${config.webApi.paramItemsTree}/${paramCode}`);
};
