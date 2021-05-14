/* eslint-disable */
export const flatToTree = (data, params) => {
  /**
  * 将菜单的扁平结构转化为树状结构
  * @params data: 要转换到树形结构的数据，type=array
  * @params params: 树形结构中节点的命名，type=object
  * @returns: { data, params }:树结构和节点命名形式
  * */
  const menuMap = {};
  const menuData = data.slice(0);
  params = {
    sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    parentName: params && params.parentName ? params.parentName : 'parent',
    childrenName: params && params.childrenName ? params.childrenName : 'children',
    levelName: params && params.levelName ? params.levelName : 'level',
  };

  menuData.slice(0).map(item => {
    if (item[params.sortCodeName]) {
      menuMap[item[params.sortCodeName]] = item;
    } else {
      console.log(item.id + '--缺少sortCode');
    }
  });
  for(let id in menuMap) {
    const item = menuMap[id],
      codes = item[params.sortCodeName].trim().split('/'),
      parent = menuMap[codes.slice(0,codes.length - 1).join('/')] || null;
    if(parent){
      parent[params.childrenName] = parent[params.childrenName] || [];
      item[params.parentName] = parent;
      parent[params.childrenName].push(item);
    }
    item[params.levelName] = codes.length;
  }
  return { data: data, params: params };
};

export const removeLevelMore = (treeData, params) => {
  /**
  * 保留层级为1的树结构
  * @params treeData：树结构,type=array
  * @params params: 树形结构中节点的命名，type=object
  * */
    params = {
        sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    };
  const tempTreeData = treeData.slice(0);
  return tempTreeData.filter(menuItem => {
    const sortCodeItems = menuItem[params.sortCodeName] && menuItem[params.sortCodeName].split('/');
    if (sortCodeItems && sortCodeItems.length === 1) {
      return true;
    }
    return false;
  });
};

export const depthFirstSearch = (_menus, callback, params) => {
 /**
  * 深度优先遍历树结构
  * @params _menus: 树形结构数组数据, type=array
  * @params callback: 回调方法，用于将遍历到的值传递到调用层,type=function
  * @params params：参数,用于说明_menus中父子节点的名称, type=object
  * */
  const tempMenus = _menus.slice(0);
  params = {
    sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    parentName: params && params.parentName ? params.parentName : 'parent',
    childrenName: params && params.childrenName ? params.childrenName : 'children',
    levelName: params && params.levelName ? params.levelName : 'level',
  };

  tempMenus && tempMenus.map((curr) => {
    if (curr[params.childrenName]) {
      depthFirstSearch(curr[params.childrenName], callback, params);
    }
     // 删除环
     // delete curr[params.childrenName];
     // delete curr[params.parentName];
     // delete curr[params.levelName];
    callback(curr);
  });
};

export const breadthFirstRecursion = (treeData, params) => {
  /**
   *  树结构广度优先遍历
   * @param treeData 树形结构数组数据, type=array
   * @params params：参数,用于说明_menus中父子节点的名称, type=object
   * */
    params = {
        parentName: params && params.parentName ? params.parentName : 'parent',
        childrenName: params && params.childrenName ? params.childrenName : 'children',
    };
    let childrenNodes = [],
        children = params.childrenName,
        nodes = treeData;
    for (let item in treeData) {
        if (treeData[item][children]) {
            let temp = treeData[item][children];
            childrenNodes = childrenNodes.concat(temp);
        }
    }
    if (childrenNodes.length > 0) {
        nodes = nodes.concat(breadthFirstRecursion(childrenNodes, params));
    }
    return nodes;
};

export const breadthFirstSearch = (treeData, params) => {
  /**
   * 树结构广度优先遍历
   * @param treeData 树形结构数组数据, type=array
   * @params params：参数,用于说明_menus中父子节点的名称, type=object
   *
   */
    params = {
        sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
        parentName: params && params.parentName ? params.parentName : 'parent',
        childrenName: params && params.childrenName ? params.childrenName : 'children',
        levelName: params && params.levelName ? params.levelName : 'level',
    };
    let result = treeData, childrenName = params.childrenName;
    /* eslint-disable no-plusplus */
    for (let i = 0; i < result.length; i++) {
        const menuItem = result[i][childrenName];
        if (menuItem) {
            result = result.concat(menuItem);
        }
    }
    return result;
};

export const removeSurround = (value,params) => {
  params = {
    sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    parentName: params && params.parentName ? params.parentName : 'parent',
    childrenName: params && params.childrenName ? params.childrenName : 'children',
    levelName: params && params.levelName ? params.levelName : 'level',
  };
  return value.slice(0).map(item => {
    if (item[params.parentName]) {
      delete item[params.parentName];
    }
    if (item[params.childrenName]) {
      removeSurround(item[params.childrenName], params)
    }
    return item;
  });
};

export const reCoverSurround = (value,params,parent) => {
  params = {
    sortCodeName: params && params.sortCodeName ? params.sortCodeName : 'sortCode',
    parentName: params && params.parentName ? params.parentName : 'parent',
    childrenName: params && params.childrenName ? params.childrenName : 'children',
    levelName: params && params.levelName ? params.levelName : 'level',
  };
  return value.slice(0).map(item => {
    let result = item;
    if (parent) {
      result = {
        ...item,
        [params.parentName]:parent
      };
    }
    if (result[params.childrenName]){
      result = {
        ...result,
        [params.childrenName]:reCoverSurround(result[params.childrenName],params,result)
      }
    }
    return result;
  });
};

export const transFormKey = (key) => {
  const keyArr = key.split('.');
  let result = [];
  keyArr.map((item, index) => {
    if (index > 0) {
      result.push(result[index - 1] + '.' + item);
    } else {
      result.push(item);
    }
  });
  return result.filter(keyItem => keyItem !== 'root');
};

export const findMenuItem = (value,key,flag = true) => {
  let result = value.find(item => key === item.path);
  if (!result) {
    let childValue = value;
    const keyArr = transFormKey(key);
    keyArr.map((item,index) => {
      if (index + 1 === keyArr.length) {
        childValue = childValue.filter(it => it.path === item)[0];
      } else {
        childValue = childValue.filter(it => it.path === item)[0]['children'];
      }
    });
    result = childValue;
  }
  return result;
};

// export const findMenuItem = (value,key,flag = true) => {
//   let result = value.find(item => key === item.id);
//   if (!result) {
//     let curKey = key;
//     if (flag) {
//       curKey = transFormKey(key)[0];
//     }
//     const nextValue = value.filter(item => item.id === curKey);
//     result = findMenuItem(nextValue.children,curKey,false);
//   }
//   return result;
// };

