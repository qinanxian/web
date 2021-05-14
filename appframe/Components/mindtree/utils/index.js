export function replaceObjectKey(object, key, replaceKey) {
  let newObject = {};
  if (typeof object === 'object') {
    const objectKeys = Object.keys(object);
    if (objectKeys.length) {
      objectKeys.map((tempKey) => { // eslint-disable-line
        if (tempKey === key) {
          newObject[replaceKey] = object[key];
        } else {
          if (tempKey === 'children') { // eslint-disable-line
            newObject[tempKey] = object[tempKey].map(childrenItem => replaceObjectKey(childrenItem, key, replaceKey)); // eslint-disable-line
          } else {
            newObject[tempKey] = object[tempKey];
          }
        }
      });
    } else {
      console.error('未获取到键，传入的对象参数为一个空对象');
    }
  } else {
    console.error('传入的参数不为一个完整的对象');
  }
  return newObject;
}

export function addProperty(object, property, defaultValue, isforceDefaultValues) {
  let newObject = {};
  if (typeof object === 'object') {
    const tempPropertyValue = isforceDefaultValues ? defaultValue : // eslint-disable-line
      ([property] in object ? object[property] : defaultValue);
    newObject = {
      ...object,
      [property]: tempPropertyValue,
    };
    if ('children' in object) {
      let children = [];
      if (object.children.length) {
        children = object.children
          .map(item => addProperty(item, property, defaultValue, isforceDefaultValues));
      }
      newObject = {
        ...object,
        [property]: tempPropertyValue,
        children,
      };
    }
  } else {
    console.error('传入的参数不为一个完整的对象');
  }
  return newObject;
}


export function removeProperty(object, removeKey) {
  let newObject = {};
  if (typeof object === 'object') {
    const objectKeys = Object.keys(object);
    if (objectKeys.length) {
      objectKeys.map((tempKey) => { // eslint-disable-line
        // 如果是需要移除的key，则不作处理,
        if (tempKey !== removeKey) {
          if (tempKey === 'children') {
            newObject[tempKey] =
              object[tempKey].map(childrenItem => removeProperty(childrenItem, removeKey));
          } else {
            newObject[tempKey] = object[tempKey];
          }
        }
      });
    } else {
      console.error('未获取到键，传入的对象参数为一个空对象');
    }
  } else {
    console.error('传入的参数不为一个完整的对象');
  }
  return newObject;
}
