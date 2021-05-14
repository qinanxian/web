const resetData = (value,tabKey = 'tab8') => {
  const type = Object.prototype.toString.call(value).slice(8,-1);
  if (type === 'Array') {
    return {tabKey:tabKey,children:value.map(item => resetData(item,tabKey.concat('8')))};
  } else if (value.children && type === 'Object') {
    return {...value,tabKey:tabKey,children:value.children.map(items => resetData(items,tabKey.concat('8')))};
  }
  return {...value,tabKey:tabKey};
};

const depthFirstForFlat = (value) => {
  return value.map((items) => {
    if (items.children) {
      return [].concat(items).concat(...depthFirstForFlat(items.children));
    }
    return items;
  });
};

const getDepthName = (data,sortCode,retArr = []) => {
  let ret;
  if (data.children) {
    ret = data.children.filter(fit => sortCode.indexOf(fit.sortCode) === 0);
    retArr.push(ret[0].name);
    return getDepthName(ret[0],sortCode,retArr);
  }
  retArr.push(data.name);
  return retArr;
};

export const getValue = (value) => {
  try {
    return value && JSON.parse(value).address;
  } catch (err) {
    return value;
  }
};

export const restructureData = (data) => {
  return data && resetData(data);
};

export const flatData = (data) => {
  return data && data.children.length > 0 && depthFirstForFlat(data.children).reduce((ret,cur) => {
    return ret.concat(cur);
  });
};

export const getPreTabKey = (curTabKey) => {
  switch (curTabKey) {
    case 'tab88888': return 'tab8888';
    case 'tab8888': return 'tab888';
    case 'tab888': return 'tab88';
    case 'tab88': return 'tab8';
    default:
      return null;
  }
};

export const resetTabPanes = (panes,targetKey) => {
  const key = panes.length > 1 && panes[0].key === 'tab' && targetKey === panes[1].key ? 'tab' : null;
  if (targetKey === 'tab8888') {
    return {
      activeKey:key || 'tab888',
      panes:panes.filter(item => item.key !== 'tab8888' || item.key === 'tab'),
    };
  } else if(targetKey === 'tab888'){
    return {
      activeKey:key || 'tab88',
      panes:panes.filter(item => item.key !== 'tab8888' && item.key !== 'tab888' || item.key === 'tab'),
    };
  } else if (targetKey === 'tab88') {
    return {
      activeKey:key || 'tab8',
      panes:panes.filter(item => item.key === 'tab8' || item.key === 'tab'),
    };
  }
  return {
    activeKey:key || 'tab8',
    panes:panes.filter(item => item.key === 'tab8' || item.key === 'tab'),
  };
};

export const getAddressName = (data,value) => {
  return !value.children && getDepthName(data,value.sortCode);
};

export const fuzzySearch = (data,searchKey) => {
  return searchKey && data.filter(fit => fit.name.match(new RegExp(searchKey)));
};
